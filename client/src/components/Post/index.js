/* eslint-disable react/prop-types */
import moment from 'moment';

import { Avatar, Box, Text, Flex, Image, SimpleGrid } from '@chakra-ui/react';

import { AiFillHeart, AiOutlineComment } from 'react-icons/ai';

export default function Post({ postData, userData }) {
  const handleTime = () => {
    const time = moment(postData.createdAt).fromNow();
    return time;
  };
  const isLiked = () => {
    const found = postData.likes.find((like) => like.user.id === userData.id);
    if (found) return true;
    return false;
  };
  return (
    <Box rounded="lg" w="100%" bg="white">
      <Flex p={4} alignItems="center" gap={4} cursor="pointer">
        <Avatar src={postData.author.avatar} name={postData.author.name} />
        <Flex flexDirection="column">
          <Text fontWeight="bold">{postData.author.name}</Text>
          <Text fontSize="smaller" fontStyle="italic">
            {handleTime()}
          </Text>
        </Flex>
      </Flex>
      <Text mx={6} my={4}>
        {postData.content}
      </Text>
      <SimpleGrid px={1} columns={postData.images.length === 1 ? 1 : 2} gap={2}>
        {postData.images.map((image, index, data) =>
          index < 4 ? (
            <Box cursor="pointer" key={index} position="relative">
              <Image
                opacity={index === 3 && data.length > 4 ? '0.2' : '1'}
                boxSize={'full'}
                src={image.imageUrl}
                alt=""
              />
              <Text fontSize="7xl" right="30%" top="25%" position="absolute">
                {index === 3 && data.length > 4 ? `+${data.length - 4}` : null}
              </Text>
            </Box>
          ) : null
        )}
      </SimpleGrid>
      <Flex
        py={4}
        w="100%"
        borderTop="1px"
        borderColor="gray.400"
        mt={8}
        alignItems="center"
        justifyItems="center">
        <Flex justifyContent="center" alignItems="center" w="50%">
          <Box
            cursor="pointer"
            color={isLiked() ? 'pink.400' : 'gray.600'}
            _hover={{ color: 'pink.400', transition: '0.4s ease-out' }}>
            <AiFillHeart size={28} />
          </Box>
          <Text ml={2} fontSize="large">
            {postData.likes.length}
          </Text>
        </Flex>
        <Flex justifyContent="center" alignItems="center" color="gray.600" w="50%">
          <Box
            cursor="pointer"
            _hover={{ color: 'primary.600', transition: '0.4s ease-out' }}
            color="gray.600">
            <AiOutlineComment size={28} />
          </Box>
          <Text ml={2} fontSize="large">
            {postData.comments.length}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}
