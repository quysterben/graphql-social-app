/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';

import { Avatar, Button, Flex, Text } from '@chakra-ui/react';

import { gql, useQuery } from '@apollo/client';

import Loader from '../../Loader';

const GET_ALL_FRIEND_REQUESTS_QUERY = gql`
  query GetAllFriendsRequest {
    getAllFriendsRequest {
      id
      user {
        id
        name
        email
        avatar
        wallpaper
      }
    }
  }
`;

export default function FriendTooltip({ userData }) {
  const { loading, error, data } = useQuery(GET_ALL_FRIEND_REQUESTS_QUERY, {
    fetchPolicy: 'cache-and-network'
  });

  if (loading) return <Loader />;
  if (error) console.log(error);

  return (
    <Flex
      cursor="default"
      borderRadius="lg"
      boxShadow="md"
      p="0.4rem"
      mt="0.4rem"
      bg="white"
      w="20rem"
      flexDirection="column">
      <Flex alignItems="center" justifyItems="center" mt="0.4rem" mb="1rem">
        <Text ml="0.6rem" fontWeight="medium">
          Friend requests
        </Text>
      </Flex>
      <hr></hr>
      <Flex>
        {data.getAllFriendsRequest.map((request) => {
          return (
            <Flex p="0.4rem" key={request.id} justifyItems="center" alignItems="center">
              <Avatar size="md" src={request.user.avatar} name={request.user.name} />
              <Flex flexDirection="column" ml="0.6rem">
                <Text fontWeight="bold">{request.user.name}</Text>
                <Text mt="0.4" fontSize="0.7rem">Sent you a friend request.</Text>
              </Flex>
              <Flex flexDirection="column" ml="1rem">
                <Button w="5rem" size="sm" colorScheme="blue">
                  Accept
                </Button>
                <Button mt="0.4rem" w="5rem" size="sm" colorScheme="gray">
                  Decline
                </Button>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
}
