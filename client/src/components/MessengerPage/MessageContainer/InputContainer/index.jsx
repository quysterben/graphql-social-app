import { useRef, useState } from 'react';

import { Flex, Input, Box, IconButton } from '@chakra-ui/react';

import Picker from 'emoji-picker-react';

import { AiOutlineSmile, AiOutlineUpload } from 'react-icons/ai';
import { BiSolidChevronRight } from 'react-icons/bi';

export default function InputContainer() {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerHideShow = () => {
    console.log('clicked');
    setShowEmojiPicker(!showEmojiPicker);
  };

  const inputRef = useRef();
  const handleEmojiClick = (emojiObject) => {
    let data = inputRef.current.value;
    data += emojiObject.emoji;
    inputRef.current.value = data;
  };

  return (
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
        borderRadius="xl"
        bgColor="blue.600"
        color="white"
        _hover={{ bgColor: 'blue.600' }}
        icon={<BiSolidChevronRight />}
      />
      <Box dropShadow="md" position="absolute" top={-334} right={4} overflow="clip">
        {showEmojiPicker ? (
          <Picker height={320} width={320} searchDisabled={true} onEmojiClick={handleEmojiClick} />
        ) : null}
      </Box>
    </Flex>
  );
}
