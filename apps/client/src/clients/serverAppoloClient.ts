import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import fetch from "cross-fetch";
import { auth } from "@clerk/nextjs/server";

export const createServerApolloClient = async () => {
  const { getToken } = await auth(); 
  const token = await getToken();
  return new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_API_URL,
      fetch,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }),
    cache: new InMemoryCache(),
  });
};
