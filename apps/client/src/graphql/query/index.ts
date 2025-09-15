import { graphql } from "@/gql";

export const HELLO_QUERY = graphql(
  `
    query Hello {
      hello
    }
  `
);
