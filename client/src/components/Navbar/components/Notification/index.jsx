/* eslint-disable react/prop-types */
import { useEffect } from 'react';

import { Flex, Text, Box } from '@chakra-ui/react';
import { FcCheckmark } from 'react-icons/fc';

import Loader from '../../../Loader';

import { gql, useQuery, useMutation } from '@apollo/client';
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
const SEEN_ALL_NOTIFICATIONS_MUTATION = gql`
  mutation SeenAllNotifications {
    seenAllNotifications {
      message
    }
  }
`;
const SEEN_ONE_NOTIFICATION_MUTATION = gql`
  mutation SeenOneNotification($input: NotificationInput!) {
    seenOneNotification(input: $input) {
      message
    }
  }
`;
const NOTIFICATIONS_SUBSCRIPTION = gql`
  subscription NotificationAdded {
    notificationAdded {
      createdAt
      eventType
      id
      objectId
      seenByUser
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
    }
  }
`;

export default function NotificationTooltip({ setNotiCount }) {
  const { loading, error, data, subscribeToMore, refetch } = useQuery(GET_ALL_NOTIFICATIONS_QUERY, {
    fetchPolicy: 'network-only',
    pollInterval: 10000
  });
  if (error) console.log(error);

  const [seenAllNotifications] = useMutation(SEEN_ALL_NOTIFICATIONS_MUTATION);
  const [seenOneNotification] = useMutation(SEEN_ONE_NOTIFICATION_MUTATION);

  const handleSeenAll = async () => {
    try {
      await seenAllNotifications();
      await refetch();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (data) {
      setNotiCount(data.getNotifications.filter((noti) => noti.seenByUser == 0).length);
    }
  }, [data]);

  const updateData = () =>
    subscribeToMore({
      document: NOTIFICATIONS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev;
        const newNotification = subscriptionData.data.notificationAdded;
        const notifications = [newNotification, ...prev.getNotifications];
        const array = notifications.filter((obj, index) => {
          return (
            index ===
            notifications.findIndex(
              (o) =>
                obj.objectId === o.objectId &&
                obj.eventType === o.eventType &&
                obj.triggered.id === o.triggered.id
            )
          );
        });
        setNotiCount(array.length + 1);
        return Object.assign({}, prev, {
          getNotifications: [...array]
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
      <Flex position="relative" alignItems="center" justifyItems="center" mt="0.4rem" mb="1rem">
        <Text ml="0.6rem" fontWeight="medium">
          Notifications
        </Text>
        <Box
          _hover={{
            bg: 'gray.400'
          }}
          position="absolute"
          cursor="pointer"
          right={1}
          p={1}
          borderRadius="full"
          onClick={handleSeenAll}>
          <FcCheckmark />
        </Box>
      </Flex>
      <hr></hr>
      <Flex flexDirection="column">
        {data.getNotifications.map((request, index) => {
          return (
            <Notification
              key={index}
              data={request}
              refetch={refetch}
              seenOneNotification={seenOneNotification}
            />
          );
        })}
      </Flex>
    </Flex>
  );
}
