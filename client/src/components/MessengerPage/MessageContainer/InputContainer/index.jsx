import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Flex, Input, Box, IconButton, Image, Button } from '@chakra-ui/react';

import Picker from 'emoji-picker-react';
import ImageUploading from 'react-images-uploading';

import { AiOutlineSmile, AiOutlineUpload, AiOutlineEdit } from 'react-icons/ai';
import { BiSolidChevronRight } from 'react-icons/bi';
import { GrClose } from 'react-icons/gr';

import { gql, useMutation } from '@apollo/client';
const SEND_MESSAGE = gql`
  mutation SendMessage($input: SentMessageInput!) {
    sendMessage(input: $input) {
      id
      author {
        id
        name
        avatar
      }
      content
      createdAt
    }
  }
`;

export default function InputContainer() {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const inputRef = useRef();
  const handleEmojiClick = (emojiObject) => {
    let data = inputRef.current.value;
    data += emojiObject.emoji;
    inputRef.current.value = data;
  };

  //handleImage
  const [images, setImages] = useState([]);
  const maxNumber = 6;
  const onChangeImagesData = (imageList) => {
    setImages(imageList);
  };

  const [loading, setLoading] = useState(false);
  const url = useParams();
  useEffect(() => {
    inputRef.current.value = '';
    inputRef.current.focus();
  }, [url.id]);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputRef.current?.value || inputRef.current?.value.trim().length < 1) return;
    try {
      setLoading(true);
      const conversationId = Number(url.id);
      if (images.length > 0) {
        const files = images.map((image) => image.file);
        await sendMessage({
          variables: {
            input: { content: inputRef.current.value, conversationId: conversationId, files: files }
          }
        });
      } else {
        await sendMessage({
          variables: { input: { content: inputRef.current.value, conversationId: conversationId } }
        });
      }
      // reset input
      inputRef.current.value = '';
      setLoading(false);
      setImages([]);
      inputRef.current.focus();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ImageUploading
      multiple
      value={images}
      onChange={onChangeImagesData}
      maxNumber={maxNumber}
      dataURLKey="data_url">
      {({ imageList, onImageUpload, onImageUpdate, onImageRemove, dragProps }) => (
        <Flex w="full" flexDir="column">
          {imageList.length > 0 && (
            <Flex
              gap={4}
              justifyContent="center"
              bg="white"
              w="full"
              borderRadius="xl"
              alignItems="center"
              p={1}>
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
            </Flex>
          )}
          <form
            onSubmit={handleSendMessage}
            style={{
              width: '100%'
            }}>
            <Flex
              pos="relative"
              bg="white"
              w="full"
              h={16}
              borderRadius="xl"
              alignItems="center"
              p={4}
              gap={4}>
              <Input
                disabled={loading}
                ref={inputRef}
                mx={8}
                bg="gray.100"
                placeholder="Enter message..."
              />
              <Box color="blue.600" cursor="pointer">
                <AiOutlineSmile onClick={handleEmojiPickerHideShow} size={30} />
              </Box>
              <Box color="blue.600" onClick={onImageUpload} {...dragProps} cursor="pointer">
                <AiOutlineUpload size={30} />
              </Box>
              <IconButton
                isLoading={loading}
                type="submit"
                borderRadius="xl"
                bgColor="blue.600"
                color="white"
                _hover={{ bgColor: 'blue.600' }}
                icon={<BiSolidChevronRight />}
              />
              <Box dropShadow="md" position="absolute" top={-334} right={4} overflow="clip">
                {showEmojiPicker ? (
                  <Picker
                    height={320}
                    width={320}
                    searchDisabled={true}
                    onEmojiClick={handleEmojiClick}
                  />
                ) : null}
              </Box>
            </Flex>
          </form>
        </Flex>
      )}
    </ImageUploading>
  );
}
