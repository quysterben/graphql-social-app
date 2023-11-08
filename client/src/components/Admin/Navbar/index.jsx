import React from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { Button, Flex, Heading, Box } from '@chakra-ui/react';
import { MdManageAccounts, MdReport } from 'react-icons/md';
import { AiOutlinePicRight } from 'react-icons/ai';

import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';

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
      <Flex mx={16} gap={8} alignItems="center">
        <Box color="primary.600" cursor="pointer">
          <Link to="/admin">
            <MdManageAccounts size={28} cursor="pointer" />
          </Link>
        </Box>
        <Box color="yellow.400">
          <Link to="/admin/post-management">
            <AiOutlinePicRight size={28} cursor="pointer" />
          </Link>
        </Box>
        <Flex>
          <Menu>
            <MenuButton color="red.600">
              <MdReport size={28} cursor="pointer" />
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Link to="/admin/user-report-management">User Reports</Link>
              </MenuItem>
              <MenuItem>
                <Link to="/admin/post-report-management">Post Reports</Link>
              </MenuItem>
              <MenuItem>
                <Link to="/admin/comment-report-management">Comment Reports</Link>
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
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
