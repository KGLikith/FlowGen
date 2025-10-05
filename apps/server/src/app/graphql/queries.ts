export const queries = `#graphql
    getUserByClerkId(clerkId: String!): User
    getCurrentUser: User
    getWorkflows: [Workflow!]
    getWorkflow(id: ID!): Workflow
    getAvailableTriggers: [AvailableTrigger!]!
    getAvailableActions: [AvailableAction!]!
    getAvailableActionsForTrigger(triggerId: ID!): ActionsAndTrigger!
    getWorkflowExecutions(workflowId: ID!): [WorkflowExecution!]
    getWorkflowExecution(executionId: ID!): WorkflowExecution
    getExecutionPhaseDetails(phaseId: ID!): ExecutionPhase
    getCredentials: [Credential!]
    getCredential(id: ID!): Credential
`;