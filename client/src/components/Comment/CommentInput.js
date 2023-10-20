/* eslint-disable react/prop-types */
import { useRef, useState } from 'react';

import { Flex, Avatar, Input, Box, IconButton } from '@chakra-ui/react';
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

export default function CommentInput({ userData, postId, refetch }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const inputRef = useRef('');
  const handleEmojiClick = (emojiObject) => {
    let data = inputRef.current.value;
    data += emojiObject.emoji;
    inputRef.current.value = data;
  };

  const [createComment] = useMutation(CREATE_COMMENT);
  const handleCreateComment = async () => {
    if (inputRef.current.value.length < 4) {
      return;
    }
    try {
      const res = createComment({
        variables: {
          input: {
            content: inputRef.current.value,
            parentId: 0,
            postId: postId
          }
        }
      });
      inputRef.current.value = '';
      refetch();
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex p={4} gap={4} alignItems="center">
      <Link to={'/profile/' + userData.id}>
        <Avatar size="sm" src={userData.avatar} name={userData.name} />
      </Link>
      <Flex gap={4} w="100%" position="relative" alignItems="center">
        <Input ref={inputRef} w="80%" />
        <AiOutlineSmile onClick={handleEmojiPickerHideShow} size={30} />
        <Box dropShadow="md" position="absolute" top={-410} right={0}>
          {showEmojiPicker ? (
            <Picker
              height={400}
              width={320}
              searchDisabled={true}
              onEmojiClick={handleEmojiClick}
            />
          ) : null}
        </Box>
        <IconButton
          onClick={handleCreateComment}
          size="sm"
          icon={<BsArrowReturnLeft />}
          colorScheme="blue"
          variant="solid"
        />
      </Flex>
    </Flex>
  );
}
