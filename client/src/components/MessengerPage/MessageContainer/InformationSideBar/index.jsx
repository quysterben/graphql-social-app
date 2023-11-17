/* eslint-disable react/prop-types */
import { useState } from 'react';

import conversationName from '../../../../helpers/conversationName';
import conversationImage from '../../../../helpers/conversationImage';
import ImageUploading from 'react-images-uploading';

import {
  Flex,
  Avatar,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Button,
  useToast
} from '@chakra-ui/react';

import { AiOutlineEdit } from 'react-icons/ai';
import ChangeConversationName from './ChangeConversationName';
import ConversationMember from './ConversationMember';

import { gql, useMutation } from '@apollo/client';
const UPLOAD_CONVERSATION_IMAGE = gql`
  mutation ChangeConversationImage($conversationId: Int!, $file: Upload!) {
    changeConversationImage(conversationId: $conversationId, file: $file) {
      id
      name
      isGroup
      image
    }
  }
`;

export default function InformationSideBar({ conversationInfo }) {
  const currUser = JSON.parse(localStorage.getItem('user'));

  //Upload image
  const toast = useToast();
  const [uploadConversationImage] = useMutation(UPLOAD_CONVERSATION_IMAGE);
  const [images, setImages] = useState([]);
  const maxNumber = 1;
  const onChangeImagesData = async (imageList) => {
    setImages(imageList);
    try {
      await uploadConversationImage({
        variables: {
          conversationId: conversationInfo.getConversationInfo.id,
          file: imageList[0].file
        }
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <Flex
      h="99vh"
      maxH="99vh"
      overflowY="auto"
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
            <ImageUploading
              value={images}
              onChange={onChangeImagesData}
              maxNumber={maxNumber}
              dataURLKey="data_url">
              {({ onImageUpload, dragProps }) => (
                <Button
                  mt={2}
                  w="full"
                  leftIcon={<AiOutlineEdit />}
                  onClick={onImageUpload}
                  {...dragProps}>
                  Change convervation image
                </Button>
              )}
            </ImageUploading>
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
            <ConversationMember />
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
