import { useNavigate } from 'react-router-dom';

import { Flex, Image } from '@chakra-ui/react';

import { AiOutlineMessage } from 'react-icons/ai';
import { FaUsers } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';

const LOGO_URL =
  'https://res.cloudinary.com/dp9bf5rvm/image/upload/v1697422644/assets/kf7uo6bn0stt4lwpmwkw.png';

export default function MenuMessenger() {
  const navigate = useNavigate();

  return (
    <Flex
      flexDir="column"
      bg="white"
      h="100vh"
      w="4rem"
      alignItems="center"
      position="relative"
      boxShadow="xl">
      <Image cursor="pointer" onClick={() => navigate('/')} mt={4} src={LOGO_URL} h={12} w={12} />
      <Flex flexDir="column" alignItems="center" gap={12} position="absolute" bottom={8}>
        <Flex justifyContent="center" color="gray.600" cursor="pointer">
          <AiOutlineMessage size={28} />
        </Flex>
        <Flex justifyContent="center" color="gray.600" cursor="pointer">
          <FaUsers size={28} />
        </Flex>
        <Flex justifyContent="center" color="gray.600" cursor="pointer">
          <FiUsers size={28} />
        </Flex>
      </Flex>
    </Flex>
  );
}
