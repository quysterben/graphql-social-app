import { useEffect, useRef, useState } from 'react';

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
  Image
} from '@chakra-ui/react';

import AuthImg from '../../assets/auth.png';

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

export default function Signup() {
  const [showPwd, setShowPwd] = useState(false);
  const [showRePwd, setShowRePwd] = useState(false);

  const emailData = useRef('');
  const usernameData = useRef('');
  const passwordData = useRef('');
  const repasswordData = useRef('');

  const [signup] = useMutation(SIGNUP_MUTATION);

  const handleShowPwd = () => setShowPwd(!showPwd);
  const handleShowRePwd = () => setShowRePwd(!showRePwd);

  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
      navigate('/');
    }
  }, []);

  const handleSubmit = async () => {
    const username = usernameData.current.value;
    const email = emailData.current.value;
    const password = passwordData.current.value;

    try {
      await signup({
        variables: {
          input: {
            name: username,
            email: email,
            password: password
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
        <Flex flexDirection="column" w="50%" alignItems="center">
          <Heading mt="4rem">Sign Up</Heading>
          <FormControl my="4rem" w="70%">
            <InputGroup mb="2rem">
              <InputLeftElement pointerEvents="none">
                <AiOutlineMail color="blue" />
              </InputLeftElement>
              <Input id="email" ref={emailData} type="text" placeholder="Email" />
            </InputGroup>
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
            <InputGroup mb="2rem">
              <InputLeftElement pointerEvents="none">
                <AiOutlineLock color="blue" />
              </InputLeftElement>
              <Input
                id="repassword"
                ref={repasswordData}
                type={showRePwd ? 'text' : 'password'}
                placeholder="Re-password"
              />
              <InputRightElement>
                <Button px="1.4rem" mr="0.4rem" h="1.75rem" size="sm" onClick={handleShowRePwd}>
                  {showRePwd ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Button w="100%" colorScheme="blue" onClick={handleSubmit}>
              Sign Up
            </Button>
          </FormControl>
          <Text
            cursor="pointer"
            color="gray.500"
            _hover={{ color: 'black' }}
            fontWeight="bold"
            mt="1rem"
            display="inline-block">
            <Link to="/signin">Already have an Account ?</Link>
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}
