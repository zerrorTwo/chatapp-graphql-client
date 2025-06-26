import { ApolloClient, from, gql, HttpLink, InMemoryCache, Observable } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { getSession, signOut } from 'next-auth/react';

let apolloClient: ApolloClient<unknown> | null = null;

async function refreshToken(client: ApolloClient<unknown>) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
          mutation RefreshToken {
              refreshToken
          }
      `,
    });

    const newAccessToken = data?.refreshToken;
    if (!newAccessToken) {
      throw new Error('Không nhận được access token mới.');
    }

    const session = await getSession();
    if (session) {
      await fetch('/api/auth/session', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: newAccessToken }),
      });
    }
    return newAccessToken;
  } catch (err) {
    throw new Error('Lỗi khi làm mới access token.');
  }
}

let retryCount = 0;
const maxRetry = 3;

const authLink = setContext(async ({ operationName }, { headers }) => {
  if (operationName === 'Login' || operationName === 'GgLogin') {
    return { headers };
  }

  const session = await getSession();
  const accessToken = (session?.user as any)?.accessToken;

  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});

const createErrorLink = (client: ApolloClient<unknown>) =>
  onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (operation.operationName === 'Login' || operation.operationName === 'GgLogin') {
          return forward(operation);
        }

        if (err.extensions?.code === 'UNAUTHENTICATED' && retryCount < maxRetry) {
          retryCount++;
          return new Observable((observer) => {
            refreshToken(client)
              .then((newAccessToken) => {
                operation.setContext(({ headers }: { headers: Record<string, string> }) => ({
                  headers: {
                    ...headers,
                    authorization: `Bearer ${newAccessToken}`,
                  },
                }));
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                };
                forward(operation).subscribe(subscriber);
              })
              .catch((error) => {
                observer.error(error);
                retryCount = 0;
                if (error.message.includes('Refresh token not found')) {
                  signOut();
                }
              });
          });
        }
      }
    }
  });

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_BE_URL,
  credentials: 'include',
});

const createApolloClient = () => {
  if (!apolloClient) {
    apolloClient = new ApolloClient({
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore',
        },
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
      },
    });

    const errorLink = createErrorLink(apolloClient);
    apolloClient.setLink(from([errorLink, authLink, httpLink]));
  }
  return apolloClient;
};

export default createApolloClient;