/* eslint-disable react/prop-types */
import { Flex, Image, Text, Tooltip } from '@chakra-ui/react';

import moment from 'moment';

export default function CurrUserMessage({ message }) {
  const getTimeStamp = () => {
    const time = moment(message.createdAt).format('h:mm a DD/MM/YYYY');
    return time.toString();
  };

  return (
    <Flex pr={4} pt={1} w="100%" justifyContent="flex-end" alignItems="center">
      <Flex alignItems="end" gap={1} flexDir="column" maxW="60%">
        <Tooltip placement="left-start" label={getTimeStamp()} bg="gray.500" aria-label="A tooltip">
          <Text w="fit-content" bg="primary.300" borderRadius="2xl" px={4} py={1}>
            {message.content}
          </Text>
        </Tooltip>
        {message.images.map((image) => {
          return (
            <Tooltip
              loading="lazy"
              key={image.id}
              placement="left"
              label={getTimeStamp()}
              bg="gray.500"
              aria-label="A tooltip">
              <Image w="fit-content" maxBlockSize={300} src={image.imageUrl} borderRadius="2xl" />
            </Tooltip>
          );
        })}
      </Flex>
    </Flex>
  );
}
