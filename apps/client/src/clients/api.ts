"use client";

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { useAuth } from "@clerk/nextjs";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { Client, createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";


let wsClient: Client | null = null;

export const createApolloClient = (getToken: () => Promise<string | null>) => {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
  });

  const authLink = new SetContextLink(async (prevContext, operation) => {
    if (typeof window === "undefined") return {};

    const token = await (window as any).Clerk?.session?.getToken();
    // const token = await getToken(); 
    return {
      ...prevContext,
      headers: {
        ...(prevContext.headers || {}),
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const wsLink =
    typeof window !== "undefined"
      ? new GraphQLWsLink(
          (wsClient = createClient({
            url: process.env.NEXT_PUBLIC_WS_URL!,
            connectionParams: async () => {
              const token = await (window as any).Clerk?.session?.getToken();
              return {
                headers: {
                  authorization: token ? `Bearer ${token}` : "",
                },
              };
            },
          }))
        )
      : null;

    const splitLink = wsLink
    ? ApolloLink.split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        authLink.concat(httpLink)
      )
    : authLink.concat(httpLink);

  return new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
  });
};

export function useApollo() {
  const { getToken } = useAuth();
  return createApolloClient(getToken);
}

export const client = createApolloClient(async () => null);