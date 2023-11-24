import Proptypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import timeFromNow from '../../../helpers/timeFromNow';

import {
  Flex,
  Text,
  Avatar,
  Box,
  useToast,
  useDisclosure,
  Button,
  IconButton,
  Textarea
} from '@chakra-ui/react';
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';

import { AiFillHeart, AiOutlineComment, AiOutlineEdit } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
import { CiMenuKebab } from 'react-icons/ci';
import { MdReport } from 'react-icons/md';

import Comment from '../Comment';
import CommentInput from '../Comment/CommentInput';

import { gql, useQuery, useMutation } from '@apollo/client';
const GET_SINGLE_POST = gql`
  query GetSinglePost($input: SinglePostInput!) {
    getSinglePost(input: $input) {
      id
      content
      author {
        id
        name
        email
        dateOfBirth
        from
        avatar
        wallpaper
        createdAt
      }
      comments {
        id
        content
        author {
          id
          name
          avatar
        }
        childrenComments {
          author {
            avatar
            id
            name
          }
          content
          createdAt
          id
        }
        parentId
        createdAt
      }
      likes {
        id
        postId
        user {
          id
          name
          avatar
        }
        createdAt
      }
      images {
        id
      }
      createdAt
    }
  }
`;
const LIKE_POST_MUTATION = gql`
  mutation LikePost($input: LikePostInput!) {
    likePost(input: $input) {
      id
      postId
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
const REPORT_POST_MUTATION = gql`
  mutation ReportPost($input: ReportPostInput!) {
    reportPost(input: $input) {
      id
      reportedPost {
        id
      }
      description
    }
  }
`;
const COMMENT_ADDED_SUBSCRIPTION = gql`
  subscription CommentAdded($postId: Int!) {
    commentAdded(postId: $postId) {
      id
      content
      author {
        id
        name
      }
      parentId
      createdAt
    }
  }
`;
const COMMENT_EDITED_SUBSCRIPTION = gql`
  subscription CommentEdited($postId: Int!) {
    commentEdited(postId: $postId) {
      id
      content
      parentId
      createdAt
    }
  }
