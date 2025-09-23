import { graphql } from "@/gql"

export const CREATE_WORKFLOW = graphql(`
    #graphql
    mutation CreateWorkflow($payload: createWorkflowPayload!) {
        createWorkflow(payload: $payload) {
            id
            name
            status
            definition
            description
            createdAt
            updatedAt
            creditsCost
            lastRunAt
            lastRunId
            nextRunAt
            userId
        }
    }
`)

export const DELETE_WORKFLOW = graphql(`
    #graphql
    mutation DeleteWorkflow($id: ID!) {
        deleteWorkflow(id: $id)
    }
`)

export const UPDATE_WORKFLOW = graphql(`
    #graphql
    mutation UpdateWorkflow($id: ID!, $payload: updateWorkflowPayload!) {
        updateWorkflow(id: $id, payload: $payload)
    }
`)