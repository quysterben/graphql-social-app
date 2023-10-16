import { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';

import {
  Box,
  Button,
  Flex,
  Text,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  FormErrorMessage,
  Image
} from '@chakra-ui/react';

import { BiUserCircle } from 'react-icons/bi';
import { AiOutlineLock, AiOutlineMail } from 'react-icons/ai';

import { useMutation, gql } from '@apollo/client';

const SIGNUP_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      id
      name
      email
    }
  }
`;

import * as Yup from 'yup';
import { useFormik } from 'formik';

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  name: Yup.string().min(3, 'Too Short!').max(100, 'Too Long').required('Required'),
  password: Yup.string().min(8, 'Too Short!').max(16, 'Too Long!').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Password must match!')
    .required('Password must match!')
});

export default function Signup() {
  const [showPwd, setShowPwd] = useState(false);
  const [showRePwd, setShowRePwd] = useState(false);

  const [signup] = useMutation(SIGNUP_MUTATION);

  const handleShowPwd = () => setShowPwd(!showPwd);
  const handleShowRePwd = () => setShowRePwd(!showRePwd);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate('/');
    }
  }, []);

  const handleSubmit = async () => {
    if (formik.errors.email || !formik.touched.email) return;
    if (formik.errors.name || !formik.touched.name) return;
    if (formik.errors.password || !formik.touched.password) return;
    if (formik.errors.confirmPassword || !formik.touched.confirmPassword) return;

    try {
      await signup({
        variables: {
          input: {
            name: formik.values.name,
            email: formik.values.email,
            password: formik.values.password
          }
        }
      });
      Swal.fire({
        didDestroy: false,
        icon: 'success',
        title: 'Success!',
        text: 'Sign Up success!'
      });
      navigate('/signin');
    } catch (err) {
      Swal.fire('Failed!', err.message, 'error');
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: SignupSchema
  });

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
        <Flex flexDirection="column" w="50%" alignItems="center">
          <Heading mt="4rem">Sign Up</Heading>
          <FormControl mt="2rem" w="70%" isInvalid={formik.errors.email && formik.touched.email}>
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
          </FormControl>
          <FormControl w="70%" isInvalid={formik.errors.name && formik.touched.name}>
            <InputGroup mb="1.6rem">
              <InputLeftElement pointerEvents="none">
                <BiUserCircle color="blue" />
              </InputLeftElement>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
            </InputGroup>
            <FormErrorMessage mt="-1rem" mb="1rem">
              {formik.errors.name}
            </FormErrorMessage>
          </FormControl>
          <FormControl w="70%" isInvalid={formik.errors.password && formik.touched.password}>
            <InputGroup mb="1.6rem">
              <InputLeftElement pointerEvents="none">
                <AiOutlineLock color="blue" />
              </InputLeftElement>
              <Input
                id="password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                placeholder="Password"
                onChange={formik.handleChange}
                value={formik.values.password}
                onBlur={formik.handleBlur}
              />
              <InputRightElement>
                <Button px="1.4rem" mr="0.4rem" h="1.75rem" size="sm" onClick={handleShowPwd}>
                  {showPwd ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage mt="-1rem" mb="1rem">
              {formik.errors.password}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            w="70%"
            isInvalid={formik.errors.confirmPassword && formik.touched.confirmPassword}>
            <InputGroup mb="1.6rem">
              <InputLeftElement pointerEvents="none">
                <AiOutlineLock color="blue" />
              </InputLeftElement>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showRePwd ? 'text' : 'password'}
                placeholder="Confirm password"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
                onBlur={formik.handleBlur}
              />
              <InputRightElement>
                <Button px="1.4rem" mr="0.4rem" h="1.75rem" size="sm" onClick={handleShowRePwd}>
                  {showRePwd ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage mt="-1rem" mb="1rem">
              {formik.errors.confirmPassword}
            </FormErrorMessage>
            <Button w="100%" size="md" colorScheme="blue" onClick={handleSubmit}>
              Sign Up
            </Button>
          </FormControl>
          <Text
            cursor="pointer"
            color="gray.500"
            _hover={{ color: 'black' }}
            fontWeight="bold"
            position="absolute"
            bottom={4}
            mt="1rem">
            <Link to="/signin">Already have an Account ?</Link>
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}
