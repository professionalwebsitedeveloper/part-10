import { StyleSheet, View } from 'react-native';
import { format } from 'date-fns';

import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    flexDirection: 'row',
    padding: 16,
  },
  ratingContainer: {
    alignItems: 'center',
    borderColor: theme.colors.primary,
    borderRadius: 22,
    borderWidth: 2,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  rating: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.bold,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontWeight: theme.fontWeights.bold,
  },
  createdAt: {
    marginTop: 4,
  },
  text: {
    marginTop: 8,
  },
});

const ReviewItem = ({ review }) => {
  return (
    <View testID="reviewItem" style={styles.container}>
      <View style={styles.ratingContainer}>
        <Text style={styles.rating}>{review.rating}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.username}>{review.user.username}</Text>
        <Text color="textSecondary" style={styles.createdAt}>
          {format(new Date(review.createdAt), 'dd MMM yyyy')}
        </Text>
        <Text style={styles.text}>{review.text}</Text>
      </View>
    </View>
  );
};

export default ReviewItem;