import { graphql } from "@/gql"

export const createWorkflowMutation = graphql(`
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

export const deleteWorkflowMutation = graphql(`
    #graphql
    mutation DeleteWorkflow($id: ID!) {
        deleteWorkflow(id: $id)
    }
`)