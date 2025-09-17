import { graphql } from "@/gql";


export const GET_WORKFLOWS = graphql(`
    query GetWorkflows{
        getWorkflows{
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
`);

export const GET_WORKFLOW = graphql(`
    query GetWorkflow($id: ID!){
        getWorkflow(id: $id){
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
`);