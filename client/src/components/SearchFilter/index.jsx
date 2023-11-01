/* eslint-disable react/prop-types */
import React from 'react';

import { Flex, Heading, Text } from '@chakra-ui/react';
import { FaUsers, FaUserFriends } from 'react-icons/fa';
import { AiOutlinePicRight, AiOutlineDatabase } from 'react-icons/ai';

const menuItemsStyles = {
  py: 2,
  rounded: 'lg',
  cursor: 'pointer',
  alignItems: 'center',
  _hover: { bg: 'gray.400' }
};

export default function SearchFilter({ handleSetSearchFilter, searchFilter }) {
  return (
    <Flex
      w="18rem"
      bg="white"
      rounded="md"
      p="4"
      flexDirection="column"
      gap="4"
      mt="3.4rem"
      position="fixed"
      left="0"
      h="100vh">
      <Heading size="md" mt={4} color="gray.500">
        Search Filters
      </Heading>
      <Flex
        sx={menuItemsStyles}
        bg={searchFilter == 'all' ? 'gray.400' : null}
        onClick={() => handleSetSearchFilter('all')}>
        <Flex mx={4} color="primary.600">
          <AiOutlineDatabase size={28} />
        </Flex>
        <Text fontWeight="medium" fontSize="lg">
          All
        </Text>
      </Flex>
      <Flex
        sx={menuItemsStyles}
        bg={searchFilter == 'users' ? 'gray.400' : null}
        onClick={() => handleSetSearchFilter('users')}>
        <Flex mx={4} color="primary.600">
          <FaUsers size={28} />
        </Flex>
        <Text fontWeight="medium" fontSize="lg">
          People
        </Text>
      </Flex>
      <Flex
        sx={menuItemsStyles}
        bg={searchFilter == 'friends' ? 'gray.400' : null}
        onClick={() => handleSetSearchFilter('friends')}>
        <Flex mx={4} color="primary.800">
          <FaUserFriends size={28} />
        </Flex>
        <Text fontWeight="medium" fontSize="lg">
          Friends
        </Text>
      </Flex>
      <Flex
        sx={menuItemsStyles}
        bg={searchFilter == 'posts' ? 'gray.400' : null}
        onClick={() => handleSetSearchFilter('posts')}>
        <Flex mx={4} color="yellow.400">
          <AiOutlinePicRight size={28} />
        </Flex>
        <Text fontWeight="medium" fontSize="lg">
          Posts
        </Text>
      </Flex>
    </Flex>
  );
}
