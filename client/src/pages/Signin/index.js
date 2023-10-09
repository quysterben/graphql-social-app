import { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

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
  Image
} from '@chakra-ui/react';

import AuthImg from '../../assets/auth.png';

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
      role
    }
  }
`;

export default function Signin() {
  const [showPwd, setShowPwd] = useState(false);

  const usernameData = useRef('');
  const passwordData = useRef('');

  const [signin] = useMutation(SIGNIN_MUTATION);

  const handleShowPwd = () => setShowPwd(!showPwd);

  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
      navigate('/');
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await signin({
        variables: {
          input: {
            email: usernameData.current.value,
            password: passwordData.current.value
          }
        }
      });
      localStorage.setItem('loggedIn', true);
      localStorage.setItem('user', JSON.stringify(res.data.login));
      Swal.fire({
        didDestroy: false,
        icon: 'success',
        title: 'Success!',
        text: 'Sign In success!'
      });
      navigate('/');
    } catch (err) {
      Swal.fire('Failed!', err.message, 'error');
    }
  };

  return (
    <Box w="100vw" h="100vh" bgColor="gray.400" position="relative" boxShadow="2xl">
      <Flex
        w="80rem"
        h="40rem"
        position="absolute"
        bg="white"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        boxShadow="2xl">
        <Flex flexDirection="column" w="50%" alignItems="center">
          <Heading mt="4rem">Sign In</Heading>
          <FormControl my="4rem" w="24rem">
            <InputGroup mb="2rem">
              <InputLeftElement pointerEvents="none">
                <BiUserCircle color="blue" />
              </InputLeftElement>
              <Input id="username" ref={usernameData} type="text" placeholder="Username" />
            </InputGroup>
            <InputGroup mb="2rem">
              <InputLeftElement pointerEvents="none">
                <AiOutlineLock color="blue" />
              </InputLeftElement>
              <Input
                id="password"
                ref={passwordData}
                type={showPwd ? 'text' : 'password'}
                placeholder="Password"
              />
              <InputRightElement>
                <Button px="1.4rem" mr="0.4rem" h="1.75rem" size="sm" onClick={handleShowPwd}>
                  {showPwd ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Button w="100%" colorScheme="blue" onClick={handleSubmit}>
              Sign In
            </Button>
          </FormControl>
          <Box cursor="pointer" data-group>
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
          </Box>
          <Text
            cursor="pointer"
            color="gray.500"
            _hover={{ color: 'black' }}
            fontWeight="bold"
            mt="9.5rem"
            display="inline-block">
            Create your Account ?
          </Text>
        </Flex>
        <Flex w="50%" bg="blue.300" flexDirection="column" alignItems="center">
          <Box my="4rem">
            <Heading display="inline-block" mr="0.8rem">
              Welcome to
            </Heading>
            <Heading display="inline-block" color="white">
              Agora!
            </Heading>
          </Box>
          <Image mt="2rem" src={AuthImg} w="32rem" h="20rem" alt="Auth Img" />
        </Flex>
      </Flex>
    </Box>
  );
}
