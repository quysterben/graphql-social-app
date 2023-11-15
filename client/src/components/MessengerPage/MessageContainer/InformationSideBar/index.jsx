/* eslint-disable react/prop-types */
import conversationName from '../../../../helpers/conversationName';
import conversationImage from '../../../../helpers/conversationImage';

import {
  Flex,
  Avatar,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Button
} from '@chakra-ui/react';

import { AiOutlineEdit } from 'react-icons/ai';
import ChangeConversationName from './ChangeConversationName';

export default function InformationSideBar({ conversationInfo }) {
  const currUser = JSON.parse(localStorage.getItem('user'));

  return (
    <Flex
      h="99vh"
      bg="white"
      w={458}
      alignItems="center"
      flexDir="column"
      borderRadius="2xl"
      gap={12}
      mx={1}
      p={4}
      my="0.5vh">
      <Flex flexDir="column" gap={2} cursor="pointer">
        <Avatar
          m="auto"
          size="xl"
          name={conversationName(conversationInfo.getConversationInfo, currUser)}
          src={conversationImage(conversationInfo.getConversationInfo, currUser)}
          cursor="pointer"
        />
        <Heading size="md" mx="auto">
          {conversationName(conversationInfo.getConversationInfo, currUser)}
        </Heading>
      </Flex>
      <Accordion w="full" defaultIndex={[0]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Flex as="span" flex="1" textAlign="left">
                Chat settings
              </Flex>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <ChangeConversationName />
            <Button mt={2} w="full" leftIcon={<AiOutlineEdit />}>
              Change convervation image
            </Button>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Flex as="span" flex="1" textAlign="left">
                Members
              </Flex>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Button colorScheme="blue">Invite</Button>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Flex as="span" flex="1" textAlign="left">
                Images
              </Flex>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
}
