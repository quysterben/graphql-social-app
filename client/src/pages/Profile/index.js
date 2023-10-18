import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Center, Box, Flex, Image, Button, Avatar, Heading } from '@chakra-ui/react';

import Loader from '../../components/Loader';
import Navbar from '../../components/Navbar';

import { BsCamera } from 'react-icons/bs';

const defaultWpUrl =
  'https://w0.peakpx.com/wallpaper/868/430/HD-wallpaper-social-networks-blue-background-social-networks-icons-blue-light-globe-global-networks-social-networks-blue-background-social-networks-concepts.jpg';

import LeftBar from '../../components/ProfilePage/LeftBar';
import RightBar from '../../components/ProfilePage/RightBar';

import { gql, useQuery } from '@apollo/client';
const GET_ONE_USER = gql`
  query GetOneUser($input: GetOneUserInput!) {
    getOneUser(input: $input) {
      id
      name
      email
      dateOfBirth
      from
      avatar
      wallpaper
      createdAt
    }
  }
`;

export default function Profile() {
  const url = useParams();
  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setUserData(await JSON.parse(localStorage.getItem('user')));
      setIsLoading(false);
    };

    fetchData().catch(console.error);
  }, []);

  const { loading, error, data } = useQuery(GET_ONE_USER, {
    fetchPolicy: 'cache-and-network',
    variables: {
      input: {
        userId: Number(url.id)
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
        <Box bg="gray.200" h="100vh" overflowY="auto">
          <Navbar userData={userData} />
          {loading ? (
            <Loader />
          ) : (
            <>
              <Flex mt={16} w="100" alignContent="center" justifyContent="center">
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  w="70%"
                  h={340}
                  overflow="hidden"
                  position="relative">
                  <Image width="100%" src={data.getOneUser.wallpaper || defaultWpUrl} />
                  {userData.id == url.id ? (
                    <Button
                      size="sm"
                      leftIcon={<BsCamera />}
                      bottom={4}
                      right={4}
                      position="absolute">
                      Edit wallpaper
                    </Button>
                  ) : null}
                  <Flex bottom={4} left={16} gap={4} position="absolute" alignItems="center">
                    <Avatar
                      cursor="pointer"
                      border="4px"
                      color="white"
                      size="2xl"
                      src={data.getOneUser.avatar}
                      name={data.getOneUser.name}
                    />
                    <Heading mt={12} color="white">
                      {data.getOneUser.name}
                    </Heading>
                  </Flex>
                </Flex>
              </Flex>
              <Flex my={4} gap={4} mx="auto" justifyItems="center" w="70%">
                <LeftBar infoData={data} />
                <RightBar userData={userData} userId={url.id} />
              </Flex>
            </>
          )}
        </Box>
      )}
    </>
  );
}
