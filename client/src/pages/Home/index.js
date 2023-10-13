import { Box, Center, Flex } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import LeftSideBar from '../../components/LeftSideBar';
import RightSideBar from '../../components/RightSideBar';
import CreatePost from '../../components/CreatePost';

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
        <Box bg="gray.200" h="100vh" overflowY="auto">
          <Navbar userData={userData} />
          <LeftSideBar userData={userData} />
          <RightSideBar />
          <Flex mt={16} flexDirection="column" justifyContent="center" w="40%" mx="auto">
            <CreatePost userData={userData} />
          </Flex>
        </Box>
      )}
    </>
  );
}
