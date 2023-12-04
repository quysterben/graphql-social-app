/* eslint-disable no-unused-vars */
import { useRef, useState } from 'react';
import moment from 'moment';

import AdminNavbar from '../../../components/Admin/Navbar';
import Loader from '../../../components/Loader';

import { AiFillLock, AiFillUnlock } from 'react-icons/ai';

import {
  Box,
  Flex,
  Heading,
  Button,
  useToast,
  Link,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Input
} from '@chakra-ui/react';
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
  mutation ExportUsersData {
    exportUsersData {
      csvLink
    }
  }
`;
const IMPORT_CSV = gql`
  mutation ImportUsersData($file: Upload!) {
    importUsersData(file: $file) {
      imported
      errors
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [selectedUser, setSelectedUser] = useState(null);

  const { data, loading, error, refetch } = useQuery(GET_USERS);
  if (error) console.log(error);

  const [exportCSV] = useMutation(EXPORT_CSV);
  const handleExportCSV = async () => {
    if (loading) return;
    try {
      const csvData = await exportCSV();
      toast({
        title: 'Export data success!',
        status: 'success',
        position: 'bottom-right',
        isClosable: true
      });
      window.open(csvData.data.exportUsersData.csvLink, '_blank');
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        position: 'bottom-right',
        isClosable: true
      });
    }
  };

  const [importCSV] = useMutation(IMPORT_CSV);
  const [loadingImport, setLoadingImport] = useState(false);
  const inputFile = useRef(null);
  const handleOnClick = () => {
    inputFile.current.click();
  };
  const handleImportCSV = async () => {
    if (loading) return;
    const file = inputFile.current.files[0];
    try {
      setLoadingImport(true);
      const res = await importCSV({ variables: { file: file } });
      toast({
        title: `Imported: ${res.data.importUsersData.imported} datas`,
        status: 'success',
        position: 'bottom-right',
        duration: 4000,
        isClosable: true
      });
      toast({
        title: `Errors: ${res.data.importUsersData.errors} datas`,
        status: 'error',
        position: 'bottom-right',
        duration: 4000,
        isClosable: true
      });
      setLoadingImport(false);
      refetch();
      inputFile.current.value = null;
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        position: 'bottom-right',
        duration: 4000,
        isClosable: true
      });
      inputFile.current.value = null;
      setLoadingImport(false);
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
      onClose();
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
        <Flex pos="absolute" top={0} right={0} w="full" justifyContent="flex-end" gap={4}>
          <Button size="md" colorScheme="teal" isLoading={loading} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button
            onClick={handleOnClick}
            size="md"
            variant="outline"
            colorScheme="teal"
            isLoading={loadingImport}>
            Import CSV
          </Button>
          <Input
            onChange={(e) => handleImportCSV(e)}
            accept=".csv"
            ref={inputFile}
            display="none"
            type="file"
          />
        </Flex>
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
                    <Td>
                      {!user.dateOfBirth
                        ? ''
                        : moment(user.dateOfBirth).format('DD/MM/YYYY').toString()}
                    </Td>
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
                            <AiFillLock
                              onClick={() => {
                                onOpen();
                                setSelectedUser(user.id);
                              }}
                            />
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
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Ban this user
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => handleBanUser(selectedUser)} ml={3}>
                Ban
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
