/* eslint-disable react/prop-types */
import { Avatar, Flex, Text, Tooltip, Image } from '@chakra-ui/react';

import moment from 'moment';

export default function OtherUserMessage({ message, scrollRef, isNextMsg }) {
  const getTimeStamp = () => {
    const time = moment(message.createdAt).format('h:mm a DD/MM/YYYY');
    return time.toString();
  };

  return (
    <Flex ref={scrollRef} mt={1} pl={4} w="100%" gap={2} justifyContent="start" alignItems="center">
      {isNextMsg === true ? (
        <Flex w="8" />
      ) : (
        <Avatar alignSelf="end" size="sm" name={message.author.name} src={message.author.avatar} />
      )}
      <Flex maxW="60%" gap={1} flexDir="column">
        {isNextMsg === true ? null : (
          <Text fontSize="sm" fontWeight="normal">
            {message.author.name}
          </Text>
        )}
        <Flex gap={1} flexDir="column">
          <Tooltip label={getTimeStamp()} bg="gray.500" aria-label="A tooltip">
            <Text w="fit-content" bg="gray.200" borderRadius="2xl" px={4} py={1}>
              {message.content}
            </Text>
          </Tooltip>
          {message.images.map((image) => {
            return (
              <Tooltip
                key={image.id}
                placement="right"
                label={getTimeStamp()}
                bg="gray.500"
                aria-label="A tooltip">
                <Image
                  w="fit-content"
                  loading="lazy"
                  maxBlockSize={300}
                  src={image.imageUrl}
                  borderRadius="2xl"
                />
              </Tooltip>
            );
          })}
        </Flex>
      </Flex>
    </Flex>
  );
}
