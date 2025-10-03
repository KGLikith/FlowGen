import { graphql } from "@/gql"

export const CREATE_WORKFLOW = graphql(`
    #graphql
    mutation CreateWorkflow($payload: createWorkflowPayload!) {
        createWorkflow(payload: $payload) {
            id
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

export const RUN_WORKFLOW = graphql(`
    #graphql
    mutation RunWorkflow($form: runWorkflowPayload!) {
        runWorkflow(form: $form) {
            id
        }
    }
`)

export const PUBLISH_WORKFLOW = graphql(`
    #graphql
    mutation PublishWorkflow($form: runWorkflowPayload!) {
        publishWorkflow(form: $form) 
    }
`)

export const UNPUBLISH_WORKFLOW = graphql(`
    #graphql
    mutation UnpublishWorkflow($id: ID!) {
        unpublishWorkflow(id: $id)
    }
`)

export const UPDATE_WORKFLOW_CRON = graphql(`
    #graphql
    mutation UpdateWorkflowCron($workflowId: ID!, $cron: String!) {
        updateWorkflowCron(workflowId: $workflowId, cron: $cron)
    }
`)

export const DELETE_WORKFLOW_CRON = graphql(`
    #graphql
    mutation DeleteWorkflowCron($workflowId: ID!) {
        deleteWorkflowCron(workflowId: $workflowId)
    }
`)

