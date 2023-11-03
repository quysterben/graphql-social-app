import React from 'react';

import AdminNavbar from '../../../components/Admin/Navbar';
import Loader from '../../../components/Loader';

import { AiFillLock, AiFillUnlock } from 'react-icons/ai';

import { Box, Flex, Heading, Button, useToast, Link } from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';

import { gql, useQuery, useMutation } from '@apollo/client';
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
      banned
      createdAt
    }
  }
`;
const EXPORT_CSV = gql`
  query ExportUsersData {
    exportUsersData {
      csvLink
    }
  }
`;
const BAN_USER_MUTATION = gql`
  mutation BanUser($input: BanUserInput!) {
    banUser(input: $input) {
      id
      name
      email
      banned
    }
  }
`;
const UNBAN_USER_MUTATION = gql`
  mutation UnbanUser($input: BanUserInput!) {
    unbanUser(input: $input) {
      id
      name
      email
      banned
    }
  }
`;

export default function UserManagement() {
  const toast = useToast();

  const { data, loading, error, refetch } = useQuery(GET_USERS);
  if (error) console.log(error);
  const { data: csvData } = useQuery(EXPORT_CSV);

  const handleExportCSV = async () => {
    if (loading) return;
    try {
      toast({
        title: 'Export data success!',
        status: 'success',
        position: 'bottom-right',
        isClosable: true
      });
      window.open(csvData.exportUsersData.csvLink, '_blank');
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        position: 'bottom-right',
        isClosable: true
      });
    }
  };

  const [banUser] = useMutation(BAN_USER_MUTATION);
  const handleBanUser = async (userId) => {
    try {
      await banUser({ variables: { input: { userId } } });
      refetch();
      toast({
        title: 'Ban user success!',
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

  const [unbanUser] = useMutation(UNBAN_USER_MUTATION);
  const handleUnbanUser = async (userId) => {
    try {
      await unbanUser({ variables: { input: { userId } } });
      refetch();
      toast({
        title: 'Unban user success!',
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
    <Box bg="gray.200" h="100vh" overflowY="auto">
      <AdminNavbar />
      <Flex w="80%" mx="auto" flexDir="column" alignItems="center" pos="relative" mt={20} gap={8}>
        <Heading alignSelf="flex-start" size="lg">
          User Management
        </Heading>
        <Button
          pos="absolute"
          size="md"
          colorScheme="teal"
          top={0}
          right={0}
          isLoading={loading}
          onClick={handleExportCSV}>
          Export CSV
        </Button>
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
                  <Th>Wallpaper</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.getAllUsers.map((user, index) => (
                  <Tr key={index} bg={user.banned ? 'red.100' : null}>
                    <Td>{user.id}</Td>
                    <Td>{user.name}</Td>
                    <Td>{user.email}</Td>
                    <Td>{user.dateOfBirth}</Td>
                    <Td>{user.from}</Td>
                    <Td>
                      {user.avatar ? (
                        <Link isExternal color="blue" href={user.avatar}>
                          Avatar
                        </Link>
                      ) : null}
                    </Td>
                    <Td>
                      {user.wallpaper ? (
                        <Link isExternal color="blue" href={user.wallpaper}>
                          Wallpaper
                        </Link>
                      ) : null}
                    </Td>
                    <Td>
                      <Flex gap={4} justifyContent="center">
                        {!user.banned ? (
                          <Box color="red" cursor="pointer">
                            <AiFillLock onClick={() => handleBanUser(user.id)} />
                          </Box>
                        ) : (
                          <Box color="red" cursor="pointer">
                            <AiFillUnlock onClick={() => handleUnbanUser(user.id)} />
                          </Box>
                        )}
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Flex>
    </Box>
  );
}
