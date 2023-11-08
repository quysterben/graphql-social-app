import { useState, useRef } from 'react';

import AdminNavbar from '../../../components/Admin/Navbar';

import { Box, Flex, Heading, Button, Td } from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, TableContainer, Link, useToast } from '@chakra-ui/react';
import {
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react';

import { AiOutlineEye } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';

import { gql, useQuery, useMutation } from '@apollo/client';
import Loader from '../../../components/Loader';
const GET_POST_REPORTS = gql`
  query GetAllPostReports {
    getAllPostReports {
      id
      reportedPost {
        id
        author {
          id
          name
          banned
        }
        content
        images {
          id
          imageUrl
        }
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
const DELETE_POST_MUTATION = gql`
  mutation DeletePost($input: SinglePostInput!) {
    deletePost(input: $input) {
      message
    }
  }
`;
const EXPORT_CSV = gql`
  query ExportPostReportsData {
    exportPostReportsData {
      csvLink
    }
  }
`;

export default function PostReportManagement() {
  const { loading, error, data, refetch } = useQuery(GET_POST_REPORTS);
  if (error) console.log(error);

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [selectedPost, setSelectedPost] = useState(null);
  const [deletePost] = useMutation(DELETE_POST_MUTATION);
  const handleDeletePost = async (postId) => {
    try {
      await deletePost({
        variables: {
          input: {
            postId
          }
        }
      });
      toast({
        title: 'Delete post success!',
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
      window.open(csvData.exportPostReportsData.csvLink, '_blank');
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
          Post Reports Management
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
                    Post
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
                  <Th>Author Id</Th>
                  <Th>Content</Th>
                  <Th>Images</Th>
                  <Th>Id</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.getAllPostReports.map((report) => (
                  <Tr key={report.id} bg={report.reportedPost.author.banned ? 'red.100' : null}>
                    <Td>{report.id}</Td>
                    <Td>{report.reportedPost.id}</Td>
                    <Td>{report.reportedPost.author.id}</Td>
                    <Td>{report.reportedPost.content}</Td>
                    <Td>
                      {report.reportedPost.images.length > 0
                        ? report.reportedPost.images.map((image, index) => (
                            <Link color="blue" mx={1} key={index} isExternal href={image.imageUrl}>
                              {index + 1}
                            </Link>
                          ))
                        : null}
                    </Td>
                    <Td>{report.reportUser.id}</Td>
                    <Td>{report.reportUser.name}</Td>
                    <Td>{report.reportUser.email}</Td>
                    <Td>{report.description}</Td>
                    <Td>
                      <Flex gap={2}>
                        <Box color="yellow">
                          <AiOutlineEye size={20} cursor="pointer" />
                        </Box>
                        <Box color="red.400">
                          <BsFillTrashFill
                            onClick={() => {
                              onOpen();
                              setSelectedPost(report.reportedPost.id);
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
              Delete this post
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => handleDeletePost(selectedPost)} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
