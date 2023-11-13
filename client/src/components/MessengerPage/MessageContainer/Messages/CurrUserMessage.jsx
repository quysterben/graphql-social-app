/* eslint-disable react/prop-types */
import { Flex, Text, Tooltip } from '@chakra-ui/react';

import moment from 'moment';

export default function CurrUserMessage({ message }) {
  const getTimeStamp = () => {
    const time = moment(message.createdAt).format('h:mm a DD/MM/YYYY');
    return time.toString();
  };

  return (
    <Flex pr={2} pt={2} w="100%" justifyContent="flex-end" alignItems="center">
      <Tooltip label={getTimeStamp()} bg="gray.500" aria-label="A tooltip">
        <Text bg="primary.300" borderRadius="2xl" px={4} py={1}>
          {message.content}
        </Text>
      </Tooltip>
    </Flex>
  );
}
