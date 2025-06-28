import {
  ApolloClient,
  from,
  gql,
  HttpLink,
  InMemoryCache,
  Observable,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { LOGIN_MUTATION } from "./mutations/login.mutation";

let apolloClient: ApolloClient<unknown> | null = null;

// Store for the access token (in-memory or localStorage)
const TOKEN_KEY = "access_token";

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
      throw new Error("Không nhận được access token mới.");
    }

    // Store the new access token in localStorage
    localStorage.setItem(TOKEN_KEY, newAccessToken);
    return newAccessToken;
  } catch (err) {
    throw new Error("Lỗi khi làm mới access token.");
  }
}

// New function to store access token after login
async function storeAccessTokenAfterLogin(loginData: any) {
  try {
    const accessToken = loginData?.accessToken || loginData?.accessToken; // Adjust based on your mutation response structure
    if (!accessToken) {
      throw new Error("Không nhận được access token từ đăng nhập.");
    }

    // Store the access token in localStorage
    localStorage.setItem(TOKEN_KEY, accessToken);
    return accessToken;
  } catch (err) {
    console.error("Lỗi khi lưu access token:", err);
    throw new Error("Lỗi khi lưu access token sau đăng nhập.");
  }
}

let retryCount = 0;
const maxRetry = 3;

const authLink = setContext(async ({ operationName }, { headers }) => {
  if (operationName === "Login" || operationName === "GgLogin") {
    return { headers };
  }

  // Retrieve the access token from localStorage
  const accessToken = localStorage.getItem(TOKEN_KEY);

  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
});

const createErrorLink = (client: ApolloClient<unknown>) =>
  onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
      console.log(graphQLErrors);

      for (const err of graphQLErrors) {
        if (
          operation.operationName === "Login" ||
          operation.operationName === "GgLogin"
        ) {
          return forward(operation);
        }

        if (
          err.extensions?.code === "UNAUTHENTICATED" &&
          retryCount < maxRetry
        ) {
          retryCount++;
          return new Observable((observer) => {
            refreshToken(client)
              .then((newAccessToken) => {
                operation.setContext(
                  ({ headers }: { headers: Record<string, string> }) => ({
                    headers: {
                      ...headers,
                      authorization: `Bearer ${newAccessToken}`,
                    },
                  })
                );
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
                if (error.message.includes("Refresh token not found")) {
                  // Clear the access token on refresh failure
                  localStorage.removeItem(TOKEN_KEY);
                }
              });
          });
        }
      }
    }
  });

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_BE_URL,
  credentials: "include",
});

const createApolloClient = () => {
  if (!apolloClient) {
    apolloClient = new ApolloClient({
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "no-cache",
          errorPolicy: "ignore",
        },
        query: {
          fetchPolicy: "no-cache",
          errorPolicy: "all",
        },
      },
    });

    const errorLink = createErrorLink(apolloClient);
    apolloClient.setLink(from([errorLink, authLink, httpLink]));
  }
  return apolloClient;
};

// Function to perform login and store the access token

export async function performLogin(email: string, password: string) {
  const client = createApolloClient();

  try {
    const { data } = await client.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
    });

    console.log("[LOGIN DATA]:", data);

    if (!data?.login?.accessToken) {
      throw new Error("Không nhận được accessToken");
    }

    await storeAccessTokenAfterLogin(data.login);
    return data.login;
  } catch (err) {
    console.error("Lỗi khi đăng nhập:", err);
    throw new Error("Đăng nhập thất bại.");
  }
}

// Optional: Function to clear the access token on logout
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export default createApolloClient;
