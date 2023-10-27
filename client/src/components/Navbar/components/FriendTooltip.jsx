/* eslint-disable react/prop-types */
import { Flex, Text } from '@chakra-ui/react';
import Loader from '../../Loader';

import Request from './Request';

import { gql, useQuery, useSubscription } from '@apollo/client';
import { useEffect } from 'react';
const GET_ALL_FRIEND_REQUESTS_QUERY = gql`
  query AllFriendRequest {
    getAllFriendRequests {
      id
      status
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
const FRIEND_REQUESTS_SUBSCRIPTION = gql`
  subscription OnFriendRequestAdded {
    friendRequestAdded {
      status
      id
      user {
        id
        name
      }
    }
  }
`;

export default function FriendTooltip({ setFriendRequestsCount }) {
  const { loading, error, data, refetch, subscribeToMore } = useQuery(
    GET_ALL_FRIEND_REQUESTS_QUERY
  );
  if (error) console.log(error);
  if (data) {
    setFriendRequestsCount(
      data.getAllFriendRequests.filter((request) => request.status == 1).length
    );
  }

  const newFriendRequestSubs = useSubscription(FRIEND_REQUESTS_SUBSCRIPTION);
  if (newFriendRequestSubs.error) console.log(newFriendRequestSubs.error);

  const updateData = () =>
    subscribeToMore({
      document: FRIEND_REQUESTS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev;
        const newFriendRequest = subscriptionData.data.friendRequestAdded;
        setFriendRequestsCount((prev) => prev + 1);
        return Object.assign({}, prev, {
          getAllFriendRequests: [...prev.getAllFriendRequests, newFriendRequest]
        });
      }
    });

  useEffect(() => {
    updateData();
  }, []);

  if (loading) return <Loader />;

  return (
    <Flex
      cursor="default"
      borderRadius="lg"
      boxShadow="md"
      p="0.4rem"
      mt="0.6rem"
      bg="white"
      w="20rem"
      maxH="20rem"
      overflowY="auto"
      flexDirection="column">
      <Flex alignItems="center" justifyItems="center" mt="0.4rem" mb="1rem">
        <Text ml="0.6rem" fontWeight="medium">
          Friend requests
        </Text>
      </Flex>
      <hr></hr>
      <Flex flexDirection="column">
        {data.getAllFriendRequests.map((request, index) => {
          return <Request key={index} data={request} refetch={refetch} />;
        })}
      </Flex>
    </Flex>
  );
}
