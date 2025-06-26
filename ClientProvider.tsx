'use client';

import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import { SessionProvider } from 'next-auth/react';
import { LoadingProvider } from '@/app/context/loadingContext';
import GlobalLoading from '@/app/components/globalLoading';
import { Toaster } from 'sonner';
import createApolloClient from '@/app/graphql/apollo-client';

// Khởi tạo Apollo Client singleton
const client = createApolloClient();

export default function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider>
        <LoadingProvider>
          <GlobalLoading />
          {children}
          <Toaster richColors />
        </LoadingProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}