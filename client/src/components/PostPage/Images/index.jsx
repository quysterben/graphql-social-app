/* eslint-disable react/prop-types */
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import { Flex, Image } from '@chakra-ui/react';

import { gql, useQuery } from '@apollo/client';
const GET_SINGLE_POST = gql`
  query GetSinglePost($input: SinglePostInput!) {
    getSinglePost(input: $input) {
      id
      images {
        id
        imageUrl
      }
    }
  }
`;

export default function Images({ postId }) {
  const { loading, data, error } = useQuery(GET_SINGLE_POST, {
    variables: {
      input: {
        postId: postId
      }
    }
  });
  if (error) console.log(error);

  return (
    <Flex h="100vh" w="70%" bg="gray.100">
      <Swiper pagination={true} modules={[Pagination]}>
        {loading
          ? null
          : data.getSinglePost.images.map((image, index) => (
              <SwiperSlide key={index}>
                <Flex justifyContent="center" h="100vh" alignItems="center">
                  <Image my={14} src={image.imageUrl} alt="..." />
                </Flex>
              </SwiperSlide>
            ))}
      </Swiper>
    </Flex>
  );
}
