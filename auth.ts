import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { GOOGLE_LOGIN_MUTATION, LOGIN_MUTATION } from '@/app/graphql/mutations/login.mutation';
import createApolloClient from '@/app/graphql/apollo-client';
import { ApolloError } from '@apollo/client';
import { CustomCredentialsError } from '@/app/utils/CustomCredentialsError';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email', label: 'Email', placeholder: 'hoangthiennam@gmail.com' },
        password: { type: 'password', label: 'Password', placeholder: '*****' },
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

          console.log('Login data:', loginData); // Debug log

          if (!loginData?.user || !loginData.accessToken) {
            throw new CustomCredentialsError('Invalid credentials', 'invalid_credentials');
          }

          return {
            id: loginData.user.id,
            email: loginData.user.email,
            name: loginData.user.username,
            accessToken: loginData.accessToken,
            refreshToken: loginData.refreshToken,
          };
        } catch (error) {
          if (error instanceof ApolloError) {
            const gqlError = error.graphQLErrors?.[0];
            const actualMessage =
              gqlError?.extensions?.message || gqlError?.message || 'Unknown error';
            console.log('GraphQL Error:', actualMessage);
            throw new CustomCredentialsError(String(actualMessage), 'graphql_error');
          }
          console.log('Non-GraphQL Error:', error);
          throw new CustomCredentialsError('Login failed', 'unknown_error');
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        if (account.provider === 'google') {
          console.log('Google user data:', { email: user.email, googleId: user.id, name: user.name }); // Debug
          const client = createApolloClient();
          try {
            const { data, errors } = await client.mutate({
              mutation: GOOGLE_LOGIN_MUTATION,
              variables: {
                email: user.email || '',
                googleId: user.id || '',
                name: user.name || '',
              },
            });

            if (errors) {
              console.error('GraphQL errors:', errors);
              throw new Error(`Google login failed: ${errors[0]?.message || 'Unknown error'}`);
            }

            const loginData = data?.ggLogin;


            if (!loginData?.user || !loginData.accessToken) {
              throw new Error('Không thể xác thực user Google');
            }

            token.id = loginData.user.id;
            token.email = loginData.user.email;
            token.name = loginData.user.userName; // Đồng bộ với userName
            token.accessToken = loginData.accessToken;
            token.refreshToken = loginData.refreshToken; // Lưu refresh token nếu cần
          } catch (error) {
            console.error('Google auth error:', error);
            throw new Error(`Đăng nhập Google thất bại: ${error || 'Unknown error'}`);
          }
        } else if (account.provider === 'credentials') {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.accessToken = (user as any).accessToken;
          token.refreshToken = (user as any).refreshToken; // Lưu refresh token nếu cần
        }
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
    async redirect({ url, baseUrl }) {
      if (url.includes('/login')) {
        return baseUrl;
      }
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      return baseUrl;
    },
  },
  logger: {
    error(error) {
      if (error.name !== 'CredentialsSignin') {
        console.error('[AUTH_ERROR]', error.message);
      }
    },
  },
});