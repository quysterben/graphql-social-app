import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
          id
          name
          avatar
        }
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
        content
        createdAt
        seenBy {
          id
          name
          avatar
        }
      }
    }
  }
`;

export default function ConservationContainer() {
  const { loading, error, data, refetch, subscribeToMore } = useQuery(GET_CONVERSATIONS);
  if (error) console.log(error);

  // handle route to no id conversation
  const url = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (url.id === undefined && data) {
      navigate(`/messenger/${data.getAllConversations[0].id}`);
    }
  }, [loading, data]);

  // Update when new conversation created
  const handleUpdateNewConversation = () => {
    subscribeToMore({
      document: CONVERSATION_UPDATED_SUBCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        const prevData = prev.getAllConversations.filter(
          (conversation) => conversation.id !== subscriptionData.data.conversationUpdated.id
        );
        return Object.assign({}, prev, {
          getAllConversations: [subscriptionData.data.conversationUpdated, ...prevData]
        });
      }
    });
  };
  useEffect(() => {
    handleUpdateNewConversation();
  }, []);

  return (
    <Flex h="100vh" w="24rem" alignItems="center" flexDir="column" gap={1}>
      <SearchBar refetch={refetch} />
      <Flex
        w="98%"
        maxH="full"
        h="full"
        overflowY="auto"
        bg="white"
        mb={1}
        p={2}
        boxShadow="sm"
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
              <ConversationItem conversation={conversation} key={index} />
            ))}
      </Flex>
    </Flex>
  );
}
