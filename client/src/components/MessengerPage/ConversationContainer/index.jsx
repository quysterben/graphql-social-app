import { Flex } from '@chakra-ui/react';
import React from 'react';
import SearchBar from './SearchBar';
import ConservationItem from './ConversationItem';

export default function ConservationContainer() {
  return (
    <Flex h="100vh" w="24rem" alignItems="center" flexDir="column" gap={1}>
      <SearchBar />
      <Flex
        w="98%"
        maxH="full"
        h="full"
        overflowY="auto"
        bg="white"
        mb={1}
        p={2}
        boxShadow="sm"
        borderRadius="xl"
        flexDir="column"
        gap={2}
        css={{
          '&::-webkit-scrollbar': {
            width: '1px'
          },
          '&::-webkit-scrollbar-track': {
            width: '4px'
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#89CFF0',
            borderRadius: 'full'
          }
        }}>
        <ConservationItem />
        <ConservationItem />
      </Flex>
    </Flex>
  );
}
