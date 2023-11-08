import { useState } from 'react';

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
  Text
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

import { gql, useQuery } from '@apollo/client';
const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      avatar
    }
  }
`;

export default function SearchBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { loading, error, data } = useQuery(GET_ALL_USERS);
  if (error) console.log(error);

  const [checkedUsers, setCheckedUsers] = useState([]);

  console.log(checkedUsers);

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
            <Input placeholder="Conversation's name..." />
            <Box mt={4}>
              <Heading mb={4} ml={2} size="sm">
                Add members
              </Heading>
              <Box maxHeight={200} overflowY="auto">
                {loading ? null : (
                  <CheckboxGroup colorScheme="facebook">
                    <Flex gap={4} flexDir="column" ml={4}>
                      {data.getAllUsers.map((user, index) => (
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
                      ))}
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
            <Button colorScheme="facebook">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
