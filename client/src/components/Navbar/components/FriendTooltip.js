/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Avatar, Button, Flex, Text } from '@chakra-ui/react';
import Swal from 'sweetalert2';

import { gql, useQuery, useMutation } from '@apollo/client';

import Loader from '../../Loader';

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

export default function FriendTooltip() {
  const [accept] = useMutation(ACCEPT_FRIEND_REQUEST_MUTATION);
  const [decline] = useMutation(DECLINE_FRIEND_REQUEST_MUTATION);

  const { loading, error, data, refetch } = useQuery(GET_ALL_FRIEND_REQUESTS_QUERY, {
    fetchPolicy: 'cache-and-network'
  });

  if (loading) {
    return <Loader />;
  }

  if (error) console.log(error);

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
    } catch (err) {
      Swal.fire('Failed!', err.message, 'error');
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
      await refetch();
    } catch (err) {
      Swal.fire('Failed!', err.message, 'error');
    }
  };

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
      overflowY="scroll"
      flexDirection="column">
      <Flex alignItems="center" justifyItems="center" mt="0.4rem" mb="1rem">
        <Text ml="0.6rem" fontWeight="medium">
          Friend requests
        </Text>
      </Flex>
      <hr></hr>
      <Flex flexDirection="column">
        {data.getAllFriendRequests.map((request) => {
          return (
            <Flex mt="1rem" p="0.4rem" key={request.id} justifyItems="center" alignItems="center">
              <Avatar size="md" src={request.user.avatar} name={request.user.name} />
              <Flex flexDirection="column" ml="0.6rem">
                <Text fontWeight="bold">{request.user.name}</Text>
                {request.status == 1 ? (
                  <Text mt="0.4" fontSize="0.7rem">
                    Sent you a friend request.
                  </Text>
                ) : null}
              </Flex>
              <Flex flexDirection="column" ml="1rem">
                {request.status == 1 ? (
                  <>
                    {' '}
                    <Button
                      w="5rem"
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleAccept(request.id)}>
                      Accept
                    </Button>
                    <Button
                      mt="0.4rem"
                      w="5rem"
                      size="sm"
                      colorScheme="gray"
                      onClick={() => handleDecline(request.id)}>
                      Decline
                    </Button>
                  </>
                ) : (
                  <Button ml="20" w="5rem" size="sm" colorScheme="green">
                    View
                  </Button>
                )}
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
}
