import { Box, Flex } from '@chakra-ui/react';

import Navbar from '../../components/Navbar';

import { useParams } from 'react-router-dom';
import Images from '../../components/PostPage/Images';
import PostData from '../../components/PostPage/PostData';

export default function PostPage() {
  const url = useParams();

  return (
    <Box h="100vh" overflowY="auto">
      <Navbar />
      <Flex justifyItems="center">
        <Images postId={Number(url.id)} />
        <PostData postId={Number(url.id)} />
      </Flex>
    </Box>
  );
}
