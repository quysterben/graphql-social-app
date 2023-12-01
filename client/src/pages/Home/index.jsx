import { Center, Flex } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import Loader from '../../components/Loader';
import LeftSideBar from '../../components/HomePage/LeftSideBar';
import CreatePost from '../../components/CreatePost';
import Navbar from '../../components/Navbar';
import Post from '../../components/Post';

import { gql, useQuery } from '@apollo/client';
const GET_ALL_POSTS = gql`
  query GetAllPosts {
    getAllPosts {
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
      createdAt
      images {
        id
        imageUrl
      }
    }
  }
`;

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState();
  useEffect(() => {
    const fetchData = async () => {
      setUserData(await JSON.parse(localStorage.getItem('user')));
      setIsLoading(false);
    };

    fetchData().catch(console.error);
  }, []);

  const { loading, error, data, refetch } = useQuery(GET_ALL_POSTS, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 30000
  });

  if (error) console.log(error);

  return (
    <>
      {isLoading ? (
        <Center w="100vw" h="100vh" justifyItems="center" alignItems="center">
          <Loader />
        </Center>
      ) : (
        <Flex bg="gray.200" h="100vh" overflowY="auto">
          <Navbar userData={userData} />
          <LeftSideBar userData={userData} />
          <Flex
            mt="8vh"
            minW="500px"
            flexDirection="column"
            w={'40%'}
            mx="auto"
            maxH="92vh"
            overflowY="auto"
            overflowX="hidden"
            css={{
              '&::-webkit-scrollbar': {
                width: '4px'
              },
              '&::-webkit-scrollbar-track': {
                width: '6px'
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'green',
                borderRadius: '24px'
              }
            }}>
            <CreatePost userData={userData} refetch={refetch} />
            {loading ? (
              <Flex h="400" alignItems="center" justifyContent="center">
                <Loader />
              </Flex>
            ) : (
              <Flex mt={4} flexDirection="column" gap={2}>
                {data.getAllPosts.map((post, index) => (
                  <Post key={index} postData={post} refetch={refetch} userData={userData} />
                ))}
              </Flex>
            )}
          </Flex>
        </Flex>
      )}
    </>
  );
}
