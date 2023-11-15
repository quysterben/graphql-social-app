import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Flex, Input, Box, IconButton } from '@chakra-ui/react';

import Picker from 'emoji-picker-react';

import { AiOutlineSmile, AiOutlineUpload } from 'react-icons/ai';
import { BiSolidChevronRight } from 'react-icons/bi';

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

  const url = useParams();
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputRef.current?.value || inputRef.current?.value.trim().length < 1) return;
    try {
      const conversationId = Number(url.id);
      await sendMessage({
        variables: { input: { content: inputRef.current.value, conversationId: conversationId } }
      });
      inputRef.current.value = '';
    } catch (err) {
      console.log(err);
    }
  };

  return (
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
        <Input ref={inputRef} mx={8} bg="gray.100" placeholder="Enter message..." />
        <Box color="blue.600" cursor="pointer">
          <AiOutlineSmile onClick={handleEmojiPickerHideShow} size={30} />
        </Box>
        <Box color="blue.600" cursor="pointer">
          <AiOutlineUpload size={30} />
        </Box>
        <IconButton
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
  );
}
