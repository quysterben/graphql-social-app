import { useState, useEffect } from 'react';

import { Center, Box, Flex } from '@chakra-ui/react';

import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';

import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import Images from '../../components/PostPage/Images';
import PostData from '../../components/PostPage/PostData';
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
      images {
        id
        imageUrl
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

export default function PostPage() {
  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setUserData(await JSON.parse(localStorage.getItem('user')));
      setIsLoading(false);
    };

    fetchData().catch(console.error);
  }, []);

  const url = useParams();

  const { data, loading, error, refetch } = useQuery(GET_SINGLE_POST, {
    fetchPolicy: 'cache-and-network',
    variables: {
      input: {
        postId: Number(url.id)
      }
    }
  });
  if (error) console.log(error);

  return (
    <>
      {isLoading ? (
        <Center w="100vw" h="100vh" justifyItems="center" alignItems="center">
          <Loader />
        </Center>
      ) : (
        <Box h="100vh" overflowY="auto">
          <Navbar userData={userData} />
          {loading ? null : (
            <Flex justifyItems="center">
              <Images imageData={data.getSinglePost.images} />
              <PostData data={data.getSinglePost} userData={userData} refetch={refetch} />
            </Flex>
          )}
        </Box>
      )}
    </>
  );
}
