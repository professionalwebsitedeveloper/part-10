/**
 * Validates the app's exact GraphQL documents against the pre-deployed
 * production Rate Repository API (schema compatibility).
 * Usage from the rate-repository-app directory:
 *   node scripts/check-prod-api.mjs
 */

const API = 'https://rate-repository-api-2.ext.ocp-prod-0.k8s.it.helsinki.fi/graphql';

const post = async (query, variables) => {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return { status: res.status, raw: text.slice(0, 200) };
  }
  return { status: res.status, body };
};

// Mirrors GET_REPOSITORIES in src/graphql/queries.js
const LIST = `
  query repositories($orderBy: AllRepositoriesOrderBy, $orderDirection: OrderDirection, $searchKeyword: String) {
    repositories(orderBy: $orderBy, orderDirection: $orderDirection, searchKeyword: $searchKeyword) {
      edges {
        node {
          id
          fullName
          description
          language
          ownerAvatarUrl
          stargazersCount
          forksCount
          reviewCount
          ratingAverage
        }
      }
    }
  }
`;

// Mirrors GET_REPOSITORY in src/graphql/queries.js
const SINGLE = `
  query repository($id: ID!, $first: Int, $after: String) {
    repository(id: $id) {
      id
      fullName
      description
      language
      ownerAvatarUrl
      stargazersCount
      forksCount
      reviewCount
      ratingAverage
      url
      reviews(first: $first, after: $after) {
        totalCount
        edges {
          node {
            id
            text
            rating
            createdAt
            user {
              id
              username
            }
          }
          cursor
        }
        pageInfo {
          endCursor
          startCursor
          hasNextPage
        }
      }
    }
  }
`;

// Mirrors ME in src/graphql/queries.js (unauthenticated => me: null expected)
const ME = `
  query getCurrentUser($includeReviews: Boolean = false) {
    me {
      id
      username
      reviews @include(if: $includeReviews) {
        edges {
          node {
            id
            text
            rating
            createdAt
            repositoryId
            user {
              id
              username
            }
          }
        }
      }
    }
  }
`;

let failures = 0;
const report = (label, result, summarize) => {
  const errors = result.body?.errors;
  const ok = result.status === 200 && !errors;
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${label} (HTTP ${result.status})`);
  if (!ok) {
    failures++;
    console.log('      ' + JSON.stringify(errors ?? result.raw ?? result.body).slice(0, 500));
  } else if (summarize) {
    console.log('      ' + summarize(result.body.data));
  }
};

const list = await post(LIST, {
  orderBy: 'CREATED_AT',
  orderDirection: 'DESC',
  searchKeyword: '',
});
report(
  'GET_REPOSITORIES accepted by production API',
  list,
  (data) => `repositories returned: ${data?.repositories?.edges?.length ?? '?'} edges`,
);

const firstId = list.body?.data?.repositories?.edges?.[0]?.node?.id;
if (firstId) {
  const single = await post(SINGLE, { id: firstId, first: 5 });
  report(
    'GET_REPOSITORY accepted by production API',
    single,
    (data) =>
      `repository: ${data?.repository?.fullName ?? '?'}, reviews: ${data?.repository?.reviews?.edges?.length ?? '?'} edges`,
  );
} else {
  console.log('SKIP  no repository id available for GET_REPOSITORY check');
}

const me = await post(ME, { includeReviews: false });
report(
  'ME (unauthenticated) accepted by production API',
  me,
  (data) => `me: ${JSON.stringify(data?.me)}`,
);

const meWithReviews = await post(ME, { includeReviews: true });
report(
  'ME with includeReviews=true accepted by production API',
  meWithReviews,
  (data) => `me: ${JSON.stringify(data?.me)}`,
);

if (failures > 0) {
  console.log(`\n${failures} production API check(s) failed`);
  process.exitCode = 1;
} else {
  console.log('\nAll production API checks passed');
}
