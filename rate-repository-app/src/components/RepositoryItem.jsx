import { Image, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e4e4e4',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  fullName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  description: {
    marginTop: 5,
  },
  language: {
    alignSelf: 'flex-start',
    color: '#666',
    fontWeight: '700',
    marginTop: 5,
  },
  footerContainer: {
    flexDirection: 'row',
  },
  footerItem: {
    flex: 1,
  },
  footerValue: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerLabel: {
    textAlign: 'center',
  },
});

const RepositoryItem = ({ repository }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.avatar}
          source={{ uri: repository.ownerAvatarUrl }}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.fullName}>{repository.fullName}</Text>
          <Text style={styles.description}>{repository.description}</Text>
          <Text style={styles.language}>{repository.language}</Text>
        </View>
      </View>
      <View style={styles.footerContainer}>
        <View style={styles.footerItem}>
          <Text style={styles.footerValue}>{repository.stargazersCount}</Text>
          <Text style={styles.footerLabel}>Stars</Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={styles.footerValue}>{repository.forksCount}</Text>
          <Text style={styles.footerLabel}>Forks</Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={styles.footerValue}>{repository.reviewCount}</Text>
          <Text style={styles.footerLabel}>Reviews</Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={styles.footerValue}>{repository.ratingAverage}</Text>
          <Text style={styles.footerLabel}>Rating</Text>
        </View>
      </View>
    </View>
  );
};

export default RepositoryItem;