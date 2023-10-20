/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Flex, Heading, SimpleGrid, Text, Avatar } from '@chakra-ui/react';

import { BiSolidMap } from 'react-icons/bi';
import { FaBirthdayCake } from 'react-icons/fa';
import { BsFillCalendarDateFill } from 'react-icons/bs';

import { gql, useQuery } from '@apollo/client';
import Loader from '../../Loader';
import EditProfile from '../EditProfile';
const GET_ALL_FRIENDS = gql`
  query GetAllFriends($input: FriendRelationInput!) {
    getAllFriends(input: $input) {
      id
      user {
        id
        name
        avatar
      }
    }
  }
`;

export default function LeftBar({ userData, infoData, updateUserStorageData, refetch }) {
  const handleTime = (time) => {
    const date = moment(time).format('DD/MM/YYYY');
    return date;
  };

  const { loading, error, data } = useQuery(GET_ALL_FRIENDS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      input: {
        userId: infoData.getOneUser.id
      }
    }
  });
  if (error) console.log(error);

  return (
    <Flex w="30%" flexDir="column" gap={4}>
      <Flex
        w="100%"
        bg={'white'}
        borderRadius="md"
        p={4}
        flexDirection="column"
        position="relative">
        <Heading size="md">Info</Heading>
        {infoData.getOneUser.from ? (
          <Flex ml={4} gap={2} alignItems="center" color="primary.600" mt={4}>
            <BiSolidMap />
            <Text color="black">{infoData.getOneUser.from}</Text>
          </Flex>
        ) : null}
        {infoData.getOneUser.dateOfBirth ? (
          <Flex ml={4} gap={2} alignItems="center" color="primary.600" mt={4}>
            <FaBirthdayCake />
            <Text color="black">{infoData.getOneUser.dateOfBirth}</Text>
          </Flex>
        ) : null}
        {infoData.getOneUser.createdAt ? (
          <Flex ml={4} gap={2} alignItems="center" color="primary.600" mt={4}>
            <BsFillCalendarDateFill />
            <Text color="black">Joined {handleTime(infoData.getOneUser.createdAt)}</Text>
          </Flex>
        ) : null}
        {userData.id == infoData.getOneUser.id ? (
          <EditProfile
            infoData={infoData.getOneUser}
            updateUserStorageData={updateUserStorageData}
            refetch={refetch}
          />
        ) : null}
      </Flex>
      <Flex w="100%" bg={'white'} borderRadius="md" p={4} flexDirection="column">
        <Heading size="md">Friends</Heading>
        {loading ? (
          <Loader />
        ) : (
          <SimpleGrid mt={4} columns={3} gap={8}>
            {data.getAllFriends.map((friend, index) => (
              <Link key={index} to={'/profile/' + friend.user.id}>
                <Flex flexDirection="column" alignItems="center" gap={1}>
                  <Avatar
                    borderRadius={12}
                    boxSize="80px"
                    src={friend.user.avatar}
                    name={friend.user.name}
                  />
                  <Text fontWeight="medium">{friend.user.name}</Text>
                </Flex>
              </Link>
            ))}
          </SimpleGrid>
        )}
      </Flex>
    </Flex>
  );
}
