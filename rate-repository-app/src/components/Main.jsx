import { StyleSheet, View } from 'react-native';
import { Navigate, Route, Routes } from 'react-router-native';

import AppBar from './AppBar';
import RepositoryList from './RepositoryList';
import ReviewForm from './ReviewForm';
import SignIn from './SignIn';
import SignUp from './SignUp';
import SingleRepository from './SingleRepository';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e4e8',
  },
});

const Main = () => {
  return (
    <View style={styles.container}>
      <AppBar />
      <Routes>
        <Route path="/" element={<RepositoryList />} />
        <Route path="/repository/:id" element={<SingleRepository />} />
        <Route path="/create-review" element={<ReviewForm />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </View>
  );
};

export default Main;