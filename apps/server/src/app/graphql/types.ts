export const types = `#graphql

type User {
  id: ID!
  clerkId: String
  createdAt: DateTime
  updatedAt: DateTime

  userBalance: UserBalance
  workflows: [Workflow!]
  workflowExecutions: [WorkflowExecution!]
  executionPhases: [ExecutionPhase!]
  credentials: [Credential!]
  purchases: [UserPurchase!]

  connections: [Connections!]
  discord: [DiscordWebhook!]
  slack: [Slack!]
  notion: [Notion!]
  googleDocs: [GoogleDocs!]
}

type UserBalance {
  id: ID!
  userId: String!
  credits: Int!
}

type Workflow {
  id: ID!
  userId: String
  name: String!
  description: String
  definition: String
  executionPlan: String
  cron: String
  status: WorkflowStatus!
  creditsCost: Int!
  lastRunAt: DateTime
  lastRunId: String
  lastRunStatus: String
  nextRunAt: DateTime
  createdAt: DateTime
  updatedAt: DateTime

  executions: [WorkflowExecution!]
}

enum WorkflowStatus {
  DRAFT
  ACTIVE
}

type WorkflowExecution {
  id: ID!
  workflowId: String!
  userId: String
  trigger: WorkflowExecutionType!
  status: WorkflowExecutionStatus!
  createdAt: DateTime
  startedAt: DateTime
  completedAt: DateTime
  creditsConsumed: Int!

  workflow: Workflow
  user: User
  phases: [ExecutionPhase!]
}

enum WorkflowExecutionType {
  MANUAL
  SCHEDULED
  TRIGGERED
}

enum WorkflowExecutionStatus {
  PENDING
  RUNNING
  COMPLETED
  FAILED
}

type AvailableTrigger {
  id: ID!
  name: String!
  key: TriggerKey! 
  image: String
  taskInfo: TaskInfo!
  createdAt: DateTime

  actions: [AvailableTriggerAction!]
  executionPhases: [ExecutionPhase!]
}

enum TriggerKey {
  LAUNCH_BROWSER
}

type AvailableAction {
  id: ID!
  name: String!
  key: ActionKey!
  image: String
  createdAt: DateTime
  taskInfo: TaskInfo!
  
  triggers: [AvailableTriggerAction!]
  executionPhases: [ExecutionPhase!]
}

enum ActionKey {
  PAGE_TO_HTML
  EXTRACT_TEXT_FROM_ELEMENT
}

type TaskInfo {
  id: ID!
  label: String!
  icon: String
  type: String!
  isEntryPoint: Boolean!
  inputs: [TaskParam!]
  outputs: [TaskParam!]
  credits: Int!
}

type TaskParam {
  id: ID!
  type: TaskParamType!
  name: String!
  required: Boolean!
  variant: String
  helperText: String
  hideHandle: Boolean
}

enum TaskParamType {
  STRING
  BROWSER_INSTANCE
}

type AvailableTriggerAction {
  id: ID!
  triggerId: String!
  actionId: String!

  trigger: AvailableTrigger!
  action: AvailableAction!
}

type ExecutionPhase {
  id: ID!
  userId: String!
  status: String!
  number: Int!
  node: String!
  name: String!
  startedAt: DateTime
  completedAt: DateTime
  inputs: String
  outputs: String
  creditsConsumed: Int!
  workflowExecutionId: String!

  user: User!
  workflowExecution: WorkflowExecution!
  logs: [ExecutionLog!]

  triggerId: String
  actionId: String
  trigger: AvailableTrigger
  action: AvailableAction
}

type ExecutionLog {
  id: ID!
  executionPhaseId: String!
  logLevel: String!
  message: String!
  timestamp: DateTime!

  phase: ExecutionPhase!
}

type Credential {
  id: ID!
  userId: String!
  name: String!
  value: String!
  createdAt: DateTime!
}

type UserPurchase {
  id: ID!
  userId: String!
  stripeId: String!
  description: String
  amount: Int!
  currency: String!
  date: DateTime!
}

type DiscordWebhook {
  id: ID!
  webhookId: String!
  url: String!
  name: String!
  guildName: String!
  guildId: String!
  channelId: String!
  userId: String!
  user: User
  connections: [Connections!]
}

type Slack {
  id: ID!
  teamId: String!
  teamName: String!
  botUserId: String!
  authedUserId: String!
  slackAccessToken: String!
  userId: String!
  user: User
  connections: [Connections!]
}

type Notion {
  id: ID!
  accessToken: String!
  workspaceId: String!
  workspaceName: String!
  workspaceIcon: String!
  userId: String!
  user: User
  connections: [Connections!]
}

type GoogleDocs {
  id: ID!
  accessToken: String!
  refreshToken: String
  folderId: String
  userId: String!
  user: User
  connections: [Connections!]
}

type Connections {
  id: ID!
  type: String!
  discordId: String
  slackId: String
  notionId: String
  googleDocsId: String
  userId: String
  user: User
  discordWebhook: DiscordWebhook
  slack: Slack
  notion: Notion
  googleDocs: GoogleDocs
}

input createWorkflowPayload {
  userId: String!
  name: String!
  definition: String!
  description: String
}

input updateWorkflowPayload{
  definition: String!
  description: String
}

input runWorkflowPayload {
  workflowId: ID!
  flowDefinition: String
  name: String!
  executionPlan: String!
}
`;

