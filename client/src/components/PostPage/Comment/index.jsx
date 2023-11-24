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
  MenuItem,
  useOutsideClick,
  Button,
  Input
} from '@chakra-ui/react';

import { AiOutlineEdit } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
import { BsReply } from 'react-icons/bs';
import { BsThreeDots } from 'react-icons/bs';

import CommentInput from './CommentInput';
import ReportCommentMenuItem from './ReportCommentMenuItem';

import { gql, useMutation } from '@apollo/client';
import ChildComment from './ChildComment';
const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($input: SingleCommentInput!) {
    deleteComment(input: $input) {
      message
    }
  }
`;
const EDIT_COMMENT_MUTATION = gql`
  mutation EditComment($input: EditCommentInput!) {
    editComment(input: $input) {
      id
      content
      parentId
      createdAt
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

  useOutsideClick({
    ref: scrollRef,
    handler: () => {
      setIsReply(false);
    }
  });

  //handleEditComment
  const componentRef = useRef(null);
  const inputRef = useRef(null);
  const [isEdit, setIsEdit] = useState(false);
  useOutsideClick({
    ref: componentRef,
    handler: () => {
      setIsEdit(false);
    }
  });
  const [editComment] = useMutation(EDIT_COMMENT_MUTATION);
  const handleEditComment = async (e) => {
    e.preventDefault();
    if (inputRef.current.value.length < 2 || inputRef.current.value.trim().length < 1) return;
    try {
      await editComment({
        variables: {
          input: {
            commentId: data.id,
            content: inputRef.current.value
          }
        }
      });
      setIsEdit(false);
      inputRef.current.value = '';
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        isClosable: true,
        position: 'bottom-right'
      });
      setIsEdit(false);
      inputRef.current.value = '';
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
                    onClick={() => setIsEdit(true)}
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
        {isEdit ? (
          <Flex ref={componentRef} as="form" flexDir="column" onSubmit={handleEditComment}>
            <Input ref={inputRef} defaultValue={data.content} />
            <Flex gap={2} flexDir="row-reverse" p={1} bg="gray.200">
              <Button onClick={() => setIsEdit(false)} bg="gray.100" variant="outline" size="sm">
                Cancel
              </Button>
              <Button type="submit" bg="blue.300" _hover={{ bg: 'blue.200' }} size="sm">
                Done Editing
              </Button>
            </Flex>
          </Flex>
        ) : (
          <Text mx={2} p={2} pr={8}>
            {data.content}
          </Text>
        )}
        {isEdit || (
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
        )}
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
