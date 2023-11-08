/* eslint-disable react/prop-types */
import moment from 'moment';
import Tippy from '@tippyjs/react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { AiFillHeart, AiOutlineComment, AiOutlineEdit } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
import { CiMenuKebab } from 'react-icons/ci';
import { MdReport } from 'react-icons/md';

import UserTooltip from '../UserTooltip';

import {
  Avatar,
  Box,
  Text,
  Flex,
  Image,
  SimpleGrid,
  IconButton,
  useToast,
  Button,
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
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';

import { useMutation, gql } from '@apollo/client';
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

export default function Post({ postData, userData, refetch }) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [liked, setLiked] = useState();
  const handleTime = () => {
    const time = moment(postData.createdAt).fromNow();
    return time;
  };

  const [likeCount, setLikeCount] = useState(postData.likes.length);
  useEffect(() => {
    const found = postData.likes.find((like) => like.user.id === userData.id);
    if (found) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, []);

  const [likePost] = useMutation(LIKE_POST_MUTATION);
  const handleLikePost = async () => {
    try {
      await likePost({
        variables: {
          input: {
            postId: postData.id
          }
        }
      });
      if (liked === false) {
        setLikeCount(likeCount + 1);
      } else {
        setLikeCount(likeCount - 1);
      }
      setLiked(!liked);
    } catch (err) {
      console.log(err);
    }
  };

  const [deletePost] = useMutation(DELETE_POST_MUTATION);
  const handleDeletePost = async () => {
    try {
      await deletePost({
        variables: {
          input: {
            postId: postData.id
          }
        }
      });
      toast({
        title: 'Delete post successfully',
        status: 'success',
        isClosable: true,
        position: 'bottom-right'
      });
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
            reportedPostId: postData.id,
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

  return (
    <Box rounded="lg" w="100%" bg="white">
      <Flex p={4} alignItems="center" gap={4} pos="relative">
        <Tippy placement="top-start" content={<UserTooltip />} interactive={true}>
          <Link to={'/profile/' + postData.author.id}>
            <Avatar cursor="pointer" src={postData.author.avatar} name={postData.author.name} />
          </Link>
        </Tippy>
        <Link to={'/profile/' + postData.author.id}>
          <Flex cursor="pointer" flexDirection="column">
            <Text fontWeight="bold" color="primary.600">
              {postData.author.name}
            </Text>
            <Text fontSize="smaller" fontStyle="italic">
              {handleTime()}
            </Text>
          </Flex>
        </Link>
        <Box pos="absolute" right={4}>
          <Menu>
            <MenuButton as={IconButton} aria-label="Options" icon={<CiMenuKebab />} />
            <MenuList>
              {userData.id !== postData.author.id ? null : (
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
              {userData.id === postData.author.id ? null : (
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
      <Text mx={6} mb={4}>
        {postData.content}
      </Text>
      <SimpleGrid px={1} columns={postData.images.length === 1 ? 1 : 2}>
        {postData.images.map((image, index, data) =>
          index < 4 ? (
            <Link to={'/post/' + postData.id} key={index}>
              <Box cursor="pointer" position="relative">
                <Image
                  opacity={index === 3 && data.length > 4 ? '0.2' : '1'}
                  boxSize={'full'}
                  src={image.imageUrl}
                  alt=""
                />
                <Text fontSize="7xl" right="30%" top="25%" position="absolute">
                  {index === 3 && data.length > 4 ? `+${data.length - 4}` : null}
                </Text>
              </Box>
            </Link>
          ) : null
        )}
      </SimpleGrid>
      <Flex
        py={4}
        w="100%"
        borderTop="1px"
        borderColor="gray.400"
        mt={8}
        alignItems="center"
        justifyItems="center">
        <Flex justifyContent="center" alignItems="center" w="50%">
          <Box
            cursor="pointer"
            color={liked ? 'pink.400' : 'gray.600'}
            _hover={{ color: 'pink.400', transition: '0.4s ease-out' }}>
            <AiFillHeart size={28} onClick={() => handleLikePost()} />
          </Box>
          <Text ml={2} fontSize="large">
            {likeCount}
          </Text>
        </Flex>
        <Flex justifyContent="center" alignItems="center" color="gray.600" w="50%">
          <Box
            cursor="pointer"
            _hover={{ color: 'primary.600', transition: '0.4s ease-out' }}
            color="gray.600">
            <Link to={'/post/' + postData.id}>
              <AiOutlineComment size={28} />
            </Link>
          </Box>
          <Text ml={2} fontSize="large">
            {postData.comments.reduce((sum, cmt) => sum + cmt.childrenComments.length + 1, 0)}
          </Text>
        </Flex>
      </Flex>

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
    </Box>
  );
}
