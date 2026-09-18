import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigate } from 'react-router-native';
import { useDebounce } from 'use-debounce';

import RepositoryItem from './RepositoryItem';
import useRepositories from '../hooks/useRepositories';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderColor: '#cccccc',
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
  searchKeyword,
  onSearchChange,
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
        <>
          {onSearchChange && (
            <TextInput
              placeholder="Search"
              value={searchKeyword}
              onChangeText={onSearchChange}
              style={styles.searchInput}
            />
          )}
          {containerPickerValues && selectedValue && onValueChange ? (
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
          ) : null}
        </>
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
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearchKeyword] = useDebounce(searchKeyword, 500);

  const { repositories } = useRepositories({
    ...getSortVariables(sortOrder),
    searchKeyword: debouncedSearchKeyword,
  });
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
      searchKeyword={searchKeyword}
      onSearchChange={setSearchKeyword}
    />
  );
};

export default RepositoryList;