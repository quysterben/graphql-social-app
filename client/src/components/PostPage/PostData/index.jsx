/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Flex, Text, Avatar, Box } from '@chakra-ui/react';
import { AiFillHeart, AiOutlineComment } from 'react-icons/ai';
import Comment from '../Comment';
import CommentInput from '../Comment/CommentInput';

import { gql, useQuery, useMutation } from '@apollo/client';
const GET_SINGLE_POST = gql`
  query GetSinglePost($input: SinglePostInput!) {
    getSinglePost(input: $input) {
      id
      content
      author {
        id
        name
        email
        dateOfBirth
        from
        avatar
        wallpaper
        createdAt
      }
      comments {
        id
        content
        author {
          id
          name
          avatar
        }
        childrenComments {
          author {
            avatar
            id
            name
          }
          content
          createdAt
          id
        }
        parentId
        createdAt
      }
      likes {
        id
        postId
        user {
          id
          name
          avatar
        }
        createdAt
      }
      createdAt
    }
  }
`;
const LIKE_POST_MUTATION = gql`
  mutation LikePost($input: LikePostInput!) {
    likePost(input: $input) {
      id
      postId
    }
  }
`;

export default function PostData({ postId }) {
  const handleTime = () => {
    const time = moment(data.getSinglePost.createdAt).fromNow();
    return time;
  };

  const [userData, setUserData] = useState({});
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserData(user);
  }, []);

  const { loading, error, data, refetch } = useQuery(GET_SINGLE_POST, {
    variables: { input: { postId: postId } }
  });
  if (error) console.log(error);

  const [liked, setLiked] = useState();
  useEffect(() => {
    if (loading) return;
    const found = data.getSinglePost.likes.find((like) => like.user.id === userData.id);
    if (found) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [data]);
  const [likePost] = useMutation(LIKE_POST_MUTATION);

  const handleLikePost = async () => {
    try {
      await likePost({
        variables: {
          input: {
            postId: postId
          }
        }
      });
      setLiked(!liked);
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  return loading ? null : (
    <Flex w={'full'} flexDirection="column" bg="white" position="relative" h="100vh">
      <Flex flexDirection="column" maxHeight="92vh" overflowY="auto" position="relative">
        <Flex p={4} mt={16} gap={4}>
          <Link to={'/profile/' + data.getSinglePost.author.id}>
            <Avatar src={data.getSinglePost.author.avatar} name={data.getSinglePost.author.name} />
          </Link>
          <Flex flexDirection="column">
            <Text fontWeight="bold">{data.getSinglePost.author.name}</Text>
            <Text fontSize="smaller" fontStyle="italic">
              {handleTime()}
            </Text>
          </Flex>
        </Flex>
        <Text mx={6} mb={4}>
          {data.getSinglePost.content}
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
            <Box
              cursor="pointer"
              color={liked ? 'pink.400' : 'gray.600'}
              _hover={{ color: 'pink.400', transition: '0.4s ease-out' }}>
              <AiFillHeart size={28} onClick={() => handleLikePost()} />
            </Box>
            <Text ml={2} fontSize="large">
              {data.getSinglePost.likes.length}
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
              {data.getSinglePost.comments.reduce(
                (sum, cmt) => sum + cmt.childrenComments.length + 1,
                0
              )}
            </Text>
          </Flex>
        </Flex>
        <Flex flexDir="column">
          {data.getSinglePost.comments.map((cmt, index) => (
            <Comment key={index} data={cmt} postId={data.getSinglePost.id} refetch={refetch} />
          ))}
        </Flex>
      </Flex>
      <Box pos="absolute" bottom={0} w="full" bg="white">
        <CommentInput postId={data.getSinglePost.id} refetch={refetch} />
      </Box>
    </Flex>
  );
}