`;

PostData.propTypes = {
  postId: Proptypes.number
};

export default function PostData({ postId }) {
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserData(user);
  }, []);

  const { loading, error, data, refetch, subscribeToMore } = useQuery(GET_SINGLE_POST, {
    variables: { input: { postId: postId } },
    pollInterval: 10000
  });
  if (error) console.log(error);

  useEffect(() => {
    const handleUpdateNewCmt = async () => {
      subscribeToMore({
        document: COMMENT_ADDED_SUBSCRIPTION,
        variables: { postId: postId },
        updateQuery: (prev, { subscriptionData }) => {
          const newComment = subscriptionData.data.commentAdded;
          if (newComment.parentId) {
            const newPost = {
              ...prev.getSinglePost,
              comments: prev.getSinglePost.comments.map((cmt) => {
                if (cmt.id === newComment.parentId) {
                  return {
                    ...cmt,
                    childrenComments: [...cmt.childrenComments, newComment]
                  };
                } else {
                  return cmt;
                }
              })
            };
            return Object.assign({}, prev, { getSinglePost: newPost });
          } else {
            const newPost = {
              ...prev.getSinglePost,
              comments: [...prev.getSinglePost.comments, newComment]
            };
            return Object.assign({}, prev, { getSinglePost: newPost });
          }
        }
      });
    };
    handleUpdateNewCmt();
  }, []);

  useEffect(() => {
    const handleUpdateEditedCmt = async () => {
      subscribeToMore({
        document: COMMENT_EDITED_SUBSCRIPTION,
        variables: { postId: postId },
        updateQuery: (prev, { subscriptionData }) => {
          const editedComment = subscriptionData.data.commentEdited;
          if (editedComment.parentId === 0) {
            const newPost = {
              ...prev.getSinglePost,
              comments: prev.getSinglePost.comments.map((cmt) => {
                if (cmt.id === editedComment.id) {
                  return editedComment;
                } else {
                  return cmt;
                }
              })
            };
            return Object.assign({}, prev, { getSinglePost: newPost });
          } else {
            const newPost = {
              ...prev.getSinglePost,
              comments: prev.getSinglePost.comments.map((cmt) => {
                if (cmt.id === editedComment.parentId) {
                  return {
                    ...cmt,
                    childrenComments: cmt.childrenComments.map((childCmt) => {
                      if (childCmt.id === editedComment.id) {
                        return editedComment;
                      } else {
                        return childCmt;
                      }
                    })
                  };
                } else {
                  return cmt;
                }
              })
            };
            return Object.assign({}, prev, { getSinglePost: newPost });
          }
        }
      });
    };
    handleUpdateEditedCmt();
  }, []);

  const [likePost] = useMutation(LIKE_POST_MUTATION);
  const handleLikePost = async () => {
    try {
      await likePost({
        variables: {
          input: {
            postId: postId
          }
        }
      });
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();
  const [deletePost] = useMutation(DELETE_POST_MUTATION);
  const handleDeletePost = async () => {
    try {
      await deletePost({
        variables: {
          input: {
            postId: postId
          }
        }
      });
      toast({
        title: 'Delete post successfully',
        status: 'success',
        isClosable: true,
        position: 'bottom-right'
      });
      navigate('/');
      refetch();
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        isClosable: true,
        position: 'bottom-right'
      });
    }
  };

  const reportRef = useRef();
  const [reportPost] = useMutation(REPORT_POST_MUTATION);
  const handleReportPost = async () => {
    if (reportRef.current.value.length < 10) {
      toast({
        title: 'Must be at least 10 characters long',
        status: 'error',
        isClosable: true,
        position: 'bottom-right'
      });
      return;
    }
    try {
      await reportPost({
        variables: {
          input: {
            reportedPostId: postId,
            description: reportRef.current.value
          }
        }
      });
      toast({
        title: 'Report post successfully',
        status: 'success',
        isClosable: true,
        position: 'bottom-right'
      });
      onClose();
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        isClosable: true,
        position: 'bottom-right'
      });
    }
  };

  return loading ? null : (
    <Flex
      w={data.getSinglePost.images.length > 0 ? '30%' : '40%'}
      h="92vh"
      flexDirection="column"
      bg="white"
      mt="8vh"
      position="relative">
      <Flex
        flexDirection="column"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px'
          },
          '&::-webkit-scrollbar-track': {
            width: '6px'
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'green',
            borderRadius: '24px'
          }
        }}
        maxH="84vh"
        overflowY="auto"
        overflowX="hidden"
        position="relative">
        <Flex p={4} gap={4}>
          <Link to={'/profile/' + data.getSinglePost.author.id}>
            <Avatar src={data.getSinglePost.author.avatar} name={data.getSinglePost.author.name} />
          </Link>
          <Flex flexDirection="column">
            <Text fontWeight="bold">{data.getSinglePost.author.name}</Text>
            <Text fontSize="smaller" fontStyle="italic">
              {timeFromNow(data.getSinglePost.createdAt)}
            </Text>
          </Flex>
          <Box pos="absolute" right={4}>
            <Menu>
              <MenuButton as={IconButton} aria-label="Options" icon={<CiMenuKebab />} />
              <MenuList>
                {userData.id !== data.getSinglePost.author.id ? null : (
                  <>
                    <MenuItem
                      icon={
                        <Box>
                          <AiOutlineEdit size={20} />
                        </Box>
                      }>
                      Edit
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleDeletePost()}
                      icon={
                        <Box color="red.600">
                          <BsFillTrashFill size={20} />
                        </Box>
                      }>
                      Delete
                    </MenuItem>
                  </>
                )}
                {userData.id === data.getSinglePost.author.id ? null : (
                  <MenuItem
                    onClick={onOpen}
                    icon={
                      <Box color="yellow.600">
                        <MdReport size={20} />
                      </Box>
                    }>
                    Report
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </Box>
        </Flex>
        <Text mx={6}>{data.getSinglePost.content}</Text>
        <Flex
          py={4}
          w="100%"
          borderY="1px"
          borderColor="gray.400"
          mt={8}
          alignItems="center"
          justifyItems="center">
          <Flex justifyContent="center" alignItems="center" w="50%">
            <Box
              cursor="pointer"
              color={
                data.getSinglePost.likes.find((like) => like.user.id === userData.id)
                  ? 'pink.400'
                  : 'gray.600'
              }
              _hover={{ color: 'pink.400', transition: '0.4s ease-out' }}>
              <AiFillHeart size={28} onClick={() => handleLikePost()} />
            </Box>
            <Text ml={2} fontSize="large">
              {data.getSinglePost.likes.length}
            </Text>
          </Flex>
          <Flex justifyContent="center" alignItems="center" color="gray.600" w="50%">
            <Box
              cursor="pointer"
              _hover={{ color: 'primary.600', transition: '0.4s ease-out' }}
              color="gray.600">
              <AiOutlineComment size={28} />
            </Box>
            <Text ml={2} fontSize="large">
              {data.getSinglePost.comments.reduce(
                (sum, cmt) => sum + cmt.childrenComments.length + 1,
                0
              )}
            </Text>
          </Flex>
        </Flex>
        <Flex flexDir="column">
          {data.getSinglePost.comments.map((cmt, index) => (
            <Comment key={index} data={cmt} postId={data.getSinglePost.id} refetch={refetch} />
          ))}
        </Flex>
      </Flex>
      <Box pos="absolute" bottom={0} w="full" bg="white">
        <CommentInput postId={data.getSinglePost.id} refetch={refetch} />
      </Box>

      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea ref={reportRef} placeholder="Here is the description..." />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => handleReportPost()} colorScheme="red">
              Report
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
