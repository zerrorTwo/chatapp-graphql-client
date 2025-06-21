import { ApolloClient, InMemoryCache } from '@apollo/client';

const createApolloClient = () => {
  return new ApolloClient({
    uri: process.env.BE_URL,
    cache: new InMemoryCache(),
    credentials: 'include',
  });
};

export default createApolloClient;