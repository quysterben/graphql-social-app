/* eslint-disable no-unused-vars */
import Proptyes from 'prop-types';
import { useState, useRef, useEffect } from 'react';

import {
  MenuItem,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  SimpleGrid,
  Image,
  Textarea,
  FormControl,
  ModalFooter,
  useDisclosure,
  useOutsideClick,
  useToast
} from '@chakra-ui/react';

import ImageUploading from 'react-images-uploading';
import Loader from '../Loader';
import Picker from 'emoji-picker-react';

import { AiOutlineEdit, AiOutlineSmile, AiOutlineUpload, AiOutlineDelete } from 'react-icons/ai';
import { GrClose } from 'react-icons/gr';

import { useMutation, gql } from '@apollo/client';
const EDIT_POST_MUTATION = gql`
  mutation EditPost($input: EditPostInput!) {
    editPost(input: $input) {
      id
      content
      author {
        id
        name
      }
      createdAt
    }
  }
`;

EditPostModal.propTypes = {
  refetch: Proptyes.func,
  postData: Proptyes.object
};

export default function EditPostModal({ refetch, postData }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const content = useRef();

  const [images, setImages] = useState([]);
  const maxNumber = 69;
  const onChangeImagesData = (imageList) => {
    setImages(imageList);
  };

  const [initialImages, setInitialImages] = useState();
  const [rmImgIds, setRmImgIds] = useState([]);
  useEffect(() => {
    setInitialImages(postData.images);
    setRmImgIds([]);
  }, [isOpen]);
  const handleRemoveInitialImage = (id) => {
    setRmImgIds([...rmImgIds, id]);
    setInitialImages(initialImages.filter((image) => image.id !== id));
  };

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

  const [editPost] = useMutation(EDIT_POST_MUTATION);
  const handleEditPost = async () => {
    if (content.current.value.length < 4) return;

    try {
      setIsLoading(true);
      const files = images.map((image) => image.file);
      await editPost({
        variables: {
          input: {
            postId: postData.id,
            content: content.current.value,
            removeImgIds: rmImgIds,
            newImgFiles: files
          }
        }
      });
      setIsLoading(false);
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
    <>
      <MenuItem
        onClick={onOpen}
        icon={
          <Box>
            <AiOutlineEdit size={20} />
          </Box>
        }>
        Edit
      </MenuItem>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          {isLoading ? (
            <Flex alignItems="center" justifyContent="center" h={500}>
              <Loader />
            </Flex>
          ) : (
            <>
              <ModalHeader fontWeight="bold">Edit your post</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl mt={4}>
                  <Textarea
                    ref={content}
                    defaultValue={postData.content}
                    type="text"
                    placeholder="Content"
                  />
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
                        {initialImages.map((image) => (
                          <Flex
                            justifyItems="center"
                            alignItems="center"
                            flexDirection="column"
                            key={image.id}
                            p={1}
                            border="1px"
                            borderRadius="md"
                            borderColor="gray.300">
                            <Image src={image.imageUrl} alt="" boxSize="100" />
                            <Flex mt={1} gap={2} justifyContent="space-evenly">
                              <Button size="sm" onClick={() => handleRemoveInitialImage(image.id)}>
                                <GrClose />
                              </Button>
                            </Flex>
                          </Flex>
                        ))}
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
                <Button onClick={handleEditPost} mx="auto" w="100%" colorScheme="blue">
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
