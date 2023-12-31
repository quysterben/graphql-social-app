/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

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
  Image,
  FormErrorMessage,
  useToast
} from '@chakra-ui/react';

import { BiUserCircle } from 'react-icons/bi';
import { AiOutlineLock } from 'react-icons/ai';

import { useMutation, gql } from '@apollo/client';

const SIGNIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      id
      name
      email
      token
      avatar
      wallpaper
      role
    }
  }
`;

import * as Yup from 'yup';
import { useFormik } from 'formik';

const SigninSchema = Yup.object().shape({
  password: Yup.string().min(8, 'Too Short!').max(70, 'Too Long!').required('Required'),
  email: Yup.string().email('Invalid email').required('Required')
});

export default function Signin() {
  const navigate = useNavigate();
  const toast = useToast();

  const [showPwd, setShowPwd] = useState(false);
  const handleShowPwd = () => setShowPwd(!showPwd);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate('/');
    }
  }, []);

  const [signin] = useMutation(SIGNIN_MUTATION);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formik.errors.email || !formik.touched.email) return;
    if (formik.errors.password || !formik.touched.password) return;

    try {
      const res = await signin({
        variables: {
          input: {
            email: formik.values.email,
            password: formik.values.password
          }
        }
      });
      localStorage.setItem('user', JSON.stringify(res.data.login));
      toast({
        title: 'Logged in successfully!',
        status: 'success',
        position: 'bottom-right',
        isClosable: true
      });
      if (res.data.login.role == 1) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        position: 'bottom-right',
        isClosable: true
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: SigninSchema
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
        <Flex flexDirection="column" w="50%" alignItems="center">
          <Heading my="4rem">Sign In</Heading>
          <form
            onSubmit={handleSubmit}
            style={{
              width: '70%',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
            <FormControl isInvalid={formik.errors.email && formik.touched.email}>
              <InputGroup mb="1.6rem">
                <InputLeftElement pointerEvents="none">
                  <BiUserCircle color="blue" />
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
            <FormControl w="100%" isInvalid={formik.errors.password && formik.touched.password}>
              <InputGroup mb="1.6rem">
                <InputLeftElement pointerEvents="none">
                  <AiOutlineLock color="blue" />
                </InputLeftElement>
                <Input
                  id="password"
                  autoComplete="off"
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
              <Button w="100%" size="md" colorScheme="blue" type="submit">
                Sign In
              </Button>
            </FormControl>
          </form>
          <Box mt="4rem" cursor="pointer" data-group>
            <Link to="/forgot-password">
              <Text
                _groupHover={{ color: 'black' }}
                display="inline-block"
                color="gray.600"
                mr="0.4rem">
                Forgot
              </Text>
              <Text
                _groupHover={{ color: 'black' }}
                fontWeight="bold"
                color="gray.600"
                display="inline-block">
                Username/Password?
              </Text>
            </Link>
          </Box>
          <Text
            cursor="pointer"
            color="gray.500"
            _hover={{ color: 'black' }}
            fontWeight="bold"
            mt="9.5rem"
            position="absolute"
            bottom={4}
            display="inline-block">
            <Link to="/signup">Create your Account ?</Link>
          </Text>
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
