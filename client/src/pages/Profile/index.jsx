import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Flex } from '@chakra-ui/react';

import Loader from '../../components/Loader';
import Navbar from '../../components/Navbar';

import LeftBar from '../../components/ProfilePage/LeftBar';
import RightBar from '../../components/ProfilePage/RightBar';
import Header from '../../components/ProfilePage/Header';

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
  const navigate = useNavigate();
  const [userData, setUserData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setUserData(await JSON.parse(localStorage.getItem('user')));
    };

    fetchData().catch(console.error);
  }, []);

  const { loading, error, data, refetch } = useQuery(GET_ONE_USER, {
    fetchPolicy: 'cache-and-network',
    variables: {
      input: {
        userId: Number(url.id)
      }
    },
    pollInterval: 30000
  });
  if (error) navigate(-1);

  const updateUserStorageData = (res) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const newUser = {
      ...res,
      token: user.token
    };
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  return (
    <Box bg="gray.200" h="100vh" overflowY="auto">
      <Navbar />
      {loading ? (
        <Flex my={4} gap={4} mx="auto" justifyContent="center" w="70%" h={800} alignItems="center">
          <Loader />
        </Flex>
      ) : (
        <>
          <Header
            infoData={data}
            userData={userData}
            url={url}
            refetchUserData={refetch}
            updateUserStorageData={updateUserStorageData}
          />
          <Flex my={4} gap={4} mx="auto" justifyItems="center" w="70%">
            <LeftBar
              infoData={data}
              updateUserStorageData={updateUserStorageData}
              refetch={refetch}
              userData={userData}
            />
            <RightBar userData={userData} userId={url.id} />
          </Flex>
        </>
      )}
    </Box>
  );
}
