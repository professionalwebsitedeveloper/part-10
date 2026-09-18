import { useQuery } from '@apollo/client/react';

import { ME } from '../graphql/queries';

const useMe = ({ includeReviews = false } = {}) => {
  const { data, loading, refetch } = useQuery(ME, {
    variables: { includeReviews },
    fetchPolicy: 'cache-and-network',
  });

  return { me: data?.me, loading, refetch };
};

export default useMe;