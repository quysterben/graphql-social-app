/* eslint-disable react/prop-types */
import { Flex, Text, Tooltip } from '@chakra-ui/react';

import moment from 'moment';

export default function CurrUserMessage({ message, scrollRef }) {
  const getTimeStamp = () => {
    const time = moment(message.createdAt).format('h:mm a DD/MM/YYYY');
    return time.toString();
  };

  return (
    <Flex ref={scrollRef} pr={4} pt={1} w="100%" justifyContent="flex-end" alignItems="center">
      <Tooltip label={getTimeStamp()} bg="gray.500" aria-label="A tooltip">
        <Text bg="primary.300" borderRadius="2xl" px={4} py={1}>
          {message.content}
        </Text>
      </Tooltip>
    </Flex>
  );
}
