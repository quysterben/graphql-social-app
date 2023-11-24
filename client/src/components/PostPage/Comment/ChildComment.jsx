import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import ReportCommentMenuItem from './ReportCommentMenuItem';

import {
  Flex,
  Avatar,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Input,
  useOutsideClick,
  Button,
  useToast
} from '@chakra-ui/react';
import { BsThreeDots, BsFillTrashFill } from 'react-icons/bs';
import { AiOutlineEdit } from 'react-icons/ai';

import moment from 'moment';
const handleTime = (createdAt) => {
  const time = moment(createdAt).fromNow();
  return time;
};

import { gql, useMutation } from '@apollo/client';
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

ChildComment.propTypes = {
  child: PropTypes.object.isRequired,
  handleSetIsReply: PropTypes.func.isRequired,
  handleDeleteComment: PropTypes.func.isRequired
};

export default function ChildComment({ child, handleSetIsReply, handleDeleteComment }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const toast = useToast();

  // handleEditComment
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
            commentId: child.id,
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
    <Flex ref={componentRef} ml={6} flexDir="column" gap={2}>
      <Flex gap={2} justifyContent="space-between">
        <Flex gap={2}>
          <Link to={'/profile/' + child.author.id}>
            <Avatar size="sm" src={child.author.avatar} name={child.author.name} />
          </Link>
          <Flex flexDirection="column">
            <Text fontSize="smaller" fontWeight="bold">
              {child.author.name}
            </Text>
            <Text fontSize="xx-small" fontStyle="italic">
              {handleTime(child.createdAt)}
            </Text>
          </Flex>
        </Flex>
        <Flex alignItems="center" mr={2}>
          <Menu>
            <MenuButton onClick={() => handleSetIsReply(false)}>
              <BsThreeDots />
            </MenuButton>
            <MenuList>
              {user.id !== child.author.id ? null : (
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
                    onClick={() => handleDeleteComment(child.id)}
                    icon={
                      <Box color="red.600">
                        <BsFillTrashFill size={20} />
                      </Box>
                    }>
                    Delete
                  </MenuItem>
                </>
              )}
              {user.id === child.author.id ? null : <ReportCommentMenuItem commentId={child.id} />}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Box bg="gray.100" borderRadius="md" overflow="hidden">
        {isEdit ? (
          <Flex as="form" flexDir="column" onSubmit={handleEditComment}>
            <Input ref={inputRef} defaultValue={child.content} />
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
          <Text mx={2} p={2}>
            {child.content}
          </Text>
        )}
      </Box>
    </Flex>
  );
}
