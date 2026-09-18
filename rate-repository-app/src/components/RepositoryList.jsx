import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useNavigate } from 'react-router-native';

import RepositoryItem from './RepositoryItem';
import useRepositories from '../hooks/useRepositories';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

export const RepositoryListContainer = ({ repositories, onPressRepository }) => {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => (
        <Pressable onPress={() => onPressRepository?.(item.id)}>
          <RepositoryItem repository={item} />
        </Pressable>
      )}
      keyExtractor={({ id }) => id}
    />
  );
};

const RepositoryList = () => {
  const { repositories } = useRepositories();
  const navigate = useNavigate();

  const onPressRepository = (id) => {
    navigate(`/repository/${id}`);
  };

  return (
    <RepositoryListContainer
      repositories={repositories}
      onPressRepository={onPressRepository}
    />
  );
};

export default RepositoryList;