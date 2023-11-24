/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import timeFromNow from '../../../helpers/timeFromNow';

import {
  Flex,
  Text,
  Avatar,
  Box,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';

import { AiOutlineEdit } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
import { BsReply } from 'react-icons/bs';
import { BsThreeDots } from 'react-icons/bs';

import CommentInput from './CommentInput';

import { gql, useMutation } from '@apollo/client';
import ReportCommentMenuItem from './ReportCommentMenuItem';
import ChildComment from './ChildComment';
const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($input: SingleCommentInput!) {
    deleteComment(input: $input) {
      message
    }
  }
`;

export default function Comment({ data, postId, refetch }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const toast = useToast();

  const [isReply, setIsReply] = useState(false);
  const handleSetIsReply = (value) => {
    setIsReply(value);
  };
  const scrollRef = useRef();
  useEffect(() => {
    if (isReply) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [isReply, data]);

  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION);
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment({ variables: { input: { commentId } } });
      refetch();
      toast({
        title: 'Delete comment successfully',
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

  return (
    <Flex p={2} gap={2} flexDirection="column">
      <Flex gap={2} justifyContent="space-between">
        <Link to={'/profile/' + data.author.id}>
          <Flex gap={2}>
            <Avatar size="sm" src={data.author.avatar} name={data.author.name} />
            <Flex flexDirection="column">
              <Text fontSize="smaller" fontWeight="bold">
                {data.author.name}
              </Text>
              <Text fontSize="xx-small" fontStyle="italic">
                {timeFromNow(data.createdAt)}
              </Text>
            </Flex>
          </Flex>
        </Link>
        <Flex alignItems="center" mr={2}>
          <Menu>
            <MenuButton onClick={() => setIsReply(false)}>
              <BsThreeDots />
            </MenuButton>
            <MenuList>
              {user.id !== data.author.id ? null : (
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
                    onClick={() => handleDeleteComment(data.id)}
                    icon={
                      <Box color="red.600">
                        <BsFillTrashFill size={20} />
                      </Box>
                    }>
                    Delete
                  </MenuItem>
                </>
              )}
              {user.id === data.author.id ? null : <ReportCommentMenuItem commentId={data.id} />}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Box bg="gray.200" borderRadius="md" position="relative">
        <Text mx={2} p={2} pr={8}>
          {data.content}
        </Text>
        <Flex
          cursor="pointer"
          position="absolute"
          justifyContent="center"
          alignItems="center"
          right={3}
          top={3}>
          <Box onClick={() => setIsReply(!isReply)}>
            <BsReply />
          </Box>
        </Flex>
      </Box>
      <Flex flexDir="column" gap={2}>
        {data.childrenComments.map((child, index) => (
          <ChildComment
            key={index}
            child={child}
            handleDeleteComment={handleDeleteComment}
            handleSetIsReply={handleSetIsReply}
          />
        ))}
        {isReply ? (
          <Box ml={6}>
            <CommentInput
              scrollRef={scrollRef}
              isChild={true}
              postId={postId}
              parentId={data.id}
              refetch={refetch}
            />
          </Box>
        ) : null}
      </Flex>
    </Flex>
  );
}
