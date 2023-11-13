/* eslint-disable react/prop-types */
import { Avatar, Flex, Text, Tooltip } from '@chakra-ui/react';

import moment from 'moment';

export default function OtherUserMessage({ message }) {
  const getTimeStamp = () => {
    const time = moment(message.createdAt).format('h:mm a DD/MM/YYYY');
    return time.toString();
  };

  return (
    <Flex ml={4} w="100%" gap={2} justifyContent="start" alignItems="center">
      <Avatar alignSelf="end" size="sm" name={message.author.name} src={message.author.Avatar} />
      <Flex gap={1} flexDir="column">
        <Text fontSize="sm" fontWeight="normal">
          {message.author.name}
        </Text>
        <Tooltip label={getTimeStamp()} bg="gray.500" aria-label="A tooltip">
          <Text bg="primary.300" borderRadius="2xl" px={4} py={1}>
            {message.content}
          </Text>
        </Tooltip>
      </Flex>
    </Flex>
  );
}
