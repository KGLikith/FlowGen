/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type AvailableAction = {
  __typename?: 'AvailableAction';
  category: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  executionPhases?: Maybe<Array<ExecutionPhase>>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  triggers?: Maybe<Array<AvailableTriggerAction>>;
};

export type AvailableTrigger = {
  __typename?: 'AvailableTrigger';
  actions?: Maybe<Array<AvailableTriggerAction>>;
  category: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  executionPhases?: Maybe<Array<ExecutionPhase>>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type AvailableTriggerAction = {
  __typename?: 'AvailableTriggerAction';
  action: AvailableAction;
  actionId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  trigger: AvailableTrigger;
  triggerId: Scalars['String']['output'];
};

export type Connections = {
  __typename?: 'Connections';
  discordId?: Maybe<Scalars['String']['output']>;
  discordWebhook?: Maybe<DiscordWebhook>;
  googleDocs?: Maybe<GoogleDocs>;
  googleDocsId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  notion?: Maybe<Notion>;
  notionId?: Maybe<Scalars['String']['output']>;
  slack?: Maybe<Slack>;
  slackId?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  user?: Maybe<User>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type Credential = {
  __typename?: 'Credential';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  userId: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type DiscordWebhook = {
  __typename?: 'DiscordWebhook';
  channelId: Scalars['String']['output'];
  connections?: Maybe<Array<Connections>>;
  guildId: Scalars['String']['output'];
  guildName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  url: Scalars['String']['output'];
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
  webhookId: Scalars['String']['output'];
};

export type ExecutionLog = {
  __typename?: 'ExecutionLog';
  executionPhaseId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  logLevel: Scalars['String']['output'];
  message: Scalars['String']['output'];
  phase: ExecutionPhase;
  timestamp: Scalars['DateTime']['output'];
};

export type ExecutionPhase = {
  __typename?: 'ExecutionPhase';
  action?: Maybe<AvailableAction>;
  actionId?: Maybe<Scalars['String']['output']>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  creditsConsumed: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  inputs?: Maybe<Scalars['String']['output']>;
  logs?: Maybe<Array<ExecutionLog>>;
  name: Scalars['String']['output'];
  node: Scalars['String']['output'];
  number: Scalars['Int']['output'];
  outputs?: Maybe<Scalars['String']['output']>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  status: Scalars['String']['output'];
  trigger?: Maybe<AvailableTrigger>;
  triggerId?: Maybe<Scalars['String']['output']>;
  user: User;
  userId: Scalars['String']['output'];
  workflowExecution: WorkflowExecution;
  workflowExecutionId: Scalars['String']['output'];
};

export type GoogleDocs = {
  __typename?: 'GoogleDocs';
  accessToken: Scalars['String']['output'];
  connections?: Maybe<Array<Connections>>;
  folderId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  refreshToken?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createWorkflow: Workflow;
  deleteWorkflow: Scalars['Boolean']['output'];
  updateWorkflow: Scalars['Boolean']['output'];
};


export type MutationCreateWorkflowArgs = {
  payload: CreateWorkflowPayload;
};


export type MutationDeleteWorkflowArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateWorkflowArgs = {
  id: Scalars['ID']['input'];
  payload: UpdateWorkflowPayload;
};

export type Notion = {
  __typename?: 'Notion';
  accessToken: Scalars['String']['output'];
  connections?: Maybe<Array<Connections>>;
  id: Scalars['ID']['output'];
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
  workspaceIcon: Scalars['String']['output'];
  workspaceId: Scalars['String']['output'];
  workspaceName: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getCurrentUser?: Maybe<User>;
  getUserByClerkId?: Maybe<User>;
  getWorkflow?: Maybe<Workflow>;
  getWorkflows: Array<Workflow>;
};


export type QueryGetUserByClerkIdArgs = {
  clerkId: Scalars['String']['input'];
};


export type QueryGetWorkflowArgs = {
  id: Scalars['ID']['input'];
};

export type Slack = {
  __typename?: 'Slack';
  authedUserId: Scalars['String']['output'];
  botUserId: Scalars['String']['output'];
  connections?: Maybe<Array<Connections>>;
  id: Scalars['ID']['output'];
  slackAccessToken: Scalars['String']['output'];
  teamId: Scalars['String']['output'];
  teamName: Scalars['String']['output'];
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  clerkId?: Maybe<Scalars['String']['output']>;
  connections?: Maybe<Array<Connections>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  credentials?: Maybe<Array<Credential>>;
  discord?: Maybe<Array<DiscordWebhook>>;
  executionPhases?: Maybe<Array<ExecutionPhase>>;
  googleDocs?: Maybe<Array<GoogleDocs>>;
  id: Scalars['ID']['output'];
  notion?: Maybe<Array<Notion>>;
  purchases?: Maybe<Array<UserPurchase>>;
  slack?: Maybe<Array<Slack>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  userBalance?: Maybe<UserBalance>;
  workflowExecutions?: Maybe<Array<WorkflowExecution>>;
  workflows?: Maybe<Array<Workflow>>;
};

export type UserBalance = {
  __typename?: 'UserBalance';
  credits: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  userId: Scalars['String']['output'];
};

export type UserPurchase = {
  __typename?: 'UserPurchase';
  amount: Scalars['Int']['output'];
  currency: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  stripeId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type Workflow = {
  __typename?: 'Workflow';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  creditsCost: Scalars['Int']['output'];
  cron?: Maybe<Scalars['String']['output']>;
  definition?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  executionPlan?: Maybe<Scalars['String']['output']>;
  executions?: Maybe<Array<WorkflowExecution>>;
  id: Scalars['ID']['output'];
  lastRunAt?: Maybe<Scalars['DateTime']['output']>;
  lastRunId?: Maybe<Scalars['String']['output']>;
  lastRunStatus?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  nextRunAt?: Maybe<Scalars['DateTime']['output']>;
  status: WorkflowStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type WorkflowExecution = {
  __typename?: 'WorkflowExecution';
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  creditsConsumed: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  phases?: Maybe<Array<ExecutionPhase>>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  status: Scalars['String']['output'];
  trigger: Scalars['String']['output'];
  user?: Maybe<User>;
  userId?: Maybe<Scalars['String']['output']>;
  workflow?: Maybe<Workflow>;
  workflowId: Scalars['String']['output'];
};

export enum WorkflowStatus {
  Active = 'ACTIVE',
  Draft = 'DRAFT'
}

export type CreateWorkflowPayload = {
  definition: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type UpdateWorkflowPayload = {
  definition: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
};

export type CreateWorkflowMutationVariables = Exact<{
  payload: CreateWorkflowPayload;
}>;


export type CreateWorkflowMutation = { __typename?: 'Mutation', createWorkflow: { __typename?: 'Workflow', id: string, name: string, status: WorkflowStatus, definition?: string | null, description?: string | null, createdAt?: any | null, updatedAt?: any | null, creditsCost: number, lastRunAt?: any | null, lastRunId?: string | null, nextRunAt?: any | null, userId?: string | null } };

export type DeleteWorkflowMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteWorkflowMutation = { __typename?: 'Mutation', deleteWorkflow: boolean };

export type UpdateWorkflowMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  payload: UpdateWorkflowPayload;
}>;


export type UpdateWorkflowMutation = { __typename?: 'Mutation', updateWorkflow: boolean };

export type GetWorkflowsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetWorkflowsQuery = { __typename?: 'Query', getWorkflows: Array<{ __typename?: 'Workflow', id: string, name: string, status: WorkflowStatus, definition?: string | null, description?: string | null, createdAt?: any | null, updatedAt?: any | null, creditsCost: number, lastRunAt?: any | null, lastRunId?: string | null, nextRunAt?: any | null, userId?: string | null }> };

export type GetWorkflowQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetWorkflowQuery = { __typename?: 'Query', getWorkflow?: { __typename?: 'Workflow', id: string, name: string, status: WorkflowStatus, definition?: string | null, description?: string | null, createdAt?: any | null, updatedAt?: any | null, creditsCost: number, lastRunAt?: any | null, lastRunId?: string | null, nextRunAt?: any | null, userId?: string | null } | null };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', getCurrentUser?: { __typename?: 'User', id: string } | null };


export const CreateWorkflowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWorkflow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"createWorkflowPayload"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWorkflow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"payload"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"definition"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creditsCost"}},{"kind":"Field","name":{"kind":"Name","value":"lastRunAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastRunId"}},{"kind":"Field","name":{"kind":"Name","value":"nextRunAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<CreateWorkflowMutation, CreateWorkflowMutationVariables>;
export const DeleteWorkflowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteWorkflow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteWorkflow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteWorkflowMutation, DeleteWorkflowMutationVariables>;
export const UpdateWorkflowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateWorkflow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"updateWorkflowPayload"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateWorkflow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"payload"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload"}}}]}]}}]} as unknown as DocumentNode<UpdateWorkflowMutation, UpdateWorkflowMutationVariables>;
export const GetWorkflowsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWorkflows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWorkflows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"definition"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creditsCost"}},{"kind":"Field","name":{"kind":"Name","value":"lastRunAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastRunId"}},{"kind":"Field","name":{"kind":"Name","value":"nextRunAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<GetWorkflowsQuery, GetWorkflowsQueryVariables>;
export const GetWorkflowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWorkflow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWorkflow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"definition"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creditsCost"}},{"kind":"Field","name":{"kind":"Name","value":"lastRunAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastRunId"}},{"kind":"Field","name":{"kind":"Name","value":"nextRunAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<GetWorkflowQuery, GetWorkflowQueryVariables>;
export const CurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;