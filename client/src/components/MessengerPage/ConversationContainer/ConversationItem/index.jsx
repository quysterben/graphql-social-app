/* eslint-disable react/prop-types */
import { useNavigate, useParams } from 'react-router-dom';

import { Flex, Avatar, Heading, Text } from '@chakra-ui/react';

import conversationImage from '../../../../helpers/conversationImage';
import conversationName from '../../../../helpers/conversationName';
import { BsDot } from 'react-icons/bs';

export default function Conversation({ conversation }) {
  const currUser = JSON.parse(localStorage.getItem('user'));

  const url = useParams();
  const navigate = useNavigate();

  const isSeen = () => {
    if (conversation.lastMessage) {
      const seenBy = conversation.lastMessage.seenBy;
      if (conversation.lastMessage.author.id === currUser.id) return true;
      if (seenBy.length === 0) return false;
      return seenBy.some((user) => user.id === currUser.id);
    }
    return false;
  };

  return (
    <Flex
      w="full"
      p={2}
      gap={4}
      cursor="pointer"
      borderRadius="2xl"
      boxShadow="sm"
      position="relative"
      bg={conversation.id === Number(url.id) ? 'gray.400' : 'white'}
      _hover={{
        bg: 'gray.200'
      }}
      onClick={() => navigate(`/messenger/${conversation.id}`)}>
      <Avatar
        size="md"
        name={conversationName(conversation, currUser)}
        src={conversationImage(conversation, currUser)}
      />
      <Flex flexDir="column" justifyContent="center" gap={2}>
        <Heading size="sm">{conversationName(conversation, currUser)}</Heading>
        {conversation.lastMessage ? (
          <Text fontSize="xs">
            {conversation.lastMessage.author.name}: {conversation.lastMessage.content}
          </Text>
        ) : (
          <Text fontSize="xs">Start a new conversation</Text>
        )}
      </Flex>
      {isSeen() || (
        <Flex
          flex={1}
          w="full"
          justifyContent="right"
          alignItems="center"
          color="blue"
          alignContent="center">
          <BsDot size={24} />
        </Flex>
      )}
    </Flex>
  );
}
