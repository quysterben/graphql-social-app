import React from 'react';

import { useNavigate } from 'react-router-dom';

import { Button, Flex, Heading, Box } from '@chakra-ui/react';
import { MdManageAccounts } from 'react-icons/md';
import { AiOutlinePicRight, AiOutlineComment } from 'react-icons/ai';

import { gql, useMutation, useApolloClient } from '@apollo/client';
const LOG_OUT = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;

export default function AdminNavbar() {
  const navigate = useNavigate();
  const client = useApolloClient();

  const [logout] = useMutation(LOG_OUT);

  const handleClickLogout = async () => {
    try {
      const res = await logout();
      localStorage.removeItem('user');
      client.clearStore();
      navigate('/signin');
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex
      h="3.75rem"
      position="fixed"
      top="0"
      left="0"
      right="0"
      alignItems="center"
      gap={4}
      bg="white"
      zIndex="overlay">
      <Heading ml={4} size="md">
        Admin Dashboard
      </Heading>
      <Flex mx={16} gap={8}>
        <Box color="primary.600" cursor="pointer">
          <MdManageAccounts size={28} cursor="pointer" />
        </Box>
        <Box color="yellow.400">
          <AiOutlinePicRight size={28} cursor="pointer" />
        </Box>
        <Box color="primary.600">
          <AiOutlineComment size={28} cursor="pointer" />
        </Box>
      </Flex>
      <Button
        onClick={handleClickLogout}
        position="absolute"
        right={2}
        variant="outline"
        colorScheme="teal">
        Logout
      </Button>
    </Flex>
  );
}
