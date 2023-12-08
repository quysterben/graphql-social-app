import Proptypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import conversationName from '../../../../helpers/conversationName';
import conversationImage from '../../../../helpers/conversationImage';
import ImageUploading from 'react-images-uploading';
import Loader from '../../../Loader';

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
  useToast,
  SimpleGrid,
  Image
} from '@chakra-ui/react';

import { RiImageEditLine } from 'react-icons/ri';

import ChangeConversationName from './ChangeConversationName';
import ConversationMember from './ConversationMember';

import { gql, useMutation, useQuery } from '@apollo/client';

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
const GET_CONVERSATION_IMAGES = gql`
  query GetConversationImages($conversationId: Int!) {
    getConversationImages(conversationId: $conversationId) {
      id
      imageUrl
    }
  }
`;
const MESSAGE_SUBSCRIPTION = gql`
  subscription MessageUpdated($conversationId: Int!) {
    messageUpdated(conversationId: $conversationId) {
      images {
        imageUrl
        id
      }
    }
  }
`;

InformationSideBar.propTypes = {
  conversationInfo: Proptypes.object
};

export default function InformationSideBar({ conversationInfo }) {
  const currUser = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
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
      setImages([]);
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right'
      });
      setImages([]);
    }
  };

  const { data, loading, error, subscribeToMore } = useQuery(GET_CONVERSATION_IMAGES, {
    variables: { conversationId: conversationInfo.getConversationInfo.id },
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    const handleUpdateImages = () => {
      subscribeToMore({
        document: MESSAGE_SUBSCRIPTION,
        variables: { conversationId: conversationInfo.getConversationInfo.id },
        updateQuery: (prev, { subscriptionData }) => {
          if (subscriptionData.data.messageUpdated.images.length > 0) {
            return Object.assign({}, prev, {
              getConversationImages: [
                ...subscriptionData.data.messageUpdated.images,
                ...prev.getConversationImages
              ]
            });
          } else {
            return prev;
          }
        }
      });
    };
    handleUpdateImages();
  }, []);

  if (loading) return <Loader />;
  if (error) {
    toast({
      title: 'Error',
      description: error.message,
      status: 'error',
      duration: 3000,
      isClosable: true,
      position: 'bottom-right'
    });
    navigate('/messenger');
  }

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
                  isLoading={images.length > 0}
                  mt={2}
                  w="full"
                  leftIcon={<RiImageEditLine />}
                  onClick={onImageUpload}
                  {...dragProps}>
                  Change conversation image
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
          <AccordionPanel maxH={260} overflowY="auto" pb={4}>
            <SimpleGrid gap={1} columns={3}>
              {data.getConversationImages.map((image) => (
                <Flex key={image.id}>
                  <Image maxBlockSize={40} src={image.imageUrl} alt="conversationImage" />
                </Flex>
              ))}
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
}
