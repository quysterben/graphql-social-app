import React from 'react';

import { Flex, Heading, InputGroup, Input, InputRightElement, IconButton } from '@chakra-ui/react';

import { AiOutlineSearch } from 'react-icons/ai';
import { BsPlusLg } from 'react-icons/bs';

export default function SearchBar() {
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
      <IconButton borderRadius="full" colorScheme="blue" size="sm" icon={<BsPlusLg />} />
    </Flex>
  );
}
