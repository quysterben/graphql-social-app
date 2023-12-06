import { useNavigate } from 'react-router-dom';

import { Flex, Image } from '@chakra-ui/react';

const LOGO_URL =
  'https://res.cloudinary.com/dp9bf5rvm/image/upload/v1697422644/assets/kf7uo6bn0stt4lwpmwkw.png';

export default function MenuMessenger() {
  const navigate = useNavigate();

  return (
    <Flex
      flexDir="column"
      bg="white"
      h="100vh"
      minW="60px"
      alignItems="center"
      position="relative"
      boxShadow="xl">
      <Image cursor="pointer" onClick={() => navigate('/')} mt={4} src={LOGO_URL} h={12} w={12} />
    </Flex>
  );
}
