/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useRef, useEffect } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import { Flex, Image, Box } from '@chakra-ui/react';

export default function Images({ imageData }) {
  return (
    <Flex h="100vh" w="70%" bg="primary.100">
      <Swiper pagination={true} modules={[Pagination]}>
        {imageData.map((image, index) => (
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
