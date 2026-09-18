import { useApolloClient } from '@apollo/client/react';
import Constants from 'expo-constants';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'react-router-native';

import theme from '../theme';
import useAuthStorage from '../hooks/useAuthStorage';
import useMe from '../hooks/useMe';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.textPrimary,
    flexDirection: 'row',
  },
  scrollView: {
    flexGrow: 1,
    flexDirection: 'row',
  },
  tab: {
    padding: 16,
  },
  tabText: {
    color: '#ffffff',
    fontSize: theme.fontSizes.subheading,
    fontWeight: theme.fontWeights.bold,
  },
});

const AppBarTab = ({ children, to }) => {
  return (
    <Pressable>
      <Link to={to} style={styles.tab}>
        <Text style={styles.tabText}>{children}</Text>
      </Link>
    </Pressable>
  );
};

const AppBar = () => {
  const { me } = useMe();
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();

  const signOut = async () => {
    await authStorage.removeAccessToken();
    apolloClient.resetStore();
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.scrollView}>
        <AppBarTab to="/">Repositories</AppBarTab>
        {me && <AppBarTab to="/create-review">Create a review</AppBarTab>}
        {me && <AppBarTab to="/my-reviews">My reviews</AppBarTab>}
        {me ? (
          <Pressable onPress={signOut} style={styles.tab}>
            <Text style={styles.tabText}>Sign out</Text>
          </Pressable>
        ) : (
          <>
            <AppBarTab to="/sign-in">Sign in</AppBarTab>
            <AppBarTab to="/sign-up">Sign up</AppBarTab>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default AppBar;