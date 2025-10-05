import { graphql } from "@/gql";

export const CREATE_CREDENTIAL = graphql(`
    mutation CreateCredential($payload: createCredentialPayload!) {
        createCredential(payload: $payload) 
    }
`);

export const DELETE_CREDENTIAL = graphql(`
    mutation DeleteCredential($id: ID!) {
        deleteCredential(id: $id)
    }
`);