/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Flex, Text, Avatar, Box } from '@chakra-ui/react';
import { AiFillHeart, AiOutlineComment } from 'react-icons/ai';
import Comment from '../../Comment';
import CommentInput from '../../Comment/CommentInput';

export default function PostData({ data, refetch }) {
  const handleTime = () => {
    const time = moment(data.createdAt).fromNow();
    return time;
  };
  return (
    <Flex w="30%" flexDirection="column">
      <Flex flexDirection="column" maxHeight="92vh" overflowY="auto" position="relative">
        <Flex p={4} mt={16} gap={4}>
          <Link to={'/profile/' + data.author.id}>
            <Avatar src={data.author.avatar} name={data.author.name} />
          </Link>
          <Flex flexDirection="column">
            <Text fontWeight="bold">{data.author.name}</Text>
            <Text fontSize="smaller" fontStyle="italic">
              {handleTime()}
            </Text>
          </Flex>
        </Flex>
        <Text mx={6} mb={4}>
          {data.content}
        </Text>
        <Flex
          py={4}
          w="100%"
          borderY="1px"
          borderColor="gray.400"
          mt={8}
          alignItems="center"
          justifyItems="center">
          <Flex justifyContent="center" alignItems="center" w="50%">
            <Box cursor="pointer" _hover={{ color: 'pink.400', transition: '0.4s ease-out' }}>
              <AiFillHeart size={28} />
            </Box>
            <Text ml={2} fontSize="large">
              {data.likes.length}
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
              {data.comments.reduce((sum, cmt) => sum + cmt.childrenComments.length + 1, 0)}
            </Text>
          </Flex>
        </Flex>
        <Flex flexDir="column">
          {data.comments.map((cmt, index) => (
            <Comment key={index} data={cmt} postId={data.id} refetch={refetch} />
          ))}
        </Flex>
      </Flex>
      <Box pos="absolute" bottom={0} w="30%" bg="white">
        <CommentInput postId={data.id} refetch={refetch} />
      </Box>
    </Flex>
  );
}
