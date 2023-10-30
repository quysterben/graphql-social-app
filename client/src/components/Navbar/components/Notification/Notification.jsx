/* eslint-disable react/prop-types */
import React from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { Flex, Avatar, Text, Box, AvatarBadge } from '@chakra-ui/react';

import { AiFillHeart, AiOutlineComment, AiOutlinePicRight } from 'react-icons/ai';

import moment from 'moment';

export default function Notification({ data, refetch, seenOneNotification }) {
  const navigate = useNavigate();

  const handleTime = () => {
    const time = moment(data.createdAt).fromNow();
    return time;
  };

  const handleMessage = () => {
    if (data.eventType == 'like') return 'liked your post.';
    if (data.eventType == 'comment') return 'commented on your post.';
    if (data.eventType == 'post') return 'created a new post.';
    if (data.eventType == 'reply') return 'replied to your comment.';
  };

  const handleNavigate = async () => {
    await seenOneNotification({ variables: { input: { notificationId: data.id } } });
    refetch();
    if (data.eventType == 'like') navigate('/post/' + data.objectId);
    if (data.eventType == 'comment') navigate('/post/' + data.objectId);
    if (data.eventType == 'post') navigate('/post/' + data.objectId);
    if (data.eventType == 'reply') navigate('/post/' + data.objectId);
  };

  const handleBadge = () => {
    if (data.eventType == 'like')
      return (
        <Box color="pink.400">
          <AiFillHeart size={12} />
        </Box>
      );
    if (data.eventType == 'comment' || data.eventType == 'reply')
      return (
        <Box color="primary.600">
          <AiOutlineComment size={12} />
        </Box>
      );
    if (data.eventType == 'post')
      return (
        <Box color="primary.600">
          <AiOutlinePicRight size={12} />
        </Box>
      );
  };

  return (
    <Flex
      borderRadius="lg"
      bg={data.seenByUser ? null : 'gray.200'}
      mt="0.4rem"
      p="0.6rem"
      cursor="pointer"
      justifyItems="center"
      onClick={handleNavigate}
      alignItems="center">
      <Flex gap={2}>
        <Link to={'/profile/' + data.triggered.id}>
          <Avatar size="sm" src={data.triggered.avatar} name={data.triggered.name}>
            <AvatarBadge bg="white">{handleBadge()}</AvatarBadge>
          </Avatar>
        </Link>
        <Flex flexDirection="column">
          <Box>
            <Text display="inline-block" mr={1} fontSize="normal" fontWeight="bold">
              {data.triggered.name + ' '}{' '}
            </Text>
            <Text display="inline-block" fontWeight="normal">
              {handleMessage()}
            </Text>
          </Box>
          <Text fontSize="xx-small" fontStyle="italic">
            {handleTime()}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
