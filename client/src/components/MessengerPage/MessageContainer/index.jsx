import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Flex } from '@chakra-ui/react';

import InformationContainer from './InformationContainer';
import InputContainer from './InputContainer';
import InformationSideBar from './InformationSideBar';

import Loader from '../../Loader';

import { gql, useQuery } from '@apollo/client';
import Messages from './Messages';
const GET_CONVERSATION_INFO = gql`
  query GetConversationInfo($conversationId: Int!) {
    getConversationInfo(conversationId: $conversationId) {
      id
      name
      isGroup
      image
      members {
        avatar
        name
        id
      }
    }
  }
`;

export default function MessageContainer() {
  const [showInfomationSideBar, setShowInformationSideBar] = useState(true);
  const handleShowInformationSideBar = () => {
    setShowInformationSideBar(!showInfomationSideBar);
  };

  const url = useParams();
  const { data: conversationInfo, loading: conversationInfoLoading } = useQuery(
    GET_CONVERSATION_INFO,
    {
      variables: {
        conversationId: Number(url.id)
      }
    }
  );

  if (conversationInfoLoading)
    return (
      <Flex
        justifyContent="center"
        w="full"
        h="98vh"
        bg={'white'}
        borderRadius="xl"
        m="1vh"
        alignItems="center">
        <Loader />
      </Flex>
    );

  if (url.id === undefined) return null;

  return (
    <Flex w="full" h="100vh">
      <Flex
        flex={1}
        h="99vh"
        borderRadius="xl"
        my="auto"
        flexDir="column"
        justifyContent="space-between">
        <InformationContainer
          handleShowInformationSideBar={handleShowInformationSideBar}
          conversationInfo={conversationInfo}
        />
        <Messages conversationInfo={conversationInfo} />
        <InputContainer />
      </Flex>
      {showInfomationSideBar ? <InformationSideBar conversationInfo={conversationInfo} /> : null}
    </Flex>
  );
}
