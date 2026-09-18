import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useNavigate } from 'react-router-native';

import ReviewItem from './ReviewItem';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  reviewContainer: {
    marginHorizontal: -16,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
    padding: 12,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
    marginRight: 0,
  },
  buttonText: {
    color: '#ffffff',
  },
});

const MyReviewItem = ({ review, onDelete }) => {
  const navigate = useNavigate();

  const viewRepository = () => {
    navigate(`/repository/${review.repositoryId}`);
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete review',
      'Are you sure you want to delete this review?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(review.id),
        },
      ],
    );
  };

  return (
    <View testID="myReviewItem" style={styles.container}>
      <View style={styles.reviewContainer}>
        <ReviewItem review={review} />
      </View>
      <View style={styles.actionsContainer}>
        <Pressable onPress={viewRepository} style={styles.button}>
          <Text style={styles.buttonText}>View repository</Text>
        </Pressable>
        <Pressable
          onPress={confirmDelete}
          style={[styles.button, styles.deleteButton]}
        >
          <Text style={styles.buttonText}>Delete review</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default MyReviewItem;