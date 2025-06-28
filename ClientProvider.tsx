"use client";

import { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client";
import { LoadingProvider } from "@/app/context/loadingContext";
import GlobalLoading from "@/app/components/globalLoading";
import { Toaster } from "sonner";
import createApolloClient from "@/app/graphql/apollo-client";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Khởi tạo Apollo Client singleton
const client = createApolloClient();

export default function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <ApolloProvider client={client}>
        <LoadingProvider>
          <GlobalLoading />
          {children}
          <Toaster richColors />
        </LoadingProvider>
      </ApolloProvider>
    </GoogleOAuthProvider>
  );
}
