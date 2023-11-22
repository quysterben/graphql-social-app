/* eslint-disable react/prop-types */
import { Flex, Image, SimpleGrid, Text, Tooltip } from '@chakra-ui/react';

import moment from 'moment';

export default function CurrUserMessage({ message, scrollRef }) {
  const getTimeStamp = () => {
    const time = moment(message.createdAt).format('h:mm a DD/MM/YYYY');
    return time.toString();
  };
  console.log(message);

  return (
    <Flex ref={scrollRef} pr={4} pt={1} w="100%" justifyContent="flex-end" alignItems="center">
      <Tooltip label={getTimeStamp()} bg="gray.500" aria-label="A tooltip">
        <Flex alignItems="end" gap={1} flexDir="column" maxW="60%">
          <Text w="fit-content" bg="primary.300" borderRadius="2xl" px={4} py={1}>
            {message.content}
          </Text>
          <SimpleGrid columns={3} spacing={1} justifyItems="flex-end" alignItems="center">
            {message.images.map((image) => {
              return <Image key={image.id} src={image.imageUrl} boxSize="100" borderRadius="2xl" />;
            })}
          </SimpleGrid>
        </Flex>
      </Tooltip>
    </Flex>
  );
}
