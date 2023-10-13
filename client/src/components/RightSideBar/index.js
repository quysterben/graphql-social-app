import { Flex, Heading, Avatar, Text, Button, AvatarBadge } from '@chakra-ui/react';

export default function RightSideBar() {
  return (
    <Flex
      w="18rem"
      bg="white"
      rounded="md"
      p="4"
      mt="3.8rem"
      flexDirection="column"
      gap="4"
      position="absolute"
      right="0">
      <Flex flexDirection="column" gap={4}>
        <Heading size="sm" color="gray.600">
          Suggestions For You
        </Heading>
        <Flex flexDirection="column" gap="4">
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center">
              <Avatar mx="0.8rem" size="sm" name="test" />
              <Text fontWeight="bold">Abcdef</Text>
            </Flex>
            <Button w="6rem" size="sm" colorScheme="blue">
              Add friend
            </Button>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center">
              <Avatar mx="0.8rem" size="sm" name="test" />
              <Text fontWeight="bold">Abcdef</Text>
            </Flex>
            <Button w="6rem" size="sm" colorScheme="blue">
              Add friend
            </Button>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center">
              <Avatar mx="0.8rem" size="sm" name="test" />
              <Text fontWeight="bold">Abcdef</Text>
            </Flex>
            <Button w="6rem" size="sm" colorScheme="blue">
              Add friend
            </Button>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center">
              <Avatar mx="0.8rem" size="sm" name="test" />
              <Text fontWeight="bold">Abcdef</Text>
            </Flex>
            <Button w="6rem" size="sm" colorScheme="blue">
              Add friend
            </Button>
          </Flex>
        </Flex>
        <hr></hr>
        <Heading size="sm" color="gray.600">
          Online Friends
        </Heading>
        <Flex flexDirection="column" gap="4">
          <Flex alignItems="center">
            <Avatar mx="0.8rem" size="sm" name="test">
              <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar>
            <Text fontWeight="bold">Friends</Text>
          </Flex>
          <Flex alignItems="center">
            <Avatar mx="0.8rem" size="sm" name="test">
              <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar>
            <Text fontWeight="bold">Friends</Text>
          </Flex>
          <Flex alignItems="center">
            <Avatar mx="0.8rem" size="sm" name="test">
              <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar>
            <Text fontWeight="bold">Friends</Text>
          </Flex>
          <Flex alignItems="center">
            <Avatar mx="0.8rem" size="sm" name="test">
              <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar>
            <Text fontWeight="bold">Friends</Text>
          </Flex>
          <Flex alignItems="center">
            <Avatar mx="0.8rem" size="sm" name="test">
              <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar>
            <Text fontWeight="bold">Friends</Text>
          </Flex>
          <Flex alignItems="center">
            <Avatar mx="0.8rem" size="sm" name="test">
              <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar>
            <Text fontWeight="bold">Friends</Text>
          </Flex>
          <Flex alignItems="center">
            <Avatar mx="0.8rem" size="sm" name="test">
              <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar>
            <Text fontWeight="bold">Friends</Text>
          </Flex>
          <Flex alignItems="center">
            <Avatar mx="0.8rem" size="sm" name="test">
              <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar>
            <Text fontWeight="bold">Friends</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
