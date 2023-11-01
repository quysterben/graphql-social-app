/* eslint-disable react/prop-types */
import React from 'react';

import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { BiSolidMap } from 'react-icons/bi';
import { FaBirthdayCake } from 'react-icons/fa';

import { Link } from 'react-router-dom';

import { gql, useQuery } from '@apollo/client';
import FriendButton from '../FriendButton';
const GET_FRIEND_STATUS = gql`
  query GetFriendStatus($input: FriendRelationInput!) {
    getFriendStatus(input: $input) {
      id
      status
      from
      user {
        id
        name
        email
        dateOfBirth
        from
        avatar
        wallpaper
        createdAt
      }
    }
  }
`;

export default function User({ userData, currentUserData }) {
  const {
    data: friendStatusData,
    loading,
    refetch
  } = useQuery(GET_FRIEND_STATUS, {
    variables: {
      input: {
        userId: userData.id
      }
    }
  });

  return (
    <Flex
      rounded="lg"
      minH={32}
      w="100%"
      bg="white"
      cursor="pointer"
      p={4}
      gap={4}
      position="relative">
      <Link to={'/profile/' + userData.id}>
        <Avatar size="md" src={userData.avatar} name={userData.name} />
      </Link>
      <Flex flexDirection="column" gap={2}>
        <Text fontWeight="bold" color="primary.800">
          {userData.name}
        </Text>
        {userData.dateOfBirth ? (
          <Flex ml={2} gap={1} color="orange">
            <FaBirthdayCake />
            <Text fontSize="sm" color="black">
              {userData.dateOfBirth}
            </Text>
          </Flex>
        ) : null}
        {userData.from ? (
          <Flex ml={2} gap={1} color="red">
            <BiSolidMap />
            <Text fontSize="sm" color="black">
              {userData.from}
            </Text>
          </Flex>
        ) : null}
      </Flex>
      {loading ? null : (
        <Box position="absolute" top={4} right={2}>
          <FriendButton
            friendStatus={friendStatusData.getFriendStatus}
            refetch={refetch}
            userData={currentUserData}
          />
        </Box>
      )}
    </Flex>
  );
}
