/* eslint-disable react/prop-types */
import React from 'react';

import { Avatar, Button, Flex, Text, useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import { gql, useMutation } from '@apollo/client';
const ACCEPT_FRIEND_REQUEST_MUTATION = gql`
  mutation AcceptFriendRequest($input: FriendshipInput!) {
    acceptFriendRequest(input: $input) {
      message
    }
  }
`;
const DECLINE_FRIEND_REQUEST_MUTATION = gql`
  mutation DeclinedFriendRequest($input: FriendshipInput!) {
    declinedFriendRequest(input: $input) {
      message
    }
  }
`;

export default function Request({ data, refetch }) {
  const toast = useToast();

  const [accept] = useMutation(ACCEPT_FRIEND_REQUEST_MUTATION);
  const [decline] = useMutation(DECLINE_FRIEND_REQUEST_MUTATION);

  const handleAccept = async (friendshipId) => {
    try {
      await accept({
        variables: {
          input: {
            friendshipId: friendshipId
          }
        }
      });
      await refetch();
      toast({
        title: 'Accepted friend request!',
        status: 'success',
        position: 'bottom-right',
        isClosable: true
      });
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        position: 'bottom-right',
        isClosable: true
      });
    }
  };

  const handleDecline = async (friendshipId) => {
    try {
      await decline({
        variables: {
          input: {
            friendshipId: friendshipId
          }
        }
      });
      toast({
        title: 'Declined friend request!',
        status: 'success',
        position: 'bottom-right',
        isClosable: true
      });
      await refetch();
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        position: 'bottom-right',
        isClosable: true
      });
    }
  };

  return (
    <Flex mt="1rem" p="0.4rem" justifyItems="center" alignItems="center">
      <Avatar size="md" src={data.user.avatar} name={data.user.name} />
      <Flex flex={1} flexDirection="column" ml="0.6rem">
        <Text fontWeight="bold">{data.user.name}</Text>
        {data.status == 1 ? (
          <Text mt="0.4" fontSize="0.7rem">
            Sent you a friend request.
          </Text>
        ) : null}
      </Flex>
      <Flex flexDirection="column" ml="">
        {data.status == 1 ? (
          <>
            <Button w="5rem" size="sm" colorScheme="blue" onClick={() => handleAccept(data.id)}>
              Accept
            </Button>
            <Button
              mt="0.4rem"
              w="5rem"
              size="sm"
              colorScheme="gray"
              onClick={() => handleDecline(data.id)}>
              Decline
            </Button>
          </>
        ) : (
          <Link to={'/profile/' + data.user.id}>
            <Button w="5rem" size="sm" colorScheme="green">
              View
            </Button>
          </Link>
        )}
      </Flex>
    </Flex>
  );
}
