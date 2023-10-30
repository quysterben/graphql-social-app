/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Flex, Text, Avatar, Box } from '@chakra-ui/react';
import { BsReply } from 'react-icons/bs';
import CommentInput from './CommentInput';

export default function Comment({ data, postId, refetch }) {
  const handleTime = () => {
    const time = moment(data.createdAt).fromNow();
    return time;
  };
  const [isReply, setIsReply] = useState(false);

  const scrollRef = useRef();

  useEffect(() => {
    if (isReply) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [isReply]);

  return (
    <Flex p={2} gap={2} w="100%" flexDirection="column">
      <Flex gap={2}>
        <Link to={'/profile/' + data.author.id}>
          <Avatar size="sm" src={data.author.avatar} name={data.author.name} />
        </Link>
        <Flex flexDirection="column">
          <Text fontSize="smaller" fontWeight="bold">
            {data.author.name}
          </Text>
          <Text fontSize="xx-small" fontStyle="italic">
            {handleTime()}
          </Text>
        </Flex>
      </Flex>
      <Box bg="gray.200" borderRadius="md" position="relative">
        <Text mx={2} p={2}>
          {data.content}
        </Text>
        <Box onClick={() => setIsReply(!isReply)} position="absolute" right={2} top={2}>
          <BsReply />
        </Box>
      </Box>
      <Flex flexDir="column" gap={2}>
        {data.childrenComments.map((child, index) => (
          <Flex ml={6} key={index} flexDir="column" gap={2}>
            <Flex gap={2}>
              <Link to={'/profile/' + child.author.id}>
                <Avatar size="sm" src={child.author.avatar} name={child.author.name} />
              </Link>
              <Flex flexDirection="column">
                <Text fontSize="smaller" fontWeight="bold">
                  {child.author.name}
                </Text>
                <Text fontSize="xx-small" fontStyle="italic">
                  {handleTime()}
                </Text>
              </Flex>
            </Flex>
            <Box bg="gray.100" borderRadius="md">
              <Text mx={2} p={2}>
                {child.content}
              </Text>
            </Box>
          </Flex>
        ))}
        {isReply ? (
          <Box ml={6}>
            <CommentInput
              scrollRef={scrollRef}
              isChild={true}
              postId={postId}
              parentId={data.id}
              refetch={refetch}
            />
          </Box>
        ) : null}
      </Flex>
    </Flex>
  );
}
