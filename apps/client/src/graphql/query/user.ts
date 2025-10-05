import { graphql } from "@/gql";

export const CURRENT_USER = graphql(`
  query CurrentUser {
    getCurrentUser {
      id
    }
  }
`);

export const GET_CREDENTIALS = graphql(`
  query GetCredentials {
    getCredentials {
      id
      name
      value
    }
  }
`);

export const GET_CREDENTIAL = graphql(`
  query GetCredential($id: ID!) {
    getCredential(id: $id) {
      id
      name
      value
    }
  }
`);