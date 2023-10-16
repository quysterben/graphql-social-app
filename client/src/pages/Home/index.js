import { Box, Center, Flex } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import LeftSideBar from '../../components/LeftSideBar';
import RightSideBar from '../../components/RightSideBar';
import CreatePost from '../../components/CreatePost';

import { gql, useQuery } from '@apollo/client';
import Post from '../../components/Post';

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

  const { loading, error, data } = useQuery(GET_ALL_POSTS, {
    fetchPolicy: 'cache-and-network'
  });

  if (loading) {
    return <Loader />;
  }

  if (error) console.log(error);

  return (
    <>
      {isLoading ? (
        <Center w="100vw" h="100vh" justifyItems="center" alignItems="center">
          <Loader />
        </Center>
      ) : (
        <Box bg="gray.200" h="100vh" overflowY="auto">
          <Navbar userData={userData} />
          <LeftSideBar userData={userData} />
          <RightSideBar />
          <Flex mt={16} flexDirection="column" justifyContent="center" w="40%" mx="auto">
            <CreatePost userData={userData} />
            <Flex mt={4} flexDirection="column" gap={2}>
              {data.getAllPosts.map((post, index) => (
                <Post key={index} postData={post} />
              ))}
            </Flex>
          </Flex>
        </Box>
      )}
    </>
  );
}
