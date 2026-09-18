import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useParams } from 'react-router-native';

import RepositoryItem from './RepositoryItem';
import ReviewItem from './ReviewItem';
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
  separator: {
    height: 10,
  },
});

const SingleRepository = () => {
  const { id } = useParams();
  const { repository, loading, fetchMore } = useRepository(id, { first: 5 });

  if (loading && !repository) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  const reviews = repository.reviews.edges.map((edge) => edge.node);

  return (
    <FlatList
      style={styles.container}
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={({ id }) => id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      onEndReached={fetchMore}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={() => (
        <RepositoryItem repository={repository} githubUrl={repository.url} />
      )}
    />
  );
};

export default SingleRepository;