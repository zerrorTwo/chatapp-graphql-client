'use client';

import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import { LoadingProvider } from '@/app/context/loadingContext';
import GlobalLoading from '@/app/components/globalLoading';
import { Toaster } from 'sonner';
import createApolloClient from '@/app/graphql/apollo-client';

// Khởi tạo Apollo Client singleton
const client = createApolloClient();

export default function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={client}>
        <LoadingProvider>
          <GlobalLoading />
          {children}
          <Toaster richColors />
        </LoadingProvider>
    </ApolloProvider>
  );
}