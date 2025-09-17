import { graphql } from "@/gql";

export const CURRENT_USER = graphql(`
  query CurrentUser {
    getCurrentUser {
      id
    }
  }
`);
