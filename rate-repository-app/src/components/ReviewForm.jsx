import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-native';
import * as yup from 'yup';

import Text from './Text';
import theme from '../theme';
import useCreateReview from '../hooks/useCreateReview';

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
  ownerName: '',
  repositoryName: '',
  rating: '',
  text: '',
};

const validationSchema = yup.object().shape({
  ownerName: yup.string().required('Repository owner name is required'),
  repositoryName: yup.string().required('Repository name is required'),
  rating: yup
    .number()
    .required('Rating is required')
    .min(0, 'Rating must be between 0 and 100')
    .max(100, 'Rating must be between 0 and 100'),
  text: yup.string(),
});

export const ReviewFormContainer = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Repository owner's GitHub username"
        value={formik.values.ownerName}
        onChangeText={formik.handleChange('ownerName')}
        onBlur={formik.handleBlur('ownerName')}
        style={[
          styles.input,
          formik.touched.ownerName && formik.errors.ownerName && styles.inputError,
        ]}
      />
      {formik.touched.ownerName && formik.errors.ownerName && (
        <Text color="red" style={styles.errorText}>
          {formik.errors.ownerName}
        </Text>
      )}
      <TextInput
        placeholder="Repository's name"
        value={formik.values.repositoryName}
        onChangeText={formik.handleChange('repositoryName')}
        onBlur={formik.handleBlur('repositoryName')}
        style={[
          styles.input,
          formik.touched.repositoryName &&
            formik.errors.repositoryName &&
            styles.inputError,
        ]}
      />
      {formik.touched.repositoryName && formik.errors.repositoryName && (
        <Text color="red" style={styles.errorText}>
          {formik.errors.repositoryName}
        </Text>
      )}
      <TextInput
        placeholder="Rating between 0 and 100"
        value={formik.values.rating}
        onChangeText={formik.handleChange('rating')}
        onBlur={formik.handleBlur('rating')}
        keyboardType="numeric"
        style={[
          styles.input,
          formik.touched.rating && formik.errors.rating && styles.inputError,
        ]}
      />
      {formik.touched.rating && formik.errors.rating && (
        <Text color="red" style={styles.errorText}>
          {formik.errors.rating}
        </Text>
      )}
      <TextInput
        placeholder="Review"
        value={formik.values.text}
        onChangeText={formik.handleChange('text')}
        onBlur={formik.handleBlur('text')}
        multiline
        style={[
          styles.input,
          formik.touched.text && formik.errors.text && styles.inputError,
        ]}
      />
      {formik.touched.text && formik.errors.text && (
        <Text color="red" style={styles.errorText}>
          {formik.errors.text}
        </Text>
      )}
      <Pressable onPress={formik.handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Create a review</Text>
      </Pressable>
    </View>
  );
};

const ReviewForm = () => {
  const navigate = useNavigate();
  const [createReview] = useCreateReview();

  const onSubmit = async (values) => {
    const { ownerName, repositoryName, rating, text } = values;

    try {
      const { data } = await createReview({
        ownerName,
        repositoryName,
        rating: Number(rating),
        text,
      });
      navigate(`/repository/${data.createReview.repositoryId}`);
    } catch (e) {
      console.log(e);
    }
  };

  return <ReviewFormContainer onSubmit={onSubmit} />;
};

export default ReviewForm;