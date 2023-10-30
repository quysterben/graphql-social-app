/* eslint-disable react/prop-types */
import React from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { Flex, Avatar, Text, Box } from '@chakra-ui/react';

import moment from 'moment';

export default function Notification({ data }) {
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

  const handleNavigate = () => {
    if (data.eventType == 'like') navigate('/post/' + data.objectId);
    if (data.eventType == 'comment') navigate('/post/' + data.objectId);
    if (data.eventType == 'post') navigate('/post/' + data.objectId);
    if (data.eventType == 'reply') navigate('/post/' + data.objectId);
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
          <Avatar size="sm" src={data.triggered.avatar} name={data.triggered.name} />
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
