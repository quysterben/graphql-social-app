/* eslint-disable react/prop-types */
import {
  Box,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  useToast
} from '@chakra-ui/react';

import { BiEditAlt } from 'react-icons/bi';
import { useFormik } from 'formik';

import * as Yup from 'yup';
import { useRef } from 'react';
import moment from 'moment';

const userInfoSchema = Yup.object().shape({
  from: Yup.string().min(3, 'Invalid!').max(70, 'Invalid!').required(),
  username: Yup.string().min(2).max(100).required()
});

import { useMutation, gql } from '@apollo/client';
const UPDATE_USER_DATE = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      name
      email
      dateOfBirth
      from
      role
      avatar
      wallpaper
    }
  }
`;

export default function EditProfile({ infoData, updateUserStorageData, refetch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const dateInputRef = useRef();
  const formik = useFormik({
    initialValues: {
      from: infoData.from,
      username: infoData.name
    },
    validationSchema: userInfoSchema
  });

  const [updateUserData] = useMutation(UPDATE_USER_DATE);

  const handleUpdateInfo = async () => {
    const date = moment(dateInputRef.current.value).format('YYYY-MM-DD');

    try {
      const res = await updateUserData({
        variables: {
          input: {
            dateOfBirth: date,
            from: formik.values.from,
            name: formik.values.username,
            userId: infoData.id
          }
        }
      });
      updateUserStorageData(res.data.updateUser);
      onClose();
      refetch();
    } catch (err) {
      toast({
        title: 'Invalid Data',
        description: err.message,
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right'
      });
    }
  };

  const handleClose = async () => {
    onClose();
    formik.resetForm();
  };

  return (
    <>
      <Box onClick={onOpen} color="primary.400" cursor="pointer" pos="absolute" right={4} top={6}>
        <BiEditAlt size={16} />
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update info</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={formik.errors.username && formik.touched.username}>
              <FormLabel>Username</FormLabel>
              <Input
                w="100%"
                id="username"
                type="text"
                name="username"
                placeholder="username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
              <FormErrorMessage mb="1rem">{formik.errors.username}</FormErrorMessage>
            </FormControl>
            <FormControl mt={2} isInvalid={formik.errors.from && formik.touched.from}>
              <FormLabel>From</FormLabel>
              <Input
                w="100%"
                id="from"
                type="text"
                name="from"
                placeholder="from"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.from}
              />
              <FormErrorMessage mb="1rem">{formik.errors.from}</FormErrorMessage>
            </FormControl>
            <FormControl mt={2}>
              <FormLabel>Date Of Birth</FormLabel>
              <Input
                type="date"
                ref={dateInputRef}
                defaultValue={moment(infoData.dateOfBirth).format('YYYY-MM-DD')}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={handleClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={handleUpdateInfo}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
