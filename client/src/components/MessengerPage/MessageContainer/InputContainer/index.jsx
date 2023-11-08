import { Flex, Input, Box, IconButton } from '@chakra-ui/react';

import { AiOutlineSmile, AiOutlineUpload } from 'react-icons/ai';
import { BiSolidChevronRight } from 'react-icons/bi';

export default function InputContainer() {
  return (
    <Flex bg="white" w="full" h={16} borderRadius="xl" alignItems="center" p={4} gap={4}>
      <Input mx={8} bg="gray.100" placeholder="Enter message..." />
      <Box color="blue.600" cursor="pointer">
        <AiOutlineSmile size={30} />
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
    </Flex>
  );
}
