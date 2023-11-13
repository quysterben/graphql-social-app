/* eslint-disable react/prop-types */
import { Flex } from '@chakra-ui/react';

import { gql, useQuery } from '@apollo/client';
import Loader from '../../../Loader';
import CurrUserMessage from './CurrUserMessage';
import OtherUserMessage from './OtherUserMessage';
const GET_CONVERSATION_MESSAGES = gql`
  query GetConversationMessages($conversationId: Int!) {
    getConversationMessages(conversationId: $conversationId) {
      id
      author {
        id
        name
        avatar
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
`;

export default function Messages({ conversationInfo }) {
  const currUser = JSON.parse(localStorage.getItem('user'));
  const { data: messages, loading: messagesLoading } = useQuery(GET_CONVERSATION_MESSAGES, {
    variables: {
      conversationId: conversationInfo.getConversationInfo.id
    }
  });

  if (messagesLoading)
    return (
      <Flex flex={1} w="full" bg="white" borderRadius="xl" my={1}>
        <Loader />
      </Flex>
    );

  return (
    <Flex flex={1} gap={4} flexDir="column" w="full" bg="white" borderRadius="xl" my={1}>
      {messages.getConversationMessages.map((message, index) => {
        if (message.author.id === currUser.id) {
          return <CurrUserMessage key={index} message={message} />;
        } else {
          return <OtherUserMessage key={index} message={message} />;
        }
      })}
    </Flex>
  );
}
