import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-native';
import * as yup from 'yup';

import Text from './Text';
import theme from '../theme';
import useCreateUser from '../hooks/useCreateUser';
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
  passwordConfirmation: '',
};

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(5, 'Username must be at least 5 characters')
    .max(30, 'Username must be at most 30 characters')
    .required('Username is required'),
  password: yup
    .string()
    .min(5, 'Password must be at least 5 characters')
    .max(50, 'Password must be at most 50 characters')
    .required('Password is required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Password confirmation is required'),
});

export const SignUpContainer = ({ onSubmit }) => {
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
      <TextInput
        placeholder="Password confirmation"
        value={formik.values.passwordConfirmation}
        onChangeText={formik.handleChange('passwordConfirmation')}
        onBlur={formik.handleBlur('passwordConfirmation')}
        secureTextEntry
        style={[
          styles.input,
          formik.touched.passwordConfirmation &&
            formik.errors.passwordConfirmation &&
            styles.inputError,
        ]}
      />
      {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation && (
        <Text color="red" style={styles.errorText}>
          {formik.errors.passwordConfirmation}
        </Text>
      )}
      <Pressable onPress={formik.handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Sign up</Text>
      </Pressable>
    </View>
  );
};

const SignUp = () => {
  const navigate = useNavigate();
  const [createUser] = useCreateUser();
  const [signIn] = useSignIn();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      await createUser({ username, password });
      await signIn({ username, password });
      navigate('/', { replace: true });
    } catch (e) {
      console.log(e);
    }
  };

  return <SignUpContainer onSubmit={onSubmit} />;
};

export default SignUp;