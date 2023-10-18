/* eslint-disable react/prop-types */
import React from 'react';

import { BsCamera } from 'react-icons/bs';

import { Flex, Image, Button, Avatar, Heading } from '@chakra-ui/react';

const defaultWpUrl =
  'https://w0.peakpx.com/wallpaper/868/430/HD-wallpaper-social-networks-blue-background-social-networks-icons-blue-light-globe-global-networks-social-networks-blue-background-social-networks-concepts.jpg';

import { gql, useQuery } from '@apollo/client';
import FriendButton from '../../FriendButton';
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

export default function Header({ infoData, userData }) {
  const { loading, error, data, refetch } = useQuery(GET_FRIEND_STATUS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      input: {
        userId: infoData.getOneUser.id
      }
    }
  });
  if (error) console.log(error);

  return (
    <Flex mt={16} w="100" alignContent="center" justifyContent="center">
      <Flex
        alignItems="center"
        justifyContent="center"
        w="70%"
        h={340}
        overflow="hidden"
        position="relative">
        <Image width="100%" src={infoData.getOneUser.wallpaper || defaultWpUrl} />
        <Flex bottom={4} right={4} position="absolute" gap={4}>
          {loading || infoData.getOneUser.id == userData.id ? null : (
            <FriendButton
              friendStatus={data.getFriendStatus}
              userData={userData}
              refetch={refetch}
            />
          )}
          {userData.id == infoData.getOneUser.id ? (
            <Button size="sm" leftIcon={<BsCamera />}>
              Edit wallpaper
            </Button>
          ) : null}
        </Flex>
        <Flex bottom={4} left={16} gap={4} position="absolute" alignItems="center">
          <Avatar
            cursor="pointer"
            border="4px"
            color="white"
            size="2xl"
            src={infoData.getOneUser.avatar}
            name={infoData.getOneUser.name}
          />
          <Heading mt={12} color="white">
            {infoData.getOneUser.name}
          </Heading>
        </Flex>
      </Flex>
    </Flex>
  );
}
