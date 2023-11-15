/* eslint-disable react/prop-types */
import { Avatar, AvatarGroup, Tooltip } from '@chakra-ui/react';

import moment from 'moment';

export default function SeenUserList({ seenUserList }) {
  const handleTime = (timestampz) => {
    const time = moment(timestampz).format('HH:mm a DD/MM/yyyy');
    return time.toString();
  };

  return (
    <AvatarGroup mt={2} mr={4} gap={0.5} size="xs" max={4} cursor="pointer" justifyContent="end">
      {seenUserList.map((param, index) => (
        <Tooltip
          placement="left-start"
          bg="gray.500"
          key={index}
          label={`${param.user.name} seen at ${handleTime(param.seenAt)}`}>
          <Avatar size="xs" name={param.user.name} src={param.user.avatar} />
        </Tooltip>
      ))}
    </AvatarGroup>
  );
}
