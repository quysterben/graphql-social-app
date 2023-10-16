/* eslint-disable react/prop-types */
import moment from 'moment';

import { Avatar, Box, Text, Flex, Image, SimpleGrid } from '@chakra-ui/react';

export default function Post({ postData }) {
  const handleTime = () => {
    const time = moment(postData.createdAt).fromNow();
    return time;
  };
  return (
    <Box p={4} rounded="lg" w="100%" bg="white">
      <Flex alignItems="center" gap={4} cursor="pointer">
        <Avatar src={postData.author.avatar} name={postData.author.name} />
        <Flex flexDirection="column">
          <Text fontWeight="bold">{postData.author.name}</Text>
          <Text fontSize="smaller" fontStyle="italic">
            {handleTime()}
          </Text>
        </Flex>
      </Flex>
      <Text w="100%" ml={4} my={4}>
        {postData.content}
      </Text>
      <SimpleGrid columns={2} gap={2}>
        {postData.images.map((image, index) => (
          <Image boxSize={'full'} key={index} src={image.imageUrl} alt="" />
        ))}
      </SimpleGrid>
    </Box>
  );
}
