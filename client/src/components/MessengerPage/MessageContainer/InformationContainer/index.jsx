/* eslint-disable react/prop-types */
import { Flex, Avatar, AvatarBadge, Heading, Text, IconButton } from '@chakra-ui/react';

import { AiFillPhone, AiFillVideoCamera } from 'react-icons/ai';
import { HiInformationCircle } from 'react-icons/hi';

export default function InformationContainer({ handleShowInformationSideBar }) {
  return (
    <Flex
      bg="white"
      w="full"
      h={16}
      borderRadius="xl"
      alignItems="center"
      p={2}
      gap={4}
      pos="relative">
      <Avatar ml={2} size="md" name="Dan Abrahmov" src="https://bit.ly/code-beast" cursor="pointer">
        <AvatarBadge boxSize={4} bg="green.500" />
      </Avatar>
      <Flex flexDir="column">
        <Heading size="md">Username</Heading>
        <Text fontWeight="md" color="gray.600">
          Online
        </Text>
      </Flex>
      <Flex gap={1} pos="absolute" right={4}>
        <IconButton
          bgColor="white"
          borderRadius="full"
          color="blue.500"
          icon={<AiFillPhone size={26} />}
        />
        <IconButton
          bgColor="white"
          borderRadius="full"
          color="blue.500"
          icon={<AiFillVideoCamera size={26} />}
        />
        <IconButton
          bgColor="white"
          borderRadius="full"
          color="blue.500"
          onClick={handleShowInformationSideBar}
          icon={<HiInformationCircle size={26} />}
        />
      </Flex>
    </Flex>
  );
}
