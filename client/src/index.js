import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { ChakraProvider } from '@chakra-ui/react';
import theme from './styles/theme';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';

const authLink = setContext((_, { headers }) => {
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  return {
    headers: {
      'Apollo-Require-Preflight': 'true',
      ...headers,
      authorization: token ? token : ''
    }
  };
});

const httpLink = createUploadLink({
  uri: 'http://localhost:3301/api',
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      AllFriendRequest: {
        keyFields: ['id', 'status', 'user']
      }
    }
  })
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ChakraProvider resetCSS theme={theme}>
        <App />
      </ChakraProvider>
    </ApolloProvider>
  </React.StrictMode>
);
