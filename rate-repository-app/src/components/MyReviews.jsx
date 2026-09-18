import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import ReviewItem from './ReviewItem';
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
  const { me, loading } = useMe({ includeReviews: true });

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
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={({ id }) => id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

export default MyReviews;