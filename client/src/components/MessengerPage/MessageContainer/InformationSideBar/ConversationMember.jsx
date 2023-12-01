import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

import { Avatar, Button, Flex, Text, Box, useToast } from '@chakra-ui/react';
import { IoPersonRemoveOutline } from 'react-icons/io5';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Checkbox,
  CheckboxGroup
} from '@chakra-ui/react';
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter
} from '@chakra-ui/react';

import Loader from '../../../Loader';

import { gql, useQuery, useMutation } from '@apollo/client';
const GET_CONVERSATION_INFO = gql`
  query GetConversationInfo($conversationId: Int!) {
    getConversationInfo(conversationId: $conversationId) {
      id
      name
      isGroup
      image
      members {
        avatar
        name
        id
      }
    }
  }
`;
const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      avatar
    }
  }
`;
const ADD_NEW_MEMBERs = gql`
  mutation AddConversationMembers($conversationId: Int!, $newMembers: [Int!]!) {
    addConversationMembers(conversationId: $conversationId, newMembers: $newMembers) {
      id
    }
  }
`;
const REMOTE_MEMBER = gql`
  mutation RemoveConversationMember($conversationId: Int!, $memberToRemove: Int!) {
    removeConversationMember(conversationId: $conversationId, memberToRemove: $memberToRemove) {
      id
    }
  }
`;

export default function ConversationMember() {
  const url = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [checkedUsers, setCheckedUsers] = useState([]);
  useEffect(() => {
    setCheckedUsers([]);
  }, [isOpen]);

  const { loading: loadingUsers, data: dataUsers } = useQuery(GET_ALL_USERS);

  const { loading, error, data, refetch } = useQuery(GET_CONVERSATION_INFO, {
    variables: { conversationId: Number(url.id) }
  });
  if (error) return <p>Error</p>;

  const toast = useToast();
  const [addConversationMembers] = useMutation(ADD_NEW_MEMBERs);
  const handleAddMembers = async () => {
    console.log(checkedUsers);
    if (checkedUsers.length === 0) {
      toast({
        title: 'Please choose new member',
        status: 'error',
        duration: 2000,
        position: 'bottom-right',
        isClosable: true
      });
      return;
    }

    try {
      await addConversationMembers({
        variables: { conversationId: Number(url.id), newMembers: checkedUsers }
      });
      toast({
        title: 'Add new members successfully',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
      onClose();
      refetch();
    } catch (err) {
      toast({
        title: err.member,
        status: 'error',
        duration: 2000,
        isClosable: true
      });
    }
  };

  const [selectedUser, setSelectedUser] = useState(null);
  const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
  const cancelRef = useRef();
  const [removeConversationMember] = useMutation(REMOTE_MEMBER);
  const handleRemove = async (memberId) => {
    try {
      await removeConversationMember({
        variables: { conversationId: Number(url.id), memberToRemove: memberId }
      });
      toast({
        title: 'Remove member successfully',
        status: 'success',
        duration: 2000,
        position: 'bottom-right',
        isClosable: true
      });
      refetch();
      onCloseAlert();
    } catch (err) {
      toast({
        title: 'Remove member failed',
        status: 'error',
        duration: 2000,
        position: 'bottom-right',
        isClosable: true
      });
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      {data.getConversationInfo.isGroup && (
        <Button size="sm" w="full" onClick={onOpen} colorScheme="blue">
          Add members
        </Button>
      )}
      <Flex maxH={160} overflowY="auto" mt={4} gap={1} flexDir="column">
        {data.getConversationInfo.members.map((member) => {
          return (
            <Flex mx={4} gap={4} key={member.id} alignItems="center" justifyContent="space-between">
              <Flex
                flex={1}
                cursor="pointer"
                borderRadius="md"
                p={2}
                _hover={{ bg: 'gray.400' }}
                gap={4}
                alignItems="center">
                <Avatar borderRadius="none" size="sm" src={member.avatar} name={member.name} />
                <Text>{member.name}</Text>
              </Flex>
              {member.id === currentUser.id || (
                <Flex
                  onClick={() => {
                    onOpenAlert();
                    setSelectedUser(member.id);
                  }}
                  cursor="pointer"
                  justifyContent="end">
                  <IoPersonRemoveOutline />
                </Flex>
              )}
            </Flex>
          );
        })}
      </Flex>

      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add new member to conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box maxHeight={200} overflowY="auto">
              {loadingUsers ? null : (
                <CheckboxGroup colorScheme="facebook">
                  <Flex gap={4} flexDir="column" ml={4}>
                    {dataUsers.getAllUsers
                      .filter((obj) => {
                        return !data.getConversationInfo.members.some(
                          (param) => param.id === obj.id
                        );
                      })
                      .map(
                        (user, index) =>
                          user.id === currentUser.id || (
                            <Checkbox
                              key={index}
                              isChecked={checkedUsers.includes(user.id)}
                              onChange={() =>
                                checkedUsers.includes(user.id)
                                  ? setCheckedUsers(
                                      checkedUsers.filter((param) => param !== user.id)
                                    )
                                  : setCheckedUsers([...checkedUsers, user.id])
                              }>
                              <Flex gap={2} mx={2} alignItems="center">
                                <Avatar
                                  borderRadius={0}
                                  size="sm"
                                  name={user.name}
                                  src={user.avatar}
                                />
                                <Text>{user.name}</Text>
                              </Flex>
                            </Checkbox>
                          )
                      )}
                  </Flex>
                </CheckboxGroup>
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleAddMembers} colorScheme="facebook">
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog isOpen={isOpenAlert} leastDestructiveRef={cancelRef} onClose={onCloseAlert}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remove this user
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseAlert}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => handleRemove(selectedUser)} ml={3}>
                Remove
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
