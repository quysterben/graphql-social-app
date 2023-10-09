import { useState } from 'react';

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

export default function Signin() {
  const [showPwd, setShowPwd] = useState(false);

  const handleShowPwd = () => setShowPwd(!showPwd);

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
              <Input type="text" placeholder="Username" />
            </InputGroup>
            <InputGroup mb="2rem">
              <InputLeftElement pointerEvents="none">
                <AiOutlineLock color="blue" />
              </InputLeftElement>
              <Input type={showPwd ? 'text' : 'password'} placeholder="Password" />
              <InputRightElement>
                <Button px="1.4rem" mr="0.4rem" h="1.75rem" size="sm" onClick={handleShowPwd}>
                  {showPwd ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Button w="100%" colorScheme="blue">
              Sign In
            </Button>
          </FormControl>
          <Text cursor="pointer" color="gray.600" _hover={{ color: 'black' }}>
            Forgot{' '}
            <Text fontWeight="bold" display="inline-block">
              Username/Password?
            </Text>
          </Text>
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
          <Heading my="4rem">
            Welcome to{' '}
            <Heading display="inline-block" color="white">
              Agora!
            </Heading>
          </Heading>
          <Image mt="2rem" src={AuthImg} w="32rem" h="20rem" alt="Auth Img" />
        </Flex>
      </Flex>
    </Box>
  );
}
