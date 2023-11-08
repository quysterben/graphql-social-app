/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import {
  Flex,
  Text,
  Avatar,
  Box,
  useToast,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Textarea
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';

import { AiOutlineEdit } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
import { MdReport } from 'react-icons/md';
import { BsReply } from 'react-icons/bs';
import { BsThreeDots } from 'react-icons/bs';

import CommentInput from './CommentInput';

import { gql, useMutation } from '@apollo/client';
const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($input: SingleCommentInput!) {
    deleteComment(input: $input) {
      message
    }
  }
`;
const REPORT_COMMENT_MUTATION = gql`
  mutation ReportComment($input: ReportCommentInput!) {
    reportComment(input: $input) {
      id
      reportedComment {
        id
        content
      }
      description
      reportUser {
        id
        name
      }
    }
  }
`;

export default function Comment({ data, postId, refetch }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const toast = useToast();

  const handleTime = (createdAt) => {
    const time = moment(createdAt).fromNow();
    return time;
  };

  const [isReply, setIsReply] = useState(false);
  const scrollRef = useRef();
  useEffect(() => {
    if (isReply) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [isReply]);

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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reportComment] = useMutation(REPORT_COMMENT_MUTATION);
  const reportRef = useRef();
  const [reportedCmtId, setReportedCmtId] = useState();
  const handleReportComment = async () => {
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
      await reportComment({
        variables: {
          input: {
            reportedCommentId: reportedCmtId,
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
                {handleTime(data.createdAt)}
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
              {user.id === data.author.id ? null : (
                <MenuItem
                  onClick={() => {
                    onOpen();
                    setReportedCmtId(data.id);
                  }}
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
          <Flex ml={6} key={index} flexDir="column" gap={2}>
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
                  <MenuButton onClick={() => setIsReply(false)}>
                    <BsThreeDots />
                  </MenuButton>
                  <MenuList>
                    {user.id !== child.author.id ? null : (
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
                    {user.id === child.author.id ? null : (
                      <MenuItem
                        onClick={() => {
                          onOpen();
                          setReportedCmtId(child.id);
                        }}
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
              </Flex>
            </Flex>
            <Box bg="gray.100" borderRadius="md">
              <Text mx={2} p={2}>
                {child.content}
              </Text>
            </Box>
          </Flex>
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
            <Button onClick={() => handleReportComment()} colorScheme="red">
              Report
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
