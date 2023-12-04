import { useRef, useState } from 'react';

import {
  Box,
  Flex,
  Heading,
  Button,
  Td,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast
} from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, TableContainer } from '@chakra-ui/react';

import { AiFillLock, AiFillUnlock } from 'react-icons/ai';

import AdminNavbar from '../../../components/Admin/Navbar';
import Loader from '../../../components/Loader';

import { gql, useQuery, useMutation } from '@apollo/client';
const GET_USERS_REPORTS = gql`
  query GetAllUserReports {
    getAllUserReports {
      id
      reportedUser {
        name
        id
        email
        banned
      }
      description
      reportUser {
        name
        id
        email
      }
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
const EXPORT_CSV = gql`
  mutation ExportUserReportsData {
    exportUserReportsData {
      csvLink
    }
  }
`;

export default function UserReportManagement() {
  const toast = useToast();

  const { data, loading, error, refetch } = useQuery(GET_USERS_REPORTS);
  if (error) console.log(error);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [selectedUser, setSelectedUser] = useState(null);

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

  const [exportCSV] = useMutation(EXPORT_CSV);
  const handleExportCSV = async () => {
    if (loading) return;
    try {
      const res = await exportCSV();
      toast({
        title: 'Export data success!',
        status: 'success',
        position: 'bottom-right',
        isClosable: true
      });
      window.open(res.data.exportUserReportsData.csvLink, '_blank');
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
          User Reports Management
        </Heading>
        <Flex gap={4} pos="absolute" size="md" top={0} right={0}>
          <Button px={6} onClick={() => handleExportCSV()} colorScheme="teal">
            Export CSV
          </Button>
        </Flex>
        {loading ? (
          <Loader />
        ) : (
          <TableContainer
            whiteSpace="break-spaces"
            layerStyle="fixed"
            w="full"
            bg="white"
            borderRadius="md">
            <Table size="md" variant="simple" colorScheme="facebook">
              <Thead>
                <Tr>
                  <Th textAlign="center" rowSpan={2}>
                    ID
                  </Th>
                  <Th textAlign="center" colSpan={3}>
                    Reported
                  </Th>
                  <Th textAlign="center" colSpan={3}>
                    Reported By
                  </Th>
                  <Th textAlign="center" rowSpan={2}>
                    Description
                  </Th>
                  <Th textAlign="center" rowSpan={2}>
                    Actions
                  </Th>
                </Tr>
                <Tr>
                  <Th>Id</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Id</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.getAllUserReports.map((report, index) => (
                  <Tr key={index} bg={report.reportedUser.banned ? 'red.100' : null}>
                    <Td>{report.id}</Td>
                    <Td>{report.reportedUser.id}</Td>
                    <Td>{report.reportedUser.name}</Td>
                    <Td>{report.reportedUser.email}</Td>
                    <Td>{report.reportUser.id}</Td>
                    <Td>{report.reportUser.name}</Td>
                    <Td>{report.reportUser.email}</Td>
                    <Td>{report.description}</Td>
                    <Td>
                      <Flex gap={4} justifyContent="center">
                        {!report.reportedUser.banned ? (
                          <Box color="red" cursor="pointer">
                            <AiFillLock
                              onClick={() => {
                                onOpen();
                                setSelectedUser(report.reportedUser.id);
                              }}
                            />
                          </Box>
                        ) : (
                          <Box color="red" cursor="pointer">
                            <AiFillUnlock onClick={() => handleUnbanUser(report.reportedUser.id)} />
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
