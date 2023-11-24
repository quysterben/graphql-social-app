import PropTypes from 'prop-types';
import { useRef } from 'react';

import { MdReport } from 'react-icons/md';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Textarea,
  ModalHeader,
  ModalFooter,
  Button,
  useDisclosure,
  useToast,
  MenuItem,
  Box
} from '@chakra-ui/react';

import { useMutation, gql } from '@apollo/client';
const REPORT_COMMENT_MUTATION = gql`
  mutation ReportComment($input: ReportCommentInput!) {
    reportComment(input: $input) {
      id
      reportedComment {
        id
        content
      }
      description
      reportUser {
        id
        name
      }
    }
  }
`;

ReportCommentMenuItem.propTypes = {
  commentId: PropTypes.bigint.required
};

export default function ReportCommentMenuItem({ commentId }) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const reportRef = useRef();

  const [reportComment] = useMutation(REPORT_COMMENT_MUTATION);
  const handleReportComment = async () => {
    if (reportRef.current.value.length < 10) {
      toast({
        title: 'Must be at least 10 characters long',
        status: 'error',
        isClosable: true,
        position: 'bottom-right'
      });
      return;
    }
    try {
      await reportComment({
        variables: {
          input: {
            reportedCommentId: commentId,
            description: reportRef.current.value
          }
        }
      });
      toast({
        title: 'Report post successfully',
        status: 'success',
        isClosable: true,
        position: 'bottom-right'
      });
      onClose();
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        isClosable: true,
        position: 'bottom-right'
      });
    }
  };

  return (
    <>
      <MenuItem
        onClick={() => {
          onOpen();
        }}
        icon={
          <Box color="yellow.600">
            <MdReport size={20} />
          </Box>
        }>
        Report
      </MenuItem>
      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea ref={reportRef} placeholder="Here is the description..." />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => handleReportComment()} colorScheme="red">
              Report
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
