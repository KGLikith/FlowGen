export const queries = `#graphql
    getUserByClerkId(clerkId: String!): User
    getCurrentUser: User
    getWorkflows: [Workflow!]!
    getWorkflow(id: ID!): Workflow
    getAvailableTriggers: [AvailableTrigger!]!
    getAvailableActions: [AvailableAction!]!
    getAvailableActionsForTrigger(triggerId: ID!): [AvailableAction!]!
    getWorkflowExecution(executionId: ID!): WorkflowExecution
    getExecutionPhaseDetails(phaseId: ID!): ExecutionPhase
`;