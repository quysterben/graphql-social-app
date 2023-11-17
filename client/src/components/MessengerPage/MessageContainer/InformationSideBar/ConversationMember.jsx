import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { Avatar, Button, Flex, Text, Box, useToast } from '@chakra-ui/react';
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

import Loader from '../../../Loader';

import { gql, useQuery, useMutation } from '@apollo/client';
const GET_MEMBERS = gql`
  query GetConversationMembers($conversationId: Int!) {
    getConversationMembers(conversationId: $conversationId) {
      id
      name
      avatar
      wallpaper
      isOnline
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

export default function ConversationMember() {
  const url = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [checkedUsers, setCheckedUsers] = useState([]);
  useEffect(() => {
    setCheckedUsers([]);
  }, [isOpen]);

  const { loading: loadingUsers, data: dataUsers } = useQuery(GET_ALL_USERS);

  const { loading, error, data, refetch } = useQuery(GET_MEMBERS, {
    variables: { conversationId: Number(url.id) }
  });
  if (error) return <p>Error</p>;

  const toast = useToast();
  const [addConversationMembers] = useMutation(ADD_NEW_MEMBERs);
  const handleSubmit = async () => {
    if (checkedUsers.length === 0) {
      toast({
        title: 'No new members',
        status: 'error',
        duration: 2000,
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
        title: 'No new members',
        status: 'error',
        duration: 2000,
        isClosable: true
      });
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      {data.getConversationMembers.length > 2 && (
        <Button size="sm" w="full" onClick={onOpen} colorScheme="blue">
          Add members
        </Button>
      )}
      <Flex maxH={160} overflowY="auto" mt={4} gap={1} flexDir="column">
        {data.getConversationMembers.map((member) => {
          return (
            <Flex
              cursor="pointer"
              borderRadius="md"
              p={2}
              _hover={{ bg: 'gray.400' }}
              gap={4}
              alignItems="center"
              key={member.id}>
              <Avatar borderRadius="none" size="sm" src={member.avatar} name={member.name} />
              <Text>{member.name}</Text>
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
                        return !data.getConversationMembers.some((param) => param.id === obj.id);
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
            <Button onClick={handleSubmit} colorScheme="facebook">
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
