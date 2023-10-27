import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { ChakraProvider } from '@chakra-ui/react';
import theme from './styles/theme';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

import moment from 'moment';
moment.locale('vi');

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
  uri: 'http://localhost:3301/api'
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:3301/subscriptions',
    connectionParams: () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      return {
        Authorization: token ? token : ''
      };
    }
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: authLink.concat(splitLink),
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
  <ApolloProvider client={client}>
    <ChakraProvider resetCSS theme={theme}>
      <App />
    </ChakraProvider>
  </ApolloProvider>
);
