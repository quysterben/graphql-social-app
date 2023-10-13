/* eslint-disable react/prop-types */
import { Flex, Avatar, Text } from '@chakra-ui/react';

import { FaUserFriends } from 'react-icons/fa';
import { MdGroups } from 'react-icons/md';
import { GoVideo } from 'react-icons/go';
import { BiSolidTime } from 'react-icons/bi';
import { AiOutlineSave, AiOutlineMessage } from 'react-icons/ai';

const menuItemsStyles = {
  py: 2,
  rounded: 'lg',
  cursor: 'pointer',
  alignItems: 'center',
  _hover: { bg: 'gray.200' }
};

export default function LeftSideBar({ userData }) {
  return (
    <Flex
      w="18rem"
      bg="white"
      rounded="md"
      p="4"
      flexDirection="column"
      gap="4"
      position="fixed"
      left="0">
      <Flex sx={menuItemsStyles}>
        <Avatar mx="0.8rem" size="sm" name={userData.name} src={userData.avatar} />
        <Text fontWeight="bold">{userData.name}</Text>
      </Flex>
      <Flex sx={menuItemsStyles}>
        <Flex mx={4} color="primary.600">
          <FaUserFriends size={28} />
        </Flex>
        <Text fontWeight="medium">Friends</Text>
      </Flex>
      <Flex sx={menuItemsStyles}>
        <Flex mx={4} color="primary.800">
          <MdGroups size={28} />
        </Flex>
        <Text fontWeight="medium">Groups</Text>
      </Flex>
      <Flex sx={menuItemsStyles}>
        <Flex mx={4} color="yellow.500">
          <GoVideo size={28} />
        </Flex>
        <Text fontWeight="medium">Video</Text>
      </Flex>
      <Flex sx={menuItemsStyles}>
        <Flex mx={4} color="red.400">
          <BiSolidTime size={28} />
        </Flex>
        <Text fontWeight="medium">Memories</Text>
      </Flex>
      <Flex sx={menuItemsStyles}>
        <Flex mx={4} color="purple.600">
          <AiOutlineSave size={28} />
        </Flex>
        <Text fontWeight="medium">Saved</Text>
      </Flex>
      <Flex sx={menuItemsStyles}>
        <Flex mx={4} color="primary.600">
          <AiOutlineMessage size={28} />
        </Flex>
        <Text fontWeight="medium">Messenger</Text>
      </Flex>
    </Flex>
  );
}
