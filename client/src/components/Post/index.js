/* eslint-disable react/prop-types */
import React from 'react';

import { Avatar, Box, Text, Flex, Image, SimpleGrid } from '@chakra-ui/react';

export default function Post({ postData }) {
  console.log(postData);
  return (
    <Box p={4} rounded="lg" w="100%" bg="white">
      <Flex alignItems="center" gap={4} cursor="pointer">
        <Avatar src={postData.author.avatar} name={postData.author.name} />
        <Text fontWeight="bold">{postData.author.name}</Text>
      </Flex>
      <Text w="100%" ml={4} mt={4}>
        {postData.content}
      </Text>
      <SimpleGrid columns={3} gap={2}>
        {postData.images.map((image, index) => (
          <Image boxSize={200} key={index} src={image.imageUrl} alt="" />
        ))}
      </SimpleGrid>
    </Box>
  );
}
