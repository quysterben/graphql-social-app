import { useEffect, useState } from 'react';

import { Box, Flex, useToast } from '@chakra-ui/react';

import Navbar from '../../components/Navbar';

import { useNavigate, useParams } from 'react-router-dom';

import Images from '../../components/PostPage/Images';
import PostData from '../../components/PostPage/PostData';
import LeftSideBar from '../../components/HomePage/LeftSideBar';
import RightSideBar from '../../components/HomePage/RightSideBar';

import { gql, useQuery } from '@apollo/client';
import Loader from '../../components/Loader';
const GET_SINGLE_POST = gql`
  query GetSinglePost($input: SinglePostInput!) {
    getSinglePost(input: $input) {
      id
      images {
        id
        imageUrl
      }
    }
  }
`;

export default function PostPage() {
  const url = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState();
  useEffect(() => {
    const fetchData = async () => {
      setUserData(await JSON.parse(localStorage.getItem('user')));
      setIsLoading(false);
    };

    fetchData().catch(console.error);
  }, []);

  const { data, loading, error } = useQuery(GET_SINGLE_POST, {
    variables: {
      input: {
        postId: Number(url.id)
      }
    }
  });
  if (loading) return <Loader />;
  if (error) {
    toast({
      title: error.message,
      status: 'error',
      isClosable: true,
      position: 'bottom-right'
    });
    navigate(-1);
    return null;
  }

  if (data.getSinglePost.images.length === 0)
    return (
      <Box bg="gray.200" h="100vh">
        <Navbar />
        {isLoading ? null : (
          <>
            <LeftSideBar userData={userData} />
            <RightSideBar userData={userData} />
          </>
        )}
        <Flex justifyContent="center" h="100vh" w="100%" mx="auto">
          <PostData postId={Number(url.id)} />
        </Flex>
      </Box>
    );

  return (
    <Box h="100vh">
      <Navbar />
      <Flex h="100vh">
        <Images postId={Number(url.id)} />
        <PostData postId={Number(url.id)} />
      </Flex>
    </Box>
  );
}
