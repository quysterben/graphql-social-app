/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';

import { Flex } from '@chakra-ui/react';

import Loader from '../../../Loader';
import CurrUserMessage from './CurrUserMessage';
import OtherUserMessage from './OtherUserMessage';

import { gql, useQuery } from '@apollo/client';
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
const MESSAGE_SUBSCRIPTION = gql`
  subscription MessageAdded($conversationId: Int!) {
    messageAdded(conversationId: $conversationId) {
      id
      author {
        id
        name
        avatar
      }
      content
      createdAt
    }
  }
`;

export default function Messages({ conversationInfo }) {
  const currUser = JSON.parse(localStorage.getItem('user'));
  const {
    data: messages,
    loading: messagesLoading,
    subscribeToMore
  } = useQuery(GET_CONVERSATION_MESSAGES, {
    variables: {
      conversationId: conversationInfo.getConversationInfo.id
    }
  });

  const handleUpdateNewMessage = () => {
    subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      variables: { conversationId: conversationInfo.getConversationInfo.id },
      updateQuery: (prev, { subscriptionData }) => {
        return Object.assign({}, prev, {
          getConversationMessages: [
            ...prev.getConversationMessages,
            subscriptionData.data.messageAdded
          ]
        });
      }
    });
  };
  const scrollRef = useRef();
  useEffect(() => {
    handleUpdateNewMessage();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messagesLoading)
    return (
      <Flex flex={1} w="full" bg="white" borderRadius="xl" my={1}>
        <Loader />
      </Flex>
    );

  return (
    <Flex
      flex={1}
      flexDir="column"
      w="full"
      overflowY="auto"
      bg="white"
      borderRadius="xl"
      my={1}
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
      {messages.getConversationMessages.map((message, index) => {
        if (message.author.id === currUser.id) {
          return <CurrUserMessage scrollRef={scrollRef} key={index} message={message} />;
        } else {
          let isNextMsg;
          if (index === 0) isNextMsg = false;
          if (
            index > 0 &&
            messages.getConversationMessages[index - 1].author.id === message.author.id
          ) {
            isNextMsg = true;
          } else {
            isNextMsg = false;
          }
          return (
            <OtherUserMessage
              isNextMsg={isNextMsg}
              scrollRef={scrollRef}
              key={index}
              message={message}
            />
          );
        }
      })}
    </Flex>
  );
}
