/* eslint-disable react/prop-types */
import { useEffect } from 'react';

import { Flex, Text } from '@chakra-ui/react';

import Loader from '../../../Loader';

import { gql, useQuery } from '@apollo/client';
import Notification from './Notification';
const GET_ALL_NOTIFICATIONS_QUERY = gql`
  query GetNotifications {
    getNotifications {
      id
      toNotify {
        name
        avatar
        id
        isOnline
        wallpaper
      }
      triggered {
        name
        avatar
        id
        isOnline
        wallpaper
      }
      eventType
      objectId
      seenByUser
      createdAt
    }
  }
`;

export default function NotificationTooltip({ setNotiCount }) {
  const { loading, error, data } = useQuery(GET_ALL_NOTIFICATIONS_QUERY);
  if (error) console.log(error);

  useEffect(() => {
    if (data) {
      setNotiCount(data.getNotifications.filter((noti) => noti.seenByUser == 0).length);
    }
  }, [data]);

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
          Notifications
        </Text>
      </Flex>
      <hr></hr>
      <Flex flexDirection="column">
        {data.getNotifications.map((request, index) => {
          return <Notification key={index} data={request} />;
        })}
      </Flex>
    </Flex>
  );
}
