import { useQuery } from '@apollo/client/react';

import { GET_REPOSITORY } from '../graphql/queries';

const useRepository = (id) => {
  const { data, loading, refetch } = useQuery(GET_REPOSITORY, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
  });

  return {
    repository: data?.repository,
    loading,
    refetch,
  };
};

export default useRepository;