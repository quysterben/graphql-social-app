import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Flex, Heading, Image } from '@chakra-ui/react';

import InformationContainer from './InformationContainer';
import InputContainer from './InputContainer';
import InformationSideBar from './InformationSideBar';

import Loader from '../../Loader';
const RobotImgURL =
  'https://res.cloudinary.com/dp9bf5rvm/image/upload/v1700623903/assets/ddacfhny1jbam27neiui.gif';

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
  const currUser = JSON.parse(localStorage.getItem('user'));
  const [showInfomationSideBar, setShowInformationSideBar] = useState(
    localStorage.getItem('showInfomationSideBar') === 'true' || false
  );
  const handleShowInformationSideBar = () => {
    localStorage.setItem('showInfomationSideBar', !showInfomationSideBar);
    setShowInformationSideBar(!showInfomationSideBar);
  };

  const url = useParams();
  const {
    data: conversationInfo,
    loading: conversationInfoLoading,
    error
  } = useQuery(GET_CONVERSATION_INFO, {
    variables: {
      conversationId: Number(url.id)
    },
    pollInterval: 20000
  });

  if (url.id === undefined || error) {
    return (
      <Flex
        flexDir="column"
        justifyContent="center"
        w="full"
        h="98vh"
        bg={'white'}
        borderRadius="xl"
        m="1vh"
        alignItems="center">
        <Heading my="4" size="xl">
          Welcome, <span>{currUser.name},</span>
        </Heading>
        <Heading size="md">Please select a chat to Start Messaging.</Heading>
        <Image src={RobotImgURL} alt="robot" w={60} h={60} />
      </Flex>
    );
  }

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
