"use client";

import { createApolloClient } from "@/clients/api";
import { ApolloProvider } from "@apollo/client/react";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export default function ProviderApollo({
  children,
}: {
  children: React.ReactNode;
}) {

  const { getToken, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading auth…</div>; // or a skeleton loader
  }

  const client = createApolloClient(getToken);

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}
