import { useState, useRef } from 'react';

import AdminNavbar from '../../../components/Admin/Navbar';

import { Box, Flex, Heading, Button, Td } from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, TableContainer, useToast } from '@chakra-ui/react';
import {
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react';

import { BsFillTrashFill } from 'react-icons/bs';

import { gql, useQuery, useMutation } from '@apollo/client';
import Loader from '../../../components/Loader';
const GET_COMMENT_REPORT_QUERY = gql`
  query GetAllCommentReports {
    getAllCommentReports {
      reportedComment {
        id
        content
        author {
          id
          name
          banned
        }
      }
      reportUser {
        id
        name
        email
      }
      id
      description
    }
  }
`;
const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($input: SingleCommentInput!) {
    deleteComment(input: $input) {
      message
    }
  }
`;
const EXPORT_CSV = gql`
  mutation ExportCommentReportsData {
    exportCommentReportsData {
      csvLink
    }
  }
`;

export default function CommentReportManagement() {
  const { loading, error, data, refetch } = useQuery(GET_COMMENT_REPORT_QUERY);
  if (error) console.log(error);

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [selectedComment, setSelectedComment] = useState(null);
  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION);
  const handleDeleteComment = async () => {
    try {
      await deleteComment({
        variables: {
          input: {
            commentId: selectedComment
          }
        }
      });
      toast({
        title: 'Delete comment success!',
        status: 'success',
        position: 'bottom-right',
        isClosable: true
      });
      onClose();
      refetch();
    } catch (err) {
      console.log(err);
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
      window.open(res.data.exportCommentReportsData.csvLink, '_blank');
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
          Comment Reports Management
        </Heading>
        <Flex gap={4} pos="absolute" size="md" top={0} right={0}>
          <Button onClick={() => handleExportCSV()} px={6} colorScheme="teal">
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
                  <Th textAlign="center" colSpan={4}>
                    Reported Comment
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
                  <Th>ID</Th>
                  <Th>Author</Th>
                  <Th>ID</Th>
                  <Th>Content</Th>
                  <Th>Id</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.getAllCommentReports.map((report) => (
                  <Tr key={report.id} bg={report.reportedComment.author.banned ? 'red.100' : null}>
                    <Td>{report.id}</Td>
                    <Td>{report.reportedComment.author.id}</Td>
                    <Td>{report.reportedComment.author.name}</Td>
                    <Td>{report.reportedComment.id}</Td>
                    <Td>{report.reportedComment.content}</Td>
                    <Td>{report.reportUser.id}</Td>
                    <Td>{report.reportUser.name}</Td>
                    <Td>{report.reportUser.email}</Td>
                    <Td>{report.description}</Td>
                    <Td>
                      <Flex gap={2}>
                        <Box color="red.400">
                          <BsFillTrashFill
                            onClick={() => {
                              onOpen();
                              setSelectedComment(report.reportedComment.id);
                            }}
                            size={20}
                            cursor="pointer"
                          />
                        </Box>
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
              Delete this comment
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => handleDeleteComment()} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
