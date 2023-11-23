/* eslint-disable react/prop-types */
import { useEffect } from 'react';

import { Flex } from '@chakra-ui/react';
import SearchBar from './SearchBar';
import ConversationItem from './ConversationItem';

import { gql, useQuery } from '@apollo/client';
const GET_CONVERSATIONS = gql`
  query GetAllConversations {
    getAllConversations {
      id
      name
      isGroup
      image
      lastMessage {
        author {
          id
          name
        }
        content
        createdAt
        seenBy {
          user {
            id
            name
            avatar
          }
          seenAt
        }
        type
      }
      members {
        avatar
        name
        id
      }
    }
  }
`;
const CONVERSATION_UPDATED_SUBCRIPTION = gql`
  subscription ConversationUpdated {
    conversationUpdated {
      id
      name
      isGroup
      image
      members {
        name
        id
        avatar
      }
      lastMessage {
        author {
          id
          name
        }
        type
        content
        createdAt
        seenBy {
          user {
            id
            name
            avatar
          }
          seenAt
        }
      }
    }
  }
`;

export default function ConservationContainer({ isTippy, handleSetMessageSeen }) {
  const { loading, data, refetch, subscribeToMore } = useQuery(GET_CONVERSATIONS);

  // Update when conversation created, message received, sent
  useEffect(() => {
    const handleUpdateConversation = () => {
      subscribeToMore({
        document: CONVERSATION_UPDATED_SUBCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!prev.getAllConversations) return prev;
          const prevData = prev.getAllConversations.filter(
            (conversation) => conversation.id !== subscriptionData.data.conversationUpdated.id
          );
          return Object.assign({}, prev, {
            getAllConversations: [subscriptionData.data.conversationUpdated, ...prevData]
          });
        }
      });
    };
    handleUpdateConversation();
  }, []);

  //handleMessengerSeenCount
  useEffect(() => {
    if (data && isTippy) {
      const currUser = JSON.parse(localStorage.getItem('user'));
      const conversations = data.getAllConversations;
      const count = conversations.reduce((acc, conversation) => {
        if (conversation.lastMessage) {
          const seenBy = conversation.lastMessage.seenBy;
          if (conversation.lastMessage.author.id === currUser.id) return acc;
          if (seenBy.length === 0) return acc + 1;
          if (seenBy.some((param) => param.user.id === currUser.id)) return acc;
          return acc + 1;
        }
        return acc;
      }, 0);
      handleSetMessageSeen(count);
    }
  }, [data]);

  return (
    <Flex h={isTippy ? '22rem' : '100vh'} minW="20rem" alignItems="center" flexDir="column" gap={1}>
      {isTippy || <SearchBar refetch={refetch} />}
      <Flex
        w="98%"
        maxH={isTippy ? '100%' : 'full'}
        h="full"
        overflowY="auto"
        bgColor={isTippy ? null : 'white'}
        mb={1}
        p={2}
        boxShadow={isTippy ? null : 'sm'}
        mt={isTippy ? '0.6rem' : '0'}
        borderRadius="xl"
        flexDir="column"
        gap={2}
        css={{
          '&::-webkit-scrollbar': {
            width: '1px'
          },
          '&::-webkit-scrollbar-track': {
            width: '4px'
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#89CFF0',
            borderRadius: 'full'
          }
        }}>
        {loading
          ? null
          : data.getAllConversations.map((conversation, index) => (
              <ConversationItem refetch={refetch} conversation={conversation} key={index} />
            ))}
      </Flex>
    </Flex>
  );
}
