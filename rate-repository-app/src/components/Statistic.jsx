import { StyleSheet, View } from 'react-native';

import Text from './Text';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  value: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    textAlign: 'center',
  },
});

const Statistic = ({ label, value }) => {
  return (
    <View style={styles.container}>
      <Text fontWeight="bold" style={styles.value}>{value}</Text>
      <Text color="textSecondary" style={styles.label}>{label}</Text>
    </View>
  );
};

export default Statistic;