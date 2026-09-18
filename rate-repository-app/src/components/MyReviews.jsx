import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import MyReviewItem from './MyReviewItem';
import useDeleteReview from '../hooks/useDeleteReview';
import useMe from '../hooks/useMe';

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

const MyReviews = () => {
  const { me, loading, refetch } = useMe({ includeReviews: true });
  const [deleteReview] = useDeleteReview();

  const handleDelete = async (id) => {
    try {
      await deleteReview({ id });
      await refetch();
    } catch (e) {
      console.log(e);
    }
  };

  if (loading && !me?.reviews) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  const reviews = me?.reviews?.edges.map((edge) => edge.node) ?? [];

  return (
    <FlatList
      style={styles.container}
      data={reviews}
      renderItem={({ item }) => (
        <MyReviewItem review={item} onDelete={handleDelete} />
      )}
      keyExtractor={({ id }) => id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

export default MyReviews;