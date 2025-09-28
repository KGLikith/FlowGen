"use client";

import { createApolloClient } from "@/clients/api";
import { ApolloProvider } from "@apollo/client/react";
import { useAuth } from "@clerk/nextjs";
import LoaderIc from "../loader";

export default function ProviderApollo({
  children,
}: {
  children: React.ReactNode;
}) {

  const { getToken, isLoaded } = useAuth();

  if (!isLoaded) {
    return <LoaderIc />;
  }

  const client = createApolloClient(getToken);

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}
