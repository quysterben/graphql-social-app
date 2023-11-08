import { useState } from 'react';

import { Flex } from '@chakra-ui/react';

import InformationContainer from './InformationContainer';
import InputContainer from './InputContainer';
import InformationSideBar from './InformationSideBar';

export default function MessageContainer() {
  const [showInfomationSideBar, setShowInformationSideBar] = useState(true);
  const handleShowInformationSideBar = () => {
    setShowInformationSideBar(!showInfomationSideBar);
  };
  return (
    <Flex w="full">
      <Flex
        flex={1}
        h="99vh"
        borderRadius="xl"
        my="auto"
        flexDir="column"
        justifyContent="space-between">
        <InformationContainer handleShowInformationSideBar={handleShowInformationSideBar} />
        <Flex flex={1} w="full" bg="white" borderRadius="xl" my={1}></Flex>
        <InputContainer />
      </Flex>
      {showInfomationSideBar ? <InformationSideBar /> : null}
    </Flex>
  );
}
