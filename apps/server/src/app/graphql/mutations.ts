export const mutations = `#graphql
    createWorkflow(payload: createWorkflowPayload!): createWorkflowResponse
    deleteWorkflow(id: ID!): Boolean!
    updateWorkflow(id: ID!, payload: updateWorkflowPayload!): Boolean!
    runWorkflow(form: runWorkflowPayload!): WorkflowExecution
`