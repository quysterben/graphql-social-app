import { useState } from 'react';

import { Avatar, Button, Flex, Text, Box } from '@chakra-ui/react';
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

import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
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

export default function ConversationMember() {
  const url = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [checkedUsers, setCheckedUsers] = useState([]);

  const { loading: loadingUsers, data: dataUsers } = useQuery(GET_ALL_USERS);

  const { loading, error, data } = useQuery(GET_MEMBERS, {
    variables: { conversationId: Number(url.id) }
  });
  if (error) return <p>Error</p>;

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
                    {dataUsers.getAllUsers.map((user, index) =>
                      user.id === currentUser.id ? null : (
                        <Checkbox
                          key={index}
                          isChecked={checkedUsers.includes(user.id)}
                          onChange={() =>
                            checkedUsers.includes(user.id)
                              ? setCheckedUsers(checkedUsers.filter((param) => param !== user.id))
                              : setCheckedUsers([...checkedUsers, user.id])
                          }>
                          <Flex gap={2} mx={2} alignItems="center">
                            <Avatar borderRadius={0} size="sm" name={user.name} src={user.avatar} />
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
            <Button colorScheme="facebook">Add</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
