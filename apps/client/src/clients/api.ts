"use client";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";


const createApolloClient = () => {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
  });

  const authLink = new SetContextLink(() => {
    const token = window.localStorage.getItem("__twitter_token");
    return {
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });


  const splitLink = authLink.concat(httpLink);

  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });

  return client;
};


export const apolloClient = createApolloClient();
