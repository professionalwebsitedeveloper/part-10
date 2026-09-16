import { Image, StyleSheet, View } from 'react-native';

import Statistic from './Statistic';
import Text from './Text';
import theme from '../theme';

const formatNumber = (value) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return String(value);
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    padding: 16,
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
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  description: {
    marginTop: 4,
  },
  language: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  languageText: {
    color: '#ffffff',
  },
  statisticsContainer: {
    backgroundColor: '#f0f0f0',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    marginTop: 12,
    paddingBottom: 8,
    paddingTop: 8,
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
        <View style={styles.infoContainer}>
          <Text fontWeight="bold" fontSize="subheading">
            {repository.fullName}
          </Text>
          <Text color="textSecondary" style={styles.description}>
            {repository.description}
          </Text>
          <View style={styles.language}>
            <Text style={styles.languageText}>{repository.language}</Text>
          </View>
        </View>
      </View>
      <View style={styles.statisticsContainer}>
        <Statistic label="Stars" value={formatNumber(repository.stargazersCount)} />
        <Statistic label="Forks" value={formatNumber(repository.forksCount)} />
        <Statistic label="Reviews" value={formatNumber(repository.reviewCount)} />
        <Statistic label="Rating" value={String(repository.ratingAverage)} />
      </View>
    </View>
  );
};

export default RepositoryItem;