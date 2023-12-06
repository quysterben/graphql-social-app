import {
  Box,
  ModalFooter,
  ModalHeader,
  Avatar,
  Flex,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  FormControl,
  Image,
  SimpleGrid,
  Textarea,
  useToast,
  useOutsideClick
} from '@chakra-ui/react';

import Picker from 'emoji-picker-react';
import Loader from '../Loader';

import ImageUploading from 'react-images-uploading';

import { useRef, useState } from 'react';

import { AiOutlineUpload, AiOutlineDelete, AiOutlineEdit, AiOutlineSmile } from 'react-icons/ai';
import { GrClose } from 'react-icons/gr';

import { useMutation, gql } from '@apollo/client';
const CREATE_POST_MUTATION = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      content
      createdAt
    }
  }
`;

import Proptypes from 'prop-types';
CreatePost.propTypes = {
  userData: Proptypes.object,
  refetch: Proptypes.func
};

export default function CreatePost({ userData, refetch }) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const content = useRef('');

  const emojiRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  const handleEmojiClick = (emojiObject) => {
    let data = content.current.value;
    data += emojiObject.emoji;
    content.current.value = data;
  };
  useOutsideClick({
    ref: emojiRef,
    handler: () => {
      setShowEmojiPicker(false);
    }
  });

  const [images, setImages] = useState([]);
  const maxNumber = 10;
  const onChangeImagesData = (imageList) => {
    setImages(imageList);
  };

  const [createPost] = useMutation(CREATE_POST_MUTATION);
  const handleUpload = async () => {
    if (content.current.value.length < 4) {
      toast({
        title: 'Content must be at least 4 characters',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right'
      });
      return;
    }

    try {
      setIsLoading(true);
      const files = images.map((image) => image.file);
      await createPost({
        variables: {
          input: {
            content: content.current.value,
            files
          }
        }
      });
      toast({
        title: 'Create post successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right'
      });
      resetModal();
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right'
      });
      resetModal();
    }
  };

  const resetModal = () => {
    setImages([]);
    setShowEmojiPicker(false);
    onClose();
    setIsLoading(false);
    refetch();
  };

  return (
    <Box w="100%" bg="white" rounded="md">
      <Flex alignItems="center" my={4}>
        <Avatar ml="0.8rem" size="sm" name={userData.name} src={userData.avatar} />
        <Button onClick={onOpen} rounded="2xl" mx="0.8rem" w="100%" color="gray.600">
          {userData.name} what do you think ?
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          {isLoading ? (
            <Flex alignItems="center" justifyContent="center" h={500}>
              <Loader />
            </Flex>
          ) : (
            <>
              <ModalHeader fontWeight="bold">Create your post</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl mt={4}>
                  <Textarea ref={content} type="text" placeholder="Content" />
                </FormControl>
                <Flex mt={2} flexDirection="row-reverse" position="relative">
                  <Box color="gray.300" cursor="pointer" _hover={{ color: 'primary.600' }}>
                    <AiOutlineSmile onClick={handleEmojiPickerHideShow} size={30} />
                    <Box position="absolute" ref={emojiRef} top={4} right={-324}>
                      {showEmojiPicker ? (
                        <Picker
                          height={400}
                          width={320}
                          searchDisabled={true}
                          onEmojiClick={handleEmojiClick}
                        />
                      ) : null}
                    </Box>
                  </Box>
                </Flex>
                <ImageUploading
                  multiple
                  value={images}
                  onChange={onChangeImagesData}
                  maxNumber={maxNumber}
                  dataURLKey="data_url">
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    dragProps
                  }) => (
                    <Box mt={4}>
                      <Button
                        w="78%"
                        mr="4"
                        colorScheme="teal"
                        onClick={onImageUpload}
                        {...dragProps}>
                        <AiOutlineUpload />
                      </Button>
                      <Button colorScheme="red" w="18%" onClick={onImageRemoveAll}>
                        <AiOutlineDelete />
                      </Button>
                      <SimpleGrid overflowY="auto" columns={4} gap={2} mt={2}>
                        {imageList.map((image, index) => (
                          <Flex
                            justifyItems="center"
                            alignItems="center"
                            flexDirection="column"
                            key={index}
                            p={1}
                            border="1px"
                            borderRadius="md"
                            borderColor="gray.300">
                            <Image src={image['data_url']} alt="" boxSize="100" />
                            <Flex mt={1} gap={2} justifyContent="space-evenly">
                              <Button size="sm" onClick={() => onImageUpdate(index)}>
                                <AiOutlineEdit />
                              </Button>
                              <Button size="sm" onClick={() => onImageRemove(index)}>
                                <GrClose />
                              </Button>
                            </Flex>
                          </Flex>
                        ))}
                      </SimpleGrid>
                    </Box>
                  )}
                </ImageUploading>
              </ModalBody>
              <ModalFooter>
                <Button onClick={handleUpload} mx="auto" w="100%" colorScheme="blue">
                  Upload
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
}
