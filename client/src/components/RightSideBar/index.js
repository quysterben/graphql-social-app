/* eslint-disable react/prop-types */
import { Flex, Heading, Avatar, Text, Button, AvatarBadge } from '@chakra-ui/react';

import { gql, useQuery } from '@apollo/client';
import Loader from '../Loader';
const GET_ALL_FRIENDS = gql`
  query GetAllFriends($input: FriendRelationInput!) {
    getAllFriends(input: $input) {
      id
      user {
        id
        name
        avatar
        isOnline
      }
    }
  }
`;

export default function RightSideBar({ userData }) {
  const { loading, error, data } = useQuery(GET_ALL_FRIENDS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      input: {
        userId: userData.id
      }
    },
    pollInterval: 5000
  });
  if (error) console.log(error);

  return (
    <Flex
      w="18rem"
      bg="white"
      rounded="md"
      p="4"
      h="90vh"
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
          {loading ? (
            <Loader />
          ) : (
            data.getAllFriends.map((friend) => (
              <Flex key={friend.id} alignItems="center">
                <Avatar mx="0.8rem" size="sm" name="test">
                  <AvatarBadge
                    boxSize="1.25em"
                    bg={friend.user.isOnline ? 'green.500' : 'gray.500'}
                  />
                </Avatar>
                <Text fontWeight="bold">{friend.user.name}</Text>
              </Flex>
            ))
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
