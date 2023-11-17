/* eslint-disable react/prop-types */
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

import { Flex, Avatar, Heading, Text } from '@chakra-ui/react';
import { BsDot } from 'react-icons/bs';

import conversationImage from '../../../../helpers/conversationImage';
import conversationName from '../../../../helpers/conversationName';

export default function Conversation({ conversation }) {
  const currUser = JSON.parse(localStorage.getItem('user'));

  const url = useParams();
  const navigate = useNavigate();

  const isSeen = () => {
    if (conversation.lastMessage) {
      const seenBy = conversation.lastMessage.seenBy;
      if (conversation.lastMessage.author.id === currUser.id) return true;
      if (seenBy.length === 0) return false;
      return seenBy.some((param) => param.user.id === currUser.id);
    }
    return false;
  };

  const handleShowLastMsg = () => {
    if (conversation.lastMessage.type === 'changeName') {
      return (
        conversation.lastMessage.content.substring(0, 16) +
        (conversation.lastMessage.content.length > 16 ? '...' : '')
      );
    }

    return (
      conversation.lastMessage.author.name +
      ': ' +
      conversation.lastMessage.content.substring(0, 16) +
      (conversation.lastMessage.content.length > 16 ? '...' : '')
    );
  };

  const handleShowTime = () => {
    const time = moment(conversation.lastMessage.createdAt).format('LT');
    return time.toString();
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
        src={conversationImage(conversation, currUser) && conversationImage(conversation, currUser)}
      />
      <Flex w="full" flexDir="column" justifyContent="center" gap={2}>
        <Heading size="sm">{conversationName(conversation, currUser)}</Heading>
        {conversation.lastMessage ? (
          <Flex justify="space-between">
            <Text fontSize="xs">{handleShowLastMsg()}</Text>
            <Text fontSize="xs">{handleShowTime()}</Text>
          </Flex>
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
