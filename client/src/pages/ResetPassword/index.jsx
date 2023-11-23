import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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

import { AiOutlineLock } from 'react-icons/ai';

import * as Yup from 'yup';
import { useFormik } from 'formik';
const ForgotPasswordSchema = Yup.object().shape({
  newPassword: Yup.string().min(8, 'Too Short!').max(16, 'Too Long!').required('Required')
});

import { gql, useMutation } from '@apollo/client';
const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      message
    }
  }
`;

export default function ResetPassword() {
  const toast = useToast();
  const navigate = useNavigate();
  const url = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate('/');
    }
  }, []);

  const [resetPassword] = useMutation(RESET_PASSWORD_MUTATION);

  const formik = useFormik({
    initialValues: {
      newPassword: ''
    },
    validationSchema: ForgotPasswordSchema
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formik.errors.newPassword || !formik.touched.newPassword) return;
    try {
      setIsSubmitting(true);
      await resetPassword({
        variables: {
          input: {
            token: url.token,
            password: formik.values.newPassword
          }
        }
      });
      setIsSubmitting(false);
      toast({
        title: 'Reset password success!',
        status: 'success',
        position: 'bottom-right',
        isClosable: true
      });
      navigate('/signin');
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
          <Heading my="4rem">Reset password</Heading>
          <form
            onSubmit={handleSubmit}
            style={{
              width: '70%',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
            <FormControl
              mt="2rem"
              isInvalid={formik.errors.newPassword && formik.touched.newPassword}>
              <InputGroup mb="1.6rem">
                <InputLeftElement pointerEvents="none">
                  <AiOutlineLock color="blue" />
                </InputLeftElement>
                <Input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  placeholder="New password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.newPassword}
                />
              </InputGroup>
              <FormErrorMessage mt="-1rem" mb="1rem">
                {formik.errors.newPassword}
              </FormErrorMessage>
              <Button w="100%" size="md" colorScheme="blue" type="submit" isLoading={isSubmitting}>
                Submit
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
