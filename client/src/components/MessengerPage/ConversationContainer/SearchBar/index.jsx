/* eslint-disable react/prop-types */
import { useRef, useState } from 'react';

import {
  Flex,
  Heading,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  Button,
  Box,
  Avatar,
  Text,
  useToast
} from '@chakra-ui/react';
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

import { AiOutlineSearch } from 'react-icons/ai';
import { BsPlusLg } from 'react-icons/bs';

import { gql, useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      avatar
    }
  }
`;
const CREATE_NEW_CONVERSATION = gql`
  mutation CreateNewConversation($input: CreateNewConversationInput!) {
    createNewConversation(input: $input) {
      id
      name
      isGroup
      image
    }
  }
`;

export default function SearchBar({ refetch }) {
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const { loading, error, data } = useQuery(GET_ALL_USERS);
  if (error) console.log(error);

  const [checkedUsers, setCheckedUsers] = useState([]);

  const conversationNameRef = useRef();
  const [createNewConversation] = useMutation(CREATE_NEW_CONVERSATION);
  const handleSubmit = async () => {
    if (conversationNameRef.current.value.length < 4 && checkedUsers.length > 1) {
      return toast({
        title: 'Error.',
        description: 'Conversation name must be at least 4 characters.',
        status: 'error',
        position: 'bottom-right',
        duration: 9000,
        isClosable: true
      });
    }

    if (checkedUsers.length < 1) {
      return toast({
        title: 'Error.',
        description: 'You must add at least 1 member.',
        status: 'error',
        position: 'bottom-right',
        duration: 9000,
        isClosable: true
      });
    }

    try {
      const res = await createNewConversation({
        variables: {
          input: {
            name: conversationNameRef.current.value,
            members: checkedUsers
          }
        }
      });
      console.log(res);
      toast({
        title: 'Conversation created.',
        description: 'We have created a new conversation for you.',
        status: 'success',
        duration: 9000,
        position: 'bottom-right',
        isClosable: true
      });
      refetch();
      onClose();
      setCheckedUsers([]);
      navigate(`/messenger/${res.data.createNewConversation.id}`);
      conversationNameRef.current.value = '';
    } catch (error) {
      toast({
        title: 'Error.',
        description: 'Something went wrong.',
        status: 'error',
        position: 'bottom-right',
        duration: 9000,
        isClosable: true
      });
    }
  };

  return (
    <Flex
      w="98%"
      mt={1}
      p={4}
      boxShadow="sm"
      h={16}
      alignItems="center"
      bg="white"
      borderRadius="xl"
      gap={4}
      justifyContent="center">
      <Heading size="sm">Chat</Heading>
      <InputGroup size="sm" w="56%">
        <Input borderRadius="2xl" placeholder="Search" border="1px" borderColor="gray.400" />
        <InputRightElement>
          <AiOutlineSearch />
        </InputRightElement>
      </InputGroup>
      <IconButton
        onClick={onOpen}
        borderRadius="full"
        colorScheme="blue"
        size="sm"
        icon={<BsPlusLg />}
      />

      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              disabled={checkedUsers.length < 2}
              ref={conversationNameRef}
              placeholder="Conversation's name..."
            />
            <Box mt={4}>
              <Heading mb={4} ml={2} size="sm">
                Add members
              </Heading>
              <Box maxHeight={200} overflowY="auto">
                {loading ? null : (
                  <CheckboxGroup colorScheme="facebook">
                    <Flex gap={4} flexDir="column" ml={4}>
                      {data.getAllUsers.map((user, index) =>
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
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => handleSubmit()} colorScheme="facebook">
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
