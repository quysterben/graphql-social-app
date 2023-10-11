/* eslint-disable react/prop-types */
import { useState } from 'react';
import Tippy from '@tippyjs/react';

import Logo from '../../assets/Logo.png';
import { Flex, Box, Image, InputGroup, InputLeftElement, Input, Avatar } from '@chakra-ui/react';
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

export default function Navbar({ userData }) {
  const [userTippyShow, setUserTippyShow] = useState(false);
  const handleUserTippy = () => setUserTippyShow(!userTippyShow);

  const [friendTippyShow, setFriendTippyShow] = useState(false);
  const handleFriendTippyShow = () => setFriendTippyShow(!friendTippyShow);

  return (
    <Flex
      h="3.75rem"
      w="100vw"
      position="fixed"
      top="0"
      left="0"
      right="0"
      alignItems="center"
      bg="white"
      dropShadow="md"
      boxShadow="md">
      <Flex mx="1rem" justifyItems="center" alignItems="center">
        <Image src={Logo} w="3rem" h="3rem" alt="logo" />
      </Flex>
      <Flex mx="1rem">
        <Box mx="1.5rem" sx={styles.icon}>
          <AiOutlineHome size={28} />
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
          content={<FriendTooltip userData={userData} />}
          visible={friendTippyShow}
          interactive={true}
          onClickOutside={() => setFriendTippyShow(false)}>
          <Box mx="1rem" sx={styles.icon} onClick={() => handleFriendTippyShow()}>
            <AiOutlineUsergroupAdd size={24} />
          </Box>
        </Tippy>
        <Box mx="1rem" sx={styles.icon}>
          <AiOutlineMessage size={24} />
        </Box>
        <Box mx="1rem" sx={styles.icon}>
          <AiOutlineBell size={24} />
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
            src={userData.avatar || 'https://bit.ly/broken-link'}
          />
        </Tippy>
      </Flex>
    </Flex>
  );
}
