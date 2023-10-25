import { Image } from '@chakra-ui/react';
import React from 'react';

import loader from '../../assets/loader.gif';

export default function Loader() {
  return <Image boxSize={120} src={loader}></Image>;
}
