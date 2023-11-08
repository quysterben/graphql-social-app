import { Flex } from '@chakra-ui/react';
import React from 'react';
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
      }
    }
  }
`;

export default function ConservationContainer() {
  const { loading, error, data } = useQuery(GET_CONVERSATIONS);
  if (error) console.log(error);

  return (
    <Flex h="100vh" w="24rem" alignItems="center" flexDir="column" gap={1}>
      <SearchBar />
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
