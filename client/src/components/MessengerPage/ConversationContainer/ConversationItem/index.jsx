import { Flex, Avatar, Heading, Text } from '@chakra-ui/react';

export default function ConservationItem() {
  return (
    <Flex
      w="full"
      p={2}
      gap={4}
      cursor="pointer"
      borderRadius="2xl"
      boxShadow="sm"
      _hover={{
        bg: 'gray.200'
      }}>
      <Avatar size="md" name="Dan Abrahmov" src="https://bit.ly/code-beast" />
      <Flex flexDir="column" justifyContent="center" gap={2}>
        <Heading size="sm">Username</Heading>
        <Text fontSize="xs">Last Message</Text>
      </Flex>
    </Flex>
  );
}
