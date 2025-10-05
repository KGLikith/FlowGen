export const mutations = `#graphql
    createWorkflow(payload: createWorkflowPayload!): createWorkflowResponse
    deleteWorkflow(id: ID!): Boolean!
    updateWorkflow(id: ID!, payload: updateWorkflowPayload!): Boolean!
    publishWorkflow(form: runWorkflowPayload!): Boolean!
    unpublishWorkflow(id: ID!): Boolean!
    runWorkflow(form: runWorkflowPayload!): WorkflowExecution
    updateWorkflowCron(workflowId: ID!, cron: String!): Boolean!
    deleteWorkflowCron(workflowId: ID!): Boolean!
    createCredential(payload: createCredentialPayload!): Boolean!
    deleteCredential(id: ID!): Boolean!
`