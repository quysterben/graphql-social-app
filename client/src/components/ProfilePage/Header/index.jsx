/* eslint-disable react/prop-types */
import { useRef, useState } from 'react';

import { BsCamera } from 'react-icons/bs';
import { MdReport } from 'react-icons/md';

import {
  Flex,
  Image,
  Button,
  Avatar,
  Heading,
  Box,
  IconButton,
  Textarea,
  useToast
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';

const defaultWpUrl =
  'https://w0.peakpx.com/wallpaper/868/430/HD-wallpaper-social-networks-blue-background-social-networks-icons-blue-light-globe-global-networks-social-networks-blue-background-social-networks-concepts.jpg';

import { gql, useQuery, useMutation } from '@apollo/client';
import FriendButton from '../../FriendButton';
const GET_FRIEND_STATUS = gql`
  query GetFriendStatus($input: FriendRelationInput!) {
    getFriendStatus(input: $input) {
      id
      status
      from
      user {
        id
        name
        email
        dateOfBirth
        from
        avatar
        wallpaper
        createdAt
      }
    }
  }
`;
const UPLOAD_WALLPAPER = gql`
  mutation UploadWallpaper($file: Upload!) {
    uploadWallpaper(file: $file) {
      id
      name
      email
      dateOfBirth
      from
      avatar
      role
      wallpaper
      createdAt
    }
  }
`;
const UPLOAD_AVATAR = gql`
  mutation UploadAvatar($file: Upload!) {
    uploadAvatar(file: $file) {
      id
      name
      email
      dateOfBirth
      from
      avatar
      role
      wallpaper
      createdAt
    }
  }
`;
const REPORT_USER_MUTAION = gql`
  mutation ReportUser($input: ReportUserInput!) {
    reportUser(input: $input) {
      id
      reportedUser {
        id
        name
      }
      description
      reportUser {
        id
        name
      }
    }
  }
`;

import ImageUploading from 'react-images-uploading';
import Loader from '../../Loader';

export default function Header({ infoData, userData, refetchUserData, updateUserStorageData }) {
  const toast = useToast();
  const [uploadWallpaper] = useMutation(UPLOAD_WALLPAPER);
  const [uploadAvatar] = useMutation(UPLOAD_AVATAR);
  const { loading, error, data, refetch } = useQuery(GET_FRIEND_STATUS, {
    fetchPolicy: 'network-only',
    variables: {
      input: {
        userId: infoData.getOneUser.id
      }
    }
  });
  if (error) console.log(error);

  const [loadingWallpaper, setIsLoadingWallpaper] = useState(false);
  const maxNumber = 1;
  const onChangeWallpaperData = async (imageList) => {
    try {
      setIsLoadingWallpaper(true);
      const file = imageList[0].file;
      const res = await uploadWallpaper({
        variables: {
          file: file
        }
      });
      updateUserStorageData(res.data.uploadWallpaper);
      toast({
        title: 'Upload wallpaper successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right'
      });
      setIsLoadingWallpaper(false);
      refetchUserData();
    } catch (err) {
      toast({
        title: 'Upload wallpaper failed',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right'
      });
      setIsLoadingWallpaper(false);
    }
  };

  const [loadingAvatar, setIsLoadingAvatar] = useState(false);
  const onChangeAvatarData = async (imageList) => {
    try {
      setIsLoadingAvatar(true);
      const file = imageList[0].file;
      const res = await uploadAvatar({
        variables: {
          file: file
        }
      });
      updateUserStorageData(res.data.uploadAvatar);
      setIsLoadingAvatar(false);
      refetchUserData();
      toast({
        title: 'Upload avatar successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right'
      });
    } catch (err) {
      setIsLoadingAvatar(false);
      toast({
        title: 'Upload avatar failed',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right'
      });
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const reportRef = useRef();
  const [reportUser] = useMutation(REPORT_USER_MUTAION);
  const handleReportUser = async () => {
    try {
      await reportUser({
        variables: {
          input: {
            description: reportRef.current.value,
            reportedUserId: infoData.getOneUser.id
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
    <Flex mt={16} w="100" alignContent="center" justifyContent="center">
      <Flex
        alignItems="center"
        justifyContent="center"
        w="70%"
        h={340}
        overflow="hidden"
        position="relative">
        <Image width="100%" src={infoData.getOneUser.wallpaper || defaultWpUrl} />
        <Flex bottom={4} right={4} position="absolute" gap={4}>
          {loading || infoData.getOneUser.id == userData.id ? null : (
            <Flex gap={4}>
              <FriendButton
                friendStatus={data.getFriendStatus}
                userData={userData}
                refetch={refetch}
              />
              <IconButton
                variant="ghost"
                color="red.600"
                size="sm"
                onClick={onOpen}
                _hover={{ bgColor: 'yellow' }}
                icon={<MdReport size={28} />}
              />
            </Flex>
          )}
          {userData.id == infoData.getOneUser.id ? (
            <ImageUploading
              maxFileSize={5242880}
              onChange={onChangeWallpaperData}
              maxNumber={maxNumber}
              dataURLKey="data_url">
              {({ onImageUpload, dragProps }) => (
                <Box mt={4}>
                  <Button
                    isLoading={loadingWallpaper}
                    mr="4"
                    colorScheme="teal"
                    leftIcon={<BsCamera />}
                    onClick={onImageUpload}
                    {...dragProps}>
                    Upload wallpaper
                  </Button>
                </Box>
              )}
            </ImageUploading>
          ) : null}
        </Flex>
        <Flex bottom={4} left={16} gap={4} position="absolute" alignItems="center">
          {userData.id == infoData.getOneUser.id ? (
            <ImageUploading
              maxFileSize={5242880}
              onChange={onChangeAvatarData}
              maxNumber={maxNumber}
              dataURLKey="data_url">
              {({ onImageUpload, dragProps }) => (
                <Box mt={4}>
                  {loadingAvatar ? (
                    <Avatar
                      cursor="pointer"
                      border="4px"
                      color="white"
                      size="2xl"
                      src={<Loader />}
                      name={infoData.getOneUser.name}
                    />
                  ) : (
                    <Avatar
                      cursor="pointer"
                      border="4px"
                      color="white"
                      size="2xl"
                      src={infoData.getOneUser.avatar}
                      name={infoData.getOneUser.name}
                      onClick={onImageUpload}
                      {...dragProps}
                    />
                  )}
                </Box>
              )}
            </ImageUploading>
          ) : (
            <Avatar
              border="4px"
              color="white"
              size="2xl"
              src={infoData.getOneUser.avatar}
              name={infoData.getOneUser.name}
            />
          )}
          <Heading mt={12} color="white">
            {infoData.getOneUser.name}
          </Heading>
        </Flex>
      </Flex>

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
            <Button onClick={() => handleReportUser()} colorScheme="red">
              Report
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
