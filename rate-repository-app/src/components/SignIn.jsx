import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-native';
import * as yup from 'yup';

import Text from './Text';
import theme from '../theme';
import useSignIn from '../hooks/useSignIn';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    margin: 16,
    padding: 16,
  },
  input: {
    borderColor: '#cccccc',
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    marginBottom: 8,
  },
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    padding: 12,
  },
  buttonText: {
    color: '#ffffff',
  },
});

const initialValues = {
  username: '',
  password: '',
};

const validationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const SignIn = () => {
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      const { data } = await signIn({ username, password });
      console.log(data);
      navigate('/', { replace: true });
    } catch (e) {
      console.log(e);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Username"
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
        onBlur={formik.handleBlur('username')}
        style={[
          styles.input,
          formik.touched.username && formik.errors.username && styles.inputError,
        ]}
      />
      {formik.touched.username && formik.errors.username && (
        <Text color="red" style={styles.errorText}>
          {formik.errors.username}
        </Text>
      )}
      <TextInput
        placeholder="Password"
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
        secureTextEntry
        style={[
          styles.input,
          formik.touched.password && formik.errors.password && styles.inputError,
        ]}
      />
      {formik.touched.password && formik.errors.password && (
        <Text color="red" style={styles.errorText}>
          {formik.errors.password}
        </Text>
      )}
      <Pressable onPress={formik.handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Sign in</Text>
      </Pressable>
    </View>
  );
};

export default SignIn;
