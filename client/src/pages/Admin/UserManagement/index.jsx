import React from 'react';

import AdminNavbar from '../../../components/Admin/Navbar';
import Loader from '../../../components/Loader';

import { FaBan, FaTrash } from 'react-icons/fa';

import { Box, Flex, Heading } from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';

import { gql, useQuery } from '@apollo/client';
const GET_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      email
      dateOfBirth
      from
      avatar
      wallpaper
      isOnline
      createdAt
    }
  }
`;

export default function UserManagement() {
  const { data, loading, error } = useQuery(GET_USERS);
  if (error) console.log(error);

  return (
    <Box bg="gray.200" h="100vh" overflowY="auto">
      <AdminNavbar />
      <Flex w="80%" mx="auto" flexDir="column" alignItems="center" mt={20} gap={8}>
        <Heading alignSelf="flex-start" size="lg">
          User Management
        </Heading>
        {loading ? (
          <Loader />
        ) : (
          <TableContainer w="full" bg="white" borderRadius="md">
            <Table variant="simple" colorScheme="facebook">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Date of Birth</Th>
                  <Th>From</Th>
                  <Th>Avatar</Th>
                  <Th>wallpaper</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.getAllUsers.map((user, index) => (
                  <>
                    <Tr key={index}>
                      <Td>{user.id}</Td>
                      <Td>{user.name}</Td>
                      <Td>{user.email}</Td>
                      <Td>{user.dateOfBirth}</Td>
                      <Td>{user.from}</Td>
                      <Td>{user.avatar}</Td>
                      <Td>{user.wallpaper}</Td>
                      <Td>
                        <Flex gap={4}>
                          <Box color="red" cursor="pointer">
                            <FaBan />
                          </Box>
                          <Box cursor="pointer">
                            <FaTrash />
                          </Box>
                        </Flex>
                      </Td>
                    </Tr>
                  </>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Flex>
    </Box>
  );
}
