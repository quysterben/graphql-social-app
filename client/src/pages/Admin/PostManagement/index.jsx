import { useState, useRef } from 'react';
import moment from 'moment';

import AdminNavbar from '../../../components/Admin/Navbar';
import Loader from '../../../components/Loader';

import { AiOutlineEye } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';

import {
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react';
import { Box, Flex, Heading, Button, Link, useToast } from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';

import { gql, useMutation, useQuery } from '@apollo/client';
const GET_ALL_POSTS_QUERY = gql`
  query GetAllPosts {
    getAllPosts {
      id
      content
      author {
        id
        name
      }
      comments {
        author {
          id
          name
        }
        content
        childrenComments {
          parentId
          id
          content
          author {
            name
            id
          }
        }
      }
      images {
        id
        imageUrl
      }
      likes {
        user {
          name
          id
        }
      }
      createdAt
    }
  }
`;
const EXPORT_USERS_DATA = gql`
  query ExportPostsData {
    exportPostsData {
      csvLink
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

export default function PostManagement() {
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [selectedPost, setSelectedPost] = useState(null);

  const { data, loading, error, refetch } = useQuery(GET_ALL_POSTS_QUERY);
  if (error) console.log(error);

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

  const { data: csvData } = useQuery(EXPORT_USERS_DATA);
  const handleExportCSV = async () => {
    if (loading) return;
    try {
      toast({
        title: 'Export data success!',
        status: 'success',
        position: 'bottom-right',
        isClosable: true
      });
      window.open(csvData.exportPostsData.csvLink, '_blank');
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        position: 'bottom-right',
        isClosable: true
      });
    }
  };

  const handleTime = (date) => {
    const time = moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY').toLocaleString();
    return time;
  };

  return (
    <Box bg="gray.200" h="100vh" overflowY="auto">
      <AdminNavbar />
      <Flex w="80%" mx="auto" flexDir="column" alignItems="center" pos="relative" mt={20} gap={8}>
        <Heading alignSelf="flex-start" size="lg">
          Post Management
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
                  <Th>Author ID</Th>
                  <Th>Content</Th>
                  <Th>Comments</Th>
                  <Th>Likes</Th>
                  <Th>Images</Th>
                  <Th>CreatedAt</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.getAllPosts.map((post, index) => (
                  <Tr key={index}>
                    <Td>{post.id}</Td>
                    <Td>{post.author.id}</Td>
                    <Td>{post.content}</Td>
                    <Td>
                      {post.comments.reduce((sum, cmt) => sum + cmt.childrenComments.length + 1, 0)}
                    </Td>
                    <Td>{post.likes.length}</Td>
                    <Td>
                      {post.images.length > 0
                        ? post.images.map((image, index) => (
                            <Link color="blue" mx={1} key={index} isExternal href={image.imageUrl}>
                              {index + 1}
                            </Link>
                          ))
                        : null}
                    </Td>
                    <Td>{handleTime(post.createdAt)}</Td>
                    <Td>
                      <Flex gap={2}>
                        <Box color="yellow">
                          <AiOutlineEye size={20} cursor="pointer" />
                        </Box>
                        <Box color="red.400">
                          <BsFillTrashFill
                            onClick={() => {
                              onOpen();
                              setSelectedPost(post.id);
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
