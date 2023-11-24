import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ReportCommentMenuItem from './ReportCommentMenuItem';

import { Flex, Avatar, Text, Menu, MenuButton, MenuList, MenuItem, Box } from '@chakra-ui/react';
import { BsThreeDots, BsFillTrashFill } from 'react-icons/bs';
import { AiOutlineEdit } from 'react-icons/ai';

import moment from 'moment';
const handleTime = (createdAt) => {
  const time = moment(createdAt).fromNow();
  return time;
};

ChildComment.propTypes = {
  child: PropTypes.object.isRequired,
  handleSetIsReply: PropTypes.func.isRequired,
  handleDeleteComment: PropTypes.func.isRequired
};

export default function ChildComment({ child, handleSetIsReply, handleDeleteComment }) {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Flex ml={6} flexDir="column" gap={2}>
      <Flex gap={2} justifyContent="space-between">
        <Flex gap={2}>
          <Link to={'/profile/' + child.author.id}>
            <Avatar size="sm" src={child.author.avatar} name={child.author.name} />
          </Link>
          <Flex flexDirection="column">
            <Text fontSize="smaller" fontWeight="bold">
              {child.author.name}
            </Text>
            <Text fontSize="xx-small" fontStyle="italic">
              {handleTime(child.createdAt)}
            </Text>
          </Flex>
        </Flex>
        <Flex alignItems="center" mr={2}>
          <Menu>
            <MenuButton onClick={() => handleSetIsReply(false)}>
              <BsThreeDots />
            </MenuButton>
            <MenuList>
              {user.id !== child.author.id ? null : (
                <>
                  <MenuItem
                    icon={
                      <Box>
                        <AiOutlineEdit size={20} />
                      </Box>
                    }>
                    Edit
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleDeleteComment(child.id)}
                    icon={
                      <Box color="red.600">
                        <BsFillTrashFill size={20} />
                      </Box>
                    }>
                    Delete
                  </MenuItem>
                </>
              )}
              {user.id === child.author.id ? null : <ReportCommentMenuItem commentId={child.id} />}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Box bg="gray.100" borderRadius="md">
        <Text mx={2} p={2}>
          {child.content}
        </Text>
      </Box>
    </Flex>
  );
}
