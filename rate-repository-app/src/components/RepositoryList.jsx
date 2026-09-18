import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigate } from 'react-router-native';

import RepositoryItem from './RepositoryItem';
import useRepositories from '../hooks/useRepositories';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const pickerValues = [
  { label: 'Latest repositories', value: 'latest' },
  { label: 'Highest rated repositories', value: 'highest' },
  { label: 'Lowest rated repositories', value: 'lowest' },
];

export const RepositoryListContainer = ({
  repositories,
  onPressRepository,
  pickerValues: containerPickerValues,
  selectedValue,
  onValueChange,
}) => {
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
      ListHeaderComponent={
        containerPickerValues && selectedValue && onValueChange ? (
          <Picker
            testID="repository-sort-picker"
            accessibilityLabel="Sort repositories"
            selectedValue={selectedValue}
            onValueChange={(itemValue) => onValueChange(itemValue)}
          >
            {containerPickerValues.map((value) => (
              <Picker.Item
                key={value.label}
                label={value.label}
                value={value.value}
              />
            ))}
          </Picker>
        ) : undefined
      }
    />
  );
};

const getSortVariables = (sortOrder) => {
  switch (sortOrder) {
    case 'highest':
      return { orderBy: 'RATING_AVERAGE', orderDirection: 'DESC' };
    case 'lowest':
      return { orderBy: 'RATING_AVERAGE', orderDirection: 'ASC' };
    default:
      return { orderBy: 'CREATED_AT', orderDirection: 'DESC' };
  }
};

const RepositoryList = () => {
  const [sortOrder, setSortOrder] = useState('latest');

  const { repositories } = useRepositories(getSortVariables(sortOrder));
  const navigate = useNavigate();

  const onPressRepository = (id) => {
    navigate(`/repository/${id}`);
  };

  return (
    <RepositoryListContainer
      repositories={repositories}
      onPressRepository={onPressRepository}
      pickerValues={pickerValues}
      selectedValue={sortOrder}
      onValueChange={setSortOrder}
    />
  );
};

export default RepositoryList;