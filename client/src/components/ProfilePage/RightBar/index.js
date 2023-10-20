/* eslint-disable react/prop-types */
import React from 'react';

import { Flex } from '@chakra-ui/react';

import CreatePost from '../../CreatePost';
import Loader from '../../Loader';
import Post from '../../Post';

import { gql, useQuery } from '@apollo/client';
const GET_POSTS_OF_USER = gql`
  query GetPostsOfUser($input: GetPostsOfUserInput!) {
    getPostsOfUser(input: $input) {
      id
      content
      author {
        id
        name
        avatar
      }
      likes {
        id
        postId
        user {
          id
          name
          email
          avatar
          wallpaper
        }
        createdAt
      }
      comments {
        id
      }
      createdAt
      images {
        id
        imageUrl
      }
    }
  }
`;

export default function RightBar({ userData, userId }) {
  const { loading, error, data, refetch } = useQuery(GET_POSTS_OF_USER, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 30000,
    variables: {
      input: {
        userId: Number(userId)
      }
    }
  });
  if (error) console.log(error);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Flex w="70%" flexDirection="column">
          {userId == userData.id ? <CreatePost userData={userData} refetch={refetch} /> : null}
          <Flex mt={userId == userData.id ? 4 : 0} flexDirection="column" gap={2}>
            {data.getPostsOfUser.map((post, index) => (
              <Post key={index} postData={post} userData={userData} />
            ))}
          </Flex>
        </Flex>
      )}
    </>
  );
}
