"use client";

import { createApolloClient } from "@/clients/api";
import { ApolloProvider } from "@apollo/client/react";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import Loader from "../loader";

export default function ProviderApollo({
  children,
}: {
  children: React.ReactNode;
}) {

  const { getToken, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen w-full bg-accent-foreground">
      <Loader state></Loader>
    </div>; 
  }

  const client = createApolloClient(getToken);

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}
