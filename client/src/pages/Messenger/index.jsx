import { Flex } from '@chakra-ui/react';

import ConservationContainer from '../../components/MessengerPage/ConversationContainer';
import MessageContainer from '../../components/MessengerPage/MessageContainer';
import MenuSideBar from '../../components/MessengerPage/MenuSideBar';

export default function Messenger() {
  return (
    <Flex w="100vw" h="100vh" bg="gray.200">
      <MenuSideBar />
      <ConservationContainer />
      <MessageContainer />
    </Flex>
  );
}
