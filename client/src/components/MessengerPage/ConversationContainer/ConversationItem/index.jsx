/* eslint-disable react/prop-types */
import { Flex, Avatar, Heading, Text } from '@chakra-ui/react';

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

  const handleGroupName = () => {
    if (conversation.isGroup) {
      return conversation.name;
    }
    const otherMem = data.getConversationMembers.filter((mem) => mem.id !== currUser.id);
    return otherMem[0].name;
  };
  return loading ? null : (
    <Flex
      w="full"
      p={2}
      gap={4}
      cursor="pointer"
      borderRadius="2xl"
      boxShadow="sm"
      _hover={{
        bg: 'gray.200'
      }}>
      <Avatar size="md" name={handleGroupName()} />
      <Flex flexDir="column" justifyContent="center" gap={2}>
        <Heading size="sm">{handleGroupName()}</Heading>
        <Text fontSize="xs">
          {conversation.lastMessage.author.name}: {conversation.lastMessage.content}
        </Text>
      </Flex>
    </Flex>
  );
}
