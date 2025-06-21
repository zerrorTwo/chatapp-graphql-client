import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { LOGIN_MUTATION } from '@/app/graphql/mutations/login.mutation';
import createApolloClient from '@/app/graphql/apollo-client';
import { ApolloError } from '@apollo/client';
import { CustomCredentialsError } from '@/app/utils/CustomCredentialsError';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          type: 'email',
          label: 'Email',
          placeholder: 'hoangthiennam@gmail.com',
        },
        password: {
          type: 'password',
          label: 'Password',
          placeholder: '*****',
        },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;
        const client = createApolloClient();
        try {
          const { data } = await client.mutate({
            mutation: LOGIN_MUTATION,
            variables: { email, password },
          });

          const loginData = data?.login;

          if (!loginData?.user || !loginData.accessToken) {
            throw new CustomCredentialsError('Invalid credentials', 'invalid_credentials');
          }

          const user = {
            id: loginData.user.id,
            email: loginData.user.email,
            name: loginData.user.username,
            accessToken: loginData.accessToken,
          };

          return user;
        } catch (error) {
          if (error instanceof ApolloError) {
            const gqlError = error.graphQLErrors?.[0];
            const actualMessage =
              gqlError?.extensions?.message || gqlError?.message || 'Unknown error';
            console.log('GraphQL Error:', actualMessage); // Debug log
            throw new CustomCredentialsError(String(actualMessage), 'graphql_error'); // Ném lỗi tùy chỉnh
          }
          console.log('Non-GraphQL Error:', error); // Debug log
          throw new CustomCredentialsError('Login failed', 'unknown_error');
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = (user as any).accessToken;

      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = {
          email: token.email ?? '',
          name: token.name,
          accessToken: token.accessToken,
        } as any;
      }
      return session;
    },
  },
  logger: {
    error(error) { // Chỉ nhận một đối số là Error
      if (error.name !== 'CredentialsSignin') {
        console.error('[AUTH_ERROR]', error.message);
      }
    },
  },
});
