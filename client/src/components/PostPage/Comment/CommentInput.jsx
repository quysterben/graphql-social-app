import Proptypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import { Flex, Avatar, Input, Box, IconButton, useToast, useOutsideClick } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import Picker from 'emoji-picker-react';

import { AiOutlineSmile } from 'react-icons/ai';
import { BsArrowReturnLeft } from 'react-icons/bs';

import { gql, useMutation } from '@apollo/client';
const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
      parentId
      createdAt
    }
  }
`;

CommentInput.propTypes = {
  postId: Proptypes.number.isRequired,
  refetch: Proptypes.func.isRequired,
  parentId: Proptypes.number,
  scrollRef: Proptypes.object
};

export default function CommentInput({ postId, refetch, parentId = 0, scrollRef }) {
  const toast = useToast();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const currentUser = JSON.parse(localStorage.getItem('user'));

  const inputRef = useRef('');
  const handleEmojiClick = (emojiObject) => {
    let data = inputRef.current.value;
    data += emojiObject.emoji;
    inputRef.current.value = data;
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const [createComment] = useMutation(CREATE_COMMENT);
  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (inputRef.current.value.length < 2 || inputRef.current.value.trim().length < 1) {
      return;
    }
    try {
      await createComment({
        variables: {
          input: {
            content: inputRef.current.value,
            parentId: parentId,
            postId: postId
          }
        }
      });
      inputRef.current.value = '';
      refetch();
      setShowEmojiPicker(false);
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right'
      });
    }
  };

  // handle clickoutside emoji picker
  const emojiRef = useRef(null);
  useOutsideClick({
    ref: emojiRef,
    handler: () => setShowEmojiPicker(false)
  });

  return (
    <Flex p={4} gap={4} alignItems="center" ref={scrollRef}>
      <Link to={'/profile/' + currentUser?.id}>
        <Avatar size="sm" src={currentUser?.avatar} name={currentUser?.name} />
      </Link>
      <form
        style={{
          width: '100%'
        }}
        onSubmit={handleCreateComment}>
        <Flex gap={4} w="100%" position="relative" alignItems="center">
          <Input ref={inputRef} w="full" size="sm" />
          <AiOutlineSmile onClick={handleEmojiPickerHideShow} size={30} />
          <Box
            ref={emojiRef}
            dropShadow="md"
            position="absolute"
            top={-334}
            right={4}
            overflow="clip">
            {showEmojiPicker ? (
              <Picker
                height={320}
                width={320}
                searchDisabled={true}
                onEmojiClick={handleEmojiClick}
              />
            ) : null}
          </Box>
          <IconButton
            type="submit"
            size="sm"
            icon={<BsArrowReturnLeft />}
            colorScheme="blue"
            variant="solid"
          />
        </Flex>
      </form>
    </Flex>
  );
}
