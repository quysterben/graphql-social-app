import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Flex,
  Heading,
  Image,
  FormControl,
  InputGroup,
  InputLeftElement,
  Input,
  FormErrorMessage,
  Button,
  useToast
} from '@chakra-ui/react';

import { AiOutlineMail } from 'react-icons/ai';

import * as Yup from 'yup';
import { useFormik } from 'formik';
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required')
});

import { gql, useMutation } from '@apollo/client';
const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      message
    }
  }
`;

export default function ForgotPassword() {
  const toast = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate('/');
    }
  }, []);

  const [forgotPassword] = useMutation(FORGOT_PASSWORD_MUTATION);

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: ForgotPasswordSchema
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formik.errors.email || !formik.touched.email) return;
    try {
      setIsSubmitting(true);
      await forgotPassword({
        variables: {
          email: formik.values.email
        }
      });
      setIsSubmitting(false);
      toast({
        title: 'Please check your email to reset password!',
        status: 'success',
        position: 'bottom-right',
        isClosable: true
      });
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        position: 'bottom-right',
        isClosable: true
      });
    }
  };

  return (
    <Box w="100vw" h="100vh" bgColor="gray.400" position="relative" boxShadow="2xl">
      <Flex
        w="80%"
        h="40rem"
        position="absolute"
        bg="white"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        boxShadow="2xl">
        <Flex flexDirection="column" w="50%" alignItems="center">
          <Heading my="4rem">Forgot password</Heading>
          <form
            onSubmit={handleSubmit}
            style={{
              width: '70%',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
            <FormControl mt="2rem" isInvalid={formik.errors.email && formik.touched.email}>
              <InputGroup mb="1.6rem">
                <InputLeftElement pointerEvents="none">
                  <AiOutlineMail color="blue" />
                </InputLeftElement>
                <Input
                  id="email"
                  type="text"
                  name="email"
                  placeholder="Email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
              </InputGroup>
              <FormErrorMessage mt="-1rem" mb="1rem">
                {formik.errors.email}
              </FormErrorMessage>
              <Button w="100%" size="md" colorScheme="blue" type="submit" isLoading={isSubmitting}>
                Submit
              </Button>
              <Button
                mt={4}
                w="100%"
                size="md"
                colorScheme="blue"
                onClick={() => navigate('/signin')}
                variant="outline">
                Go back
              </Button>
            </FormControl>
          </form>
        </Flex>
        <Flex
          w="50%"
          bg="blue.300"
          flexDirection="column"
          alignItems="center"
          justifyContent="center">
          <Box>
            <Heading display="inline-block" mr="0.8rem">
              Welcome to
            </Heading>
            <Heading display="inline-block" color="white">
              Agora!
            </Heading>
          </Box>
          <Image
            mt="2rem"
            src={
              'https://res.cloudinary.com/dp9bf5rvm/image/upload/v1697422645/assets/rgkkthsrq1nfrvdg4f4u.png'
            }
            w="32rem"
            h="20rem"
            alt="Auth Img"
          />
        </Flex>
      </Flex>
    </Box>
  );
}
