import { Avatar, Button, Flex, Text, useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Loader from '../../Loader';

import { gql, useQuery, useMutation } from '@apollo/client';
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
  const toast = useToast();

  const [accept] = useMutation(ACCEPT_FRIEND_REQUEST_MUTATION);
  const [decline] = useMutation(DECLINE_FRIEND_REQUEST_MUTATION);

  const { loading, error, data, refetch } = useQuery(GET_ALL_FRIEND_REQUESTS_QUERY, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 30000
  });
  if (error) console.log(error);

  if (loading) {
    return <Loader />;
  }

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
        {data.getAllFriendRequests.map((request) => {
          return (
            <Flex mt="1rem" p="0.4rem" key={request.id} justifyItems="center" alignItems="center">
              <Avatar size="md" src={request.user.avatar} name={request.user.name} />
              <Flex flex={1} flexDirection="column" ml="0.6rem">
                <Text fontWeight="bold">{request.user.name}</Text>
                {request.status == 1 ? (
                  <Text mt="0.4" fontSize="0.7rem">
                    Sent you a friend request.
                  </Text>
                ) : null}
              </Flex>
              <Flex flexDirection="column" ml="">
                {request.status == 1 ? (
                  <>
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
                  <Link to={'/profile/' + request.user.id}>
                    <Button w="5rem" size="sm" colorScheme="green">
                      View
                    </Button>
                  </Link>
                )}
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
}
