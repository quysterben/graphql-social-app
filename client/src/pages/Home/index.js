import { Box, Center } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';

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
        <Box>
          <Navbar userData={userData} />
          <Box>Home</Box>
        </Box>
      )}
    </>
  );
}
