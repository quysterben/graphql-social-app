import { Box, Center, Flex } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import LeftSideBar from '../../components/LeftSideBar';

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

  return (
    <>
      {isLoading ? (
        <Center w="100vw" h="100vh" justifyItems="center" alignItems="center">
          <Loader />
        </Center>
      ) : (
        <Box
          bg="gray.100"
          h="100vh"
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': {
              width: '4px'
            },
            '&::-webkit-scrollbar-track': {
              width: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'gray.400',
              borderRadius: '24px'
            }
          }}>
          <Navbar userData={userData} />
          <LeftSideBar userData={userData} />
          <Flex justifyContent="center">Home</Flex>
        </Box>
      )}
    </>
  );
}
