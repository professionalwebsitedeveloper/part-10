import { act } from 'react';
import { ApolloLink, Observable } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { renderHook, waitFor } from '@testing-library/react-native';

import useRepository from '../../hooks/useRepository';
import createApolloClient from '../../utils/apolloClient';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const REPOSITORY_ID = 'jaredpalmer.formik';

const makeReview = (n) => ({
  __typename: 'Review',
  id: `review-${n}`,
  text: `review text ${n}`,
  rating: 5,
  createdAt: `2021-01-0${n}T00:00:00.000Z`,
  repositoryId: REPOSITORY_ID,
  user: { __typename: 'User', id: `user-${n}`, username: `user${n}` },
});

const connection = (nodes, hasNextPage) => ({
  __typename: 'ReviewConnection',
  totalCount: 3,
  edges: nodes.map(({ node, cursor }) => ({
    __typename: 'ReviewEdge',
    node,
    cursor,
  })),
  pageInfo: {
    __typename: 'PageInfo',
    startCursor: nodes[0].cursor,
    endCursor: nodes[nodes.length - 1].cursor,
    hasNextPage,
  },
});

const repositoryResult = (reviews) => ({
  repository: {
    __typename: 'Repository',
    id: REPOSITORY_ID,
    fullName: 'jaredpalmer/formik',
    description: 'Build forms in React, without the tears',
    language: 'TypeScript',
    ownerAvatarUrl: 'https://avatars2.githubusercontent.com/u/4060187?v=4',
    stargazersCount: 21856,
    forksCount: 1619,
    reviewCount: 3,
    ratingAverage: 88,
    url: 'https://github.com/jaredpalmer/formik',
    reviews,
  },
});

// Page 1: two reviews, hasNextPage === true
const firstPage = repositoryResult(
  connection(
    [
      { node: makeReview(1), cursor: 'cursor-1' },
      { node: makeReview(2), cursor: 'cursor-2' },
    ],
    true,
  ),
);

// Page 2: one review, hasNextPage === false
const secondPage = repositoryResult(
  connection([{ node: makeReview(3), cursor: 'cursor-3' }], false),
);

const requestLog = [];

const mockLink = new ApolloLink(
  (operation) =>
    new Observable((observer) => {
      requestLog.push({ ...operation.variables });
      observer.next({ data: operation.variables.after ? secondPage : firstPage });
      observer.complete();
    }),
);

// Reuse the application's real Apollo Client setup (including the cache's
// relayStylePagination field policies) and just swap the network link.
const client = createApolloClient({ getAccessToken: async () => 'test-token' });
client.setLink(mockLink);

const wrapper = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

describe('cursor based pagination', () => {
  describe('useRepository', () => {
    it('fetches the next page after the endCursor and merges it into the reviews list', async () => {
      const { result } = await renderHook(
        () => useRepository(REPOSITORY_ID, { first: 2 }),
        { wrapper },
      );

      await waitFor(() => {
        expect(result.current.repository.reviews.edges).toHaveLength(2);
      });

      expect(requestLog).toEqual([{ id: REPOSITORY_ID, first: 2 }]);
      expect(result.current.repository.reviews.pageInfo).toMatchObject({
        endCursor: 'cursor-2',
        hasNextPage: true,
      });

      await act(async () => {
        await result.current.fetchMore();
      });

      // The next page must be requested after the latest endCursor
      expect(requestLog).toEqual([
        { id: REPOSITORY_ID, first: 2 },
        { id: REPOSITORY_ID, first: 2, after: 'cursor-2' },
      ]);

      // The new reviews are appended to the existing ones (thanks to the
      // relayStylePagination field policy of the Repository.reviews field)
      await waitFor(() => {
        expect(result.current.repository.reviews.edges).toHaveLength(3);
      });

      expect(
        result.current.repository.reviews.edges.map((edge) => edge.node.id),
      ).toEqual(['review-1', 'review-2', 'review-3']);

      expect(result.current.repository.reviews.pageInfo.hasNextPage).toBe(false);

      // No more pages -> the decorated fetchMore must not hit the network
      await act(async () => {
        await result.current.fetchMore();
      });

      expect(requestLog).toHaveLength(2);
    });
  });
});
