import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    primary: {
      0: '#e7f5ff',
      100: '#d0ebff',
      200: '#a5d8ff',
      300: '#74c0fc',
      400: '#4dabf7',
      500: '#339af0',
      600: '#228be6',
      700: '#1c7ed6',
      800: '#1971c2',
      900: '#1864ab'
    },
    gray: {
      400: '#ced4da',
      500: '#adb5bd',
      600: '#868e96'
    }
  }
});

export default theme;
