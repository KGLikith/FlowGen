export const queries = `#graphql
    getUserByClerkId(clerkId: String!): User
    getCurrentUser: User
    getWorkflows: [Workflow!]!
    getWorkflow(id: ID!): Workflow
`;