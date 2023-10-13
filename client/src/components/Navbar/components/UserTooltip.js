/* eslint-disable react/prop-types */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Flex, Avatar, Text } from '@chakra-ui/react';

import { useApolloClient } from '@apollo/client';

import {
  AiFillSetting,
  AiOutlineUser,
  AiOutlineQuestionCircle,
  AiOutlineLogout
} from 'react-icons/ai';

export default function UserTooltip({ userData }) {
  const navigate = useNavigate();
  const client = useApolloClient();

  const handleClickLogout = () => {
    localStorage.removeItem('user');
    client.clearStore();
    navigate('/signin');
  };

  return (
    <Flex
      cursor="d"
      borderRadius="lg"
      boxShadow="md"
      p="0.4rem"
      mt="0.4rem"
      bg="white"
      w="12rem"
      flexDirection="column">
      <Flex alignItems="center" justifyItems="center" mt="0.4rem" mb="1rem">
        <Avatar mx="0.8rem" size="sm" name={userData.name} src={userData.avatar} />
        <Text fontWeight="medium">{userData.name}</Text>
      </Flex>
      <hr></hr>
      <Flex alignItems="center" cursor="pointer" ml="1.4rem" mt="1rem">
        <AiOutlineUser />
        <Text ml="0.6rem" fontWeight="md" color={'black'}>
          <Link to="/profile">Profile</Link>
        </Text>
      </Flex>
      <Flex alignItems="center" cursor="pointer" mt="1rem" ml="1.4rem">
        <AiFillSetting />
        <Text ml="0.6rem" fontWeight="md" color={'black'}>
          Setting
        </Text>
      </Flex>
      <Flex alignItems="center" cursor="pointer" mt="1rem" ml="1.4rem">
        <AiOutlineQuestionCircle />
        <Text ml="0.6rem" fontWeight="md" color={'black'}>
          Help
        </Text>
      </Flex>
      <Flex
        alignItems="center"
        cursor="pointer"
        m="1rem"
        ml="1.4rem"
        mb="0.4rem"
        onClick={handleClickLogout}>
        <AiOutlineLogout />
        <Text ml="0.6rem" fontWeight="md" color={'black'}>
          Logout
        </Text>
      </Flex>
    </Flex>
  );
}
