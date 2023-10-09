import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { ChakraProvider } from '@chakra-ui/react';
import theme from './styles/theme';

import { store } from './redux/store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);
