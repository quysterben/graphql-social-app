/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import NotificationTooltip from './components/Notification';

const LOGO_URL =
  'https://res.cloudinary.com/dp9bf5rvm/image/upload/v1697422644/assets/kf7uo6bn0stt4lwpmwkw.png';

export default function Navbar() {
  const [userTippyShow, setUserTippyShow] = useState(false);
  const handleUserTippy = () => setUserTippyShow(!userTippyShow);

  const [friendTippyShow, setFriendTippyShow] = useState(false);
  const handleFriendTippyShow = () => setFriendTippyShow(!friendTippyShow);

  const [notiTippyShow, setNotiTippyShow] = useState(false);
  const handleNotiTippyShow = async () => setNotiTippyShow(!notiTippyShow);

  const [friendRequestsCount, setFriendRequestsCount] = useState(0);
  const [notiCount, setNotiCount] = useState(0);
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserData(user);
  }, []);

  const handleSetFriendRequestsCount = (count) => {
    setFriendRequestsCount(count);
  };
  const handleSetNotiCount = (count) => {
    setNotiCount(count);
  };

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
        <Image loading="lazy" src={LOGO_URL} w="3rem" h="3rem" alt="logo" />
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
          content={<FriendTooltip setFriendRequestsCount={handleSetFriendRequestsCount} />}
          visible={friendTippyShow}
          interactive={true}
          onClickOutside={() => setFriendTippyShow(false)}>
          <Box mx="1rem" pos="relative" sx={styles.icon} onClick={() => handleFriendTippyShow()}>
            <AiOutlineUsergroupAdd size={24} />
            <Badge sx={styles.badge}>{friendRequestsCount > 0 ? friendRequestsCount : null}</Badge>
          </Box>
        </Tippy>
        <Box mx="1rem" position="relative" sx={styles.icon}>
          <AiOutlineMessage size={24} />
          <Badge sx={styles.badge}>{}</Badge>
        </Box>
        <Tippy
          placement="bottom-end"
          content={<NotificationTooltip setNotiCount={handleSetNotiCount} />}
          visible={notiTippyShow}
          interactive={true}
          onClickOutside={() => setNotiTippyShow(false)}>
          <Box mx="1rem" sx={styles.icon} position="relative" onClick={() => handleNotiTippyShow()}>
            <AiOutlineBell size={24} />
            <Badge sx={styles.badge}>{notiCount > 0 ? notiCount : null}</Badge>
          </Box>
        </Tippy>
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
            loading="lazy"
            src={userData.avatar}
            name={userData.name}
          />
        </Tippy>
      </Flex>
    </Flex>
  );
}

const styles = {
  icon: {
    cursor: 'pointer',
    _hover: {
      color: 'primary.600',
      transition: '0.4s ease-out'
    }
  },
  badge: {
    pos: 'absolute',
    variant: 'solid',
    bgColor: 'red.500',
    rounded: '100%',
    right: -1,
    top: -1
  }
};
