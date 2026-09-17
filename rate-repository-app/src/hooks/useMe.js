import { useQuery } from '@apollo/client/react';

import { ME } from '../graphql/queries';

const useMe = () => {
  const { data, loading } = useQuery(ME);

  return { me: data?.me, loading };
};

export default useMe;