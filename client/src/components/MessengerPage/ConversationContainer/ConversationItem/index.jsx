/* eslint-disable react/prop-types */
import { useNavigate, useParams } from 'react-router-dom';

import { Flex, Avatar, Heading, Text } from '@chakra-ui/react';

import conversationImage from '../../../../helpers/conversationImage';
import conversationName from '../../../../helpers/conversationName';

import { gql, useQuery } from '@apollo/client';
const GET_CONVERSATION_MEMBERS = gql`
  query GetConversationMembers($conversationId: Int) {
    getConversationMembers(conversationId: $conversationId) {
      id
      name
      email
      dateOfBirth
      from
      avatar
      wallpaper
      isOnline
      banned
      role
      createdAt
    }
  }
`;

export default function Conversation({ conversation }) {
  const { loading, error, data } = useQuery(GET_CONVERSATION_MEMBERS, {
    variables: { conversationId: conversation.id }
  });
  if (error) console.log(error);

  const currUser = JSON.parse(localStorage.getItem('user'));

  const url = useParams();
  const navigate = useNavigate();

  return loading ? null : (
    <Flex
      w="full"
      p={2}
      gap={4}
      cursor="pointer"
      borderRadius="2xl"
      boxShadow="sm"
      bg={conversation.id === Number(url.id) ? 'gray.400' : 'white'}
      _hover={{
        bg: 'gray.200'
      }}
      onClick={() => navigate(`/messenger/${conversation.id}`)}>
      <Avatar
        size="md"
        name={conversationName(conversation, data.getConversationMembers, currUser)}
        src={conversationImage(conversation, data.getConversationMembers, currUser)}
      />
      <Flex flexDir="column" justifyContent="center" gap={2}>
        <Heading size="sm">
          {conversationName(conversation, data.getConversationMembers, currUser)}
        </Heading>
        {conversation.lastMessage ? (
          <Text fontSize="xs">
            {conversation.lastMessage.author.name}: {conversation.lastMessage.content}
          </Text>
        ) : (
          <Text fontSize="xs">Start a new conversation</Text>
        )}
      </Flex>
    </Flex>
  );
}
