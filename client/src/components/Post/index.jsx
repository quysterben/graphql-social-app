/* eslint-disable react/prop-types */
import moment from 'moment';
import Tippy from '@tippyjs/react';
import { Link } from 'react-router-dom';

import { Avatar, Box, Text, Flex, Image, SimpleGrid } from '@chakra-ui/react';

import { AiFillHeart, AiOutlineComment } from 'react-icons/ai';

import { useMutation, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import UserTooltip from '../UserTooltip';

const LIKE_POST_MUTATION = gql`
  mutation LikePost($input: LikePostInput!) {
    likePost(input: $input) {
      id
      postId
    }
  }
`;

export default function Post({ postData, userData }) {
  const [liked, setLiked] = useState();
  const handleTime = () => {
    const time = moment(postData.createdAt).fromNow();
    return time;
  };

  useEffect(() => {
    const found = postData.likes.find((like) => like.user.id === userData.id);
    if (found) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, []);

  const [likePost] = useMutation(LIKE_POST_MUTATION);

  const handleLikePost = async () => {
    try {
      await likePost({
        variables: {
          input: {
            postId: postData.id
          }
        }
      });
      if (liked === false) {
        postData.likes.length += 1;
      } else {
        postData.likes.length -= 1;
      }
      setLiked(!liked);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box rounded="lg" w="100%" bg="white">
      <Flex p={4} alignItems="center" gap={4} cursor="pointer">
        <Tippy placement="top-start" content={<UserTooltip />} interactive={true}>
          <Link to={'/profile/' + postData.author.id}>
            <Avatar src={postData.author.avatar} name={postData.author.name} />
          </Link>
        </Tippy>
        <Flex flexDirection="column">
          <Text fontWeight="bold">{postData.author.name}</Text>
          <Text fontSize="smaller" fontStyle="italic">
            {handleTime()}
          </Text>
        </Flex>
      </Flex>
      <Text mx={6} mb={4}>
        {postData.content}
      </Text>
      <SimpleGrid px={1} columns={postData.images.length === 1 ? 1 : 2}>
        {postData.images.map((image, index, data) =>
          index < 4 ? (
            <Link to={'/post/' + postData.id} key={index}>
              <Box cursor="pointer" position="relative">
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
            </Link>
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
            color={liked ? 'pink.400' : 'gray.600'}
            _hover={{ color: 'pink.400', transition: '0.4s ease-out' }}>
            <AiFillHeart size={28} onClick={() => handleLikePost()} />
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
            <Link to={'/post/' + postData.id}>
              <AiOutlineComment size={28} />
            </Link>
          </Box>
          <Text ml={2} fontSize="large">
            {postData.comments.reduce((sum, cmt) => sum + cmt.childrenComments.length + 1, 0)}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}
