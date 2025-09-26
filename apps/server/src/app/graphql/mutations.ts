export const mutations = `#graphql
    createWorkflow(payload: createWorkflowPayload!): Workflow!
    deleteWorkflow(id: ID!): Boolean!
    updateWorkflow(id: ID!, payload: updateWorkflowPayload!): Boolean!
    runWorkflow(form: runWorkflowPayload!): WorkflowExecution!
    initializeWorkflowExecution(executionId: ID!, workflowId: ID!): Boolean!
`