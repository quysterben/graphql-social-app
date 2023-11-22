/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';

import { Flex } from '@chakra-ui/react';

import Loader from '../../../Loader';
import CurrUserMessage from './CurrUserMessage';
import OtherUserMessage from './OtherUserMessage';
import NotificationMessage from './NotificationMessage';

import { gql, useQuery, useMutation } from '@apollo/client';
import SeenUserList from './SeenUserList';
const GET_CONVERSATION_MESSAGES = gql`
  query GetConversationMessages($conversationId: Int!) {
    getConversationMessages(conversationId: $conversationId) {
      id
      author {
        id
        name
        avatar
      }
      images {
        imageUrl
        id
      }
      content
      type
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
`;
const MESSAGE_SUBSCRIPTION = gql`
  subscription MessageUpdated($conversationId: Int!) {
    messageUpdated(conversationId: $conversationId) {
      id
      author {
        id
        name
        avatar
      }
      images {
        imageUrl
        id
      }
      content
      type
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
`;
const SEEN_MESSAGE_MUTATION = gql`
  mutation SeenMessage($conversationId: Int!) {
    seenMessage(conversationId: $conversationId) {
      id
      author {
        id
        name
        avatar
      }
      content
      createdAt
      type
      images {
        imageUrl
        id
      }
      seenBy {
        user {
          avatar
          name
          id
        }
        seenAt
      }
    }
  }
`;

export default function Messages({ conversationInfo }) {
  const scrollRef = useRef();
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

  const [seenMessage] = useMutation(SEEN_MESSAGE_MUTATION, {
    variables: {
      conversationId: conversationInfo.getConversationInfo.id
    }
  });
  const handleUpdateMessage = async () => {
    subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      variables: { conversationId: conversationInfo.getConversationInfo.id },
      updateQuery: (prev, { subscriptionData }) => {
        const oldMessage = prev.getConversationMessages.filter(
          (msg) => msg.id !== subscriptionData.data.messageUpdated.id
        );
        return Object.assign({}, prev, {
          getConversationMessages: [...oldMessage, subscriptionData.data.messageUpdated]
        });
      }
    });
  };

  useEffect(() => {
    handleUpdateMessage();
  }, []);

  useEffect(() => {
    const seenMessageHandler = async () => {
      await seenMessage();
    };
    seenMessageHandler();
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
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
        if (message.type) {
          return (
            <NotificationMessage
              scrollRef={scrollRef}
              key={index}
              message={message}
              type={message.type}
            />
          );
        }
        if (message.author.id === currUser.id) {
          return <CurrUserMessage scrollRef={scrollRef} key={index} message={message} />;
        } else {
          let isNextMsg = index === 0 || false;
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
      {messages.getConversationMessages[messages.getConversationMessages.length - 1]?.seenBy !==
        undefined && (
        <SeenUserList
          seenUserList={
            messages.getConversationMessages[messages.getConversationMessages.length - 1].seenBy
          }
        />
      )}
    </Flex>
  );
}
