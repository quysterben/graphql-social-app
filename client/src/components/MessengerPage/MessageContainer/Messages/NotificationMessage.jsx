/* eslint-disable react/prop-types */
import { Flex, Text, Tooltip } from '@chakra-ui/react';

import moment from 'moment';

export default function NotificationMessage({ message }) {
  const getTimeStamp = () => {
    const time = moment(message.createdAt).format('h:mm a DD/MM/YYYY');
    return time.toString();
  };

  return (
    <Flex pr={4} pt={1} w="100%" justifyContent="center" alignItems="center">
      <Tooltip label={getTimeStamp()} bg="gray.500" aria-label="A tooltip">
        <Text fontStyle="italic" borderRadius="2xl" px={4} py={1}>
          {message.content}
        </Text>
      </Tooltip>
    </Flex>
  );
}
