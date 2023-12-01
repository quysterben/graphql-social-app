/* eslint-disable react/prop-types */
import React from 'react';

import { Button, Flex, useToast } from '@chakra-ui/react';

import {
  AiOutlineUsergroupDelete,
  AiOutlineUsergroupAdd,
  AiOutlineUserSwitch
} from 'react-icons/ai';

import { useMutation, gql } from '@apollo/client';
const SEND_FRIEND_REQUEST = gql`
  mutation SendFriendRequest($input: FriendRelationInput!) {
    sendFriendRequest(input: $input) {
      id
      status
    }
  }
`;
const UN_FRIEND = gql`
  mutation UnFriend($input: FriendRelationInput!) {
    unFriend(input: $input) {
      message
    }
  }
`;

const DECLINED_FRIEND_REQUEST = gql`
  mutation DeclinedFriendRequest($input: FriendshipInput!) {
    declinedFriendRequest(input: $input) {
      message
    }
  }
`;

const ACCEPT_FRIEND_REQUEST_MUTATION = gql`
  mutation AcceptFriendRequest($input: FriendshipInput!) {
    acceptFriendRequest(input: $input) {
      message
    }
  }
`;

export default function FriendButton({ friendStatus, userData, refetch }) {
  const toast = useToast();

  const [unfriend] = useMutation(UN_FRIEND);
  const handleUnfriend = async () => {
    try {
      await unfriend({
        variables: {
          input: {
            userId: friendStatus.user.id
          }
        }
      });
      refetch();
      toast({
        title: 'Unfriend successfully',
        status: 'success',
        isClosable: true,
        position: 'bottom-right'
      });
    } catch (err) {
      toast({
        title: 'Unfriend failed',
        status: 'error',
        isClosable: true,
        position: 'bottom-right'
      });
    }
  };

  const [declinedFriendRequest] = useMutation(DECLINED_FRIEND_REQUEST);
  const handleDeclinedFriendRequest = async () => {
    try {
      await declinedFriendRequest({
        variables: {
          input: {
            friendshipId: friendStatus.id
          }
        }
      });
      refetch();
      toast({
        title: 'Declined friend request successfully',
        status: 'success',
        isClosable: true,
        position: 'bottom-right'
      });
    } catch (err) {
      toast({
        title: 'Declined friend request failed',
        status: 'error',
        isClosable: true,
        position: 'bottom-right'
      });
    }
  };
  const handleUnsendFriendRequest = async () => {
    try {
      await declinedFriendRequest({
        variables: {
          input: {
            friendshipId: friendStatus.id
          }
        }
      });
      refetch();
      toast({
        title: 'Unsent friend request successfully',
        status: 'success',
        isClosable: true,
        position: 'bottom-right'
      });
    } catch (err) {
      toast({
        title: 'Unsent friend request failed',
        status: 'error',
        isClosable: true,
        position: 'bottom-right'
      });
    }
  };

  const [acceptFriendRequest] = useMutation(ACCEPT_FRIEND_REQUEST_MUTATION);
  const handleAcceptFriendRequest = async () => {
    try {
      await acceptFriendRequest({
        variables: {
          input: {
            friendshipId: friendStatus.id
          }
        }
      });
      refetch();
      toast({
        title: 'Accepted friend request',
        status: 'success',
        isClosable: true,
        position: 'bottom-right'
      });
    } catch (err) {
      toast({
        title: 'Accepted friend request failed',
        status: 'error',
        isClosable: true,
        position: 'bottom-right'
      });
    }
  };

  const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST);
  const handleSendFriendRequest = async () => {
    try {
      await sendFriendRequest({
        variables: {
          input: {
            userId: friendStatus.user.id
          }
        }
      });
      refetch();
      toast({
        title: 'Sent friend request',
        status: 'success',
        isClosable: true,
        position: 'bottom-right'
      });
    } catch (err) {
      toast({
        title: 'Sent friend request failed',
        status: 'error',
        isClosable: true,
        position: 'bottom-right'
      });
    }
  };

  if (friendStatus.status === 'none') {
    return (
      <Button onClick={handleSendFriendRequest} size="sm" leftIcon={<AiOutlineUsergroupAdd />}>
        Add friend
      </Button>
    );
  }

  if (friendStatus.status === 'pending' && friendStatus.from !== userData.id) {
    return (
      <Flex gap={4}>
        <Button onClick={handleAcceptFriendRequest} size="sm" leftIcon={<AiOutlineUsergroupAdd />}>
          Accept
        </Button>
        <Button
          onClick={handleDeclinedFriendRequest}
          size="sm"
          leftIcon={<AiOutlineUsergroupDelete />}>
          Declined
        </Button>
      </Flex>
    );
  }

  if (friendStatus.status === 'pending' && friendStatus.from === userData.id) {
    return (
      <Button onClick={handleUnsendFriendRequest} size="sm" leftIcon={<AiOutlineUserSwitch />}>
        Unsending
      </Button>
    );
  }

  if (friendStatus.status === 'friend') {
    return (
      <Button onClick={handleUnfriend} size="sm" leftIcon={<AiOutlineUsergroupDelete />}>
        Unfriend
      </Button>
    );
  }
}
