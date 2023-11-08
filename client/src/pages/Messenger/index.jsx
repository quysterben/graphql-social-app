import { Flex } from '@chakra-ui/react';

import ConservationContainer from '../../components/MessengerPage/ConversationContainer';
import MessageContainer from '../../components/MessengerPage/MessageContainer';
import MenuMessenger from '../../components/MessengerPage/MenuMessenger';

export default function Messenger() {
  return (
    <Flex w="100vw" h="100vh" bg="gray.200">
      <MenuMessenger />
      <ConservationContainer />
      <MessageContainer />
    </Flex>
  );
}
