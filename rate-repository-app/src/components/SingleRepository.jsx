import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useParams } from 'react-router-native';

import RepositoryItem from './RepositoryItem';
import useRepository from '../hooks/useRepository';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

const SingleRepository = () => {
  const { id } = useParams();
  const { repository, loading } = useRepository(id);

  if (loading && !repository) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RepositoryItem repository={repository} githubUrl={repository?.url} />
    </View>
  );
};

export default SingleRepository;