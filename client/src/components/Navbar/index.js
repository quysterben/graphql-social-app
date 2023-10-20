/* eslint-disable react/prop-types */
import { useState } from 'react';
import Tippy from '@tippyjs/react';

import {
  Flex,
  Box,
  Image,
  InputGroup,
  InputLeftElement,
  Input,
  Avatar,
  Badge
} from '@chakra-ui/react';
import {
  AiOutlineHome,
  AiOutlineUsergroupAdd,
  AiOutlineMessage,
  AiOutlineBell
} from 'react-icons/ai';
import { BsMoonStars } from 'react-icons/bs';
import { BiSearchAlt } from 'react-icons/bi';

import UserTooltip from './components/UserTooltip';
import FriendTooltip from './components/FriendTooltip';

const styles = {
  icon: {
    cursor: 'pointer',
    _hover: {
      color: 'primary.600',
      transition: '0.4s ease-out'
    }
  }
};

import { gql, useQuery } from '@apollo/client';

import Loader from '../Loader';
import { Link } from 'react-router-dom';

const GET_ALL_FRIEND_REQUESTS_QUERY = gql`
  query AllFriendRequest {
    getAllFriendRequests {
      id
      status
      user {
        id
        name
        email
        avatar
        wallpaper
      }
    }
  }
`;

export default function Navbar({ userData }) {
  const [userTippyShow, setUserTippyShow] = useState(false);
  const handleUserTippy = () => setUserTippyShow(!userTippyShow);

  const [friendTippyShow, setFriendTippyShow] = useState(false);
  const handleFriendTippyShow = () => setFriendTippyShow(!friendTippyShow);
  const { loading, error, data } = useQuery(GET_ALL_FRIEND_REQUESTS_QUERY, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 30000
  });

  if (loading) {
    return <Loader />;
  }

  if (error) console.log(error);

  return (
    <Flex
      h="3.75rem"
      position="fixed"
      top="0"
      left="0"
      right="0"
      alignItems="center"
      bg="white"
      zIndex="overlay">
      <Flex mx="1rem" justifyItems="center" alignItems="center">
        <Image
          src={
            'https://res.cloudinary.com/dp9bf5rvm/image/upload/v1697422644/assets/kf7uo6bn0stt4lwpmwkw.png'
          }
          w="3rem"
          h="3rem"
          alt="logo"
        />
      </Flex>
      <Flex mx="1rem">
        <Box mx="1.5rem" sx={styles.icon}>
          <Link to="/">
            <AiOutlineHome size={28} />
          </Link>
        </Box>
        <Box mx="1.5rem" sx={styles.icon}>
          <BsMoonStars size={24} />
        </Box>
      </Flex>
      <Flex flex={1} mx="8rem">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <BiSearchAlt color="gray.300" />
          </InputLeftElement>
          <Input type="tel" placeholder="Search" />
        </InputGroup>
      </Flex>
      <Flex ml="2rem">
        <Tippy
          placement="bottom-end"
          content={<FriendTooltip />}
          visible={friendTippyShow}
          interactive={true}
          onClickOutside={() => setFriendTippyShow(false)}>
          <Box mx="1rem" pos="relative" sx={styles.icon} onClick={() => handleFriendTippyShow()}>
            <AiOutlineUsergroupAdd size={24} />
            {data.getAllFriendRequests.filter((request) => request.status == 1).length > 0 ? (
              <Badge
                pos="absolute"
                variant="solid"
                bgColor="red.500"
                rounded="100%"
                right={-1}
                bottom={-1}>
                {data.getAllFriendRequests.filter((request) => request.status == 1).length}
              </Badge>
            ) : null}
          </Box>
        </Tippy>
        <Box mx="1rem" position="relative" sx={styles.icon}>
          <AiOutlineMessage size={24} />
          <Badge
            pos="absolute"
            variant="solid"
            bgColor="red.500"
            rounded="100%"
            right={-1}
            bottom={-1}>
            {5}
          </Badge>
        </Box>
        <Box mx="1rem" sx={styles.icon} position="relative">
          <AiOutlineBell size={24} />
          <Badge
            pos="absolute"
            variant="solid"
            bgColor="red.500"
            rounded="100%"
            right={-1}
            bottom={-1}>
            {5}
          </Badge>
        </Box>
      </Flex>
      <Flex cursor="pointer" justifyItems="center" alignItems="center">
        <Tippy
          content={<UserTooltip userData={userData} />}
          visible={userTippyShow}
          interactive={true}
          onClickOutside={() => setUserTippyShow(false)}>
          <Avatar
            onClick={() => handleUserTippy()}
            mx="0.8rem"
            size="sm"
            name={userData.name}
            src={userData.avatar || 'https://bit.ly/broken-link'}></Avatar>
        </Tippy>
      </Flex>
    </Flex>
  );
}
