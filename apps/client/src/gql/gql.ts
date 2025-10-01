/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    #graphql\n    mutation CreateWorkflow($payload: createWorkflowPayload!) {\n        createWorkflow(payload: $payload) {\n            id\n        }\n    }\n": typeof types.CreateWorkflowDocument,
    "\n    #graphql\n    mutation DeleteWorkflow($id: ID!) {\n        deleteWorkflow(id: $id)\n    }\n": typeof types.DeleteWorkflowDocument,
    "\n    #graphql\n    mutation UpdateWorkflow($id: ID!, $payload: updateWorkflowPayload!) {\n        updateWorkflow(id: $id, payload: $payload)\n    }\n": typeof types.UpdateWorkflowDocument,
    "\n    #graphql\n    mutation RunWorkflow($form: runWorkflowPayload!) {\n        runWorkflow(form: $form) {\n            id\n        }\n    }\n": typeof types.RunWorkflowDocument,
    "\n  query GetWorkflows {\n    getWorkflows {\n      id\n      name\n      status\n      definition\n      description\n      createdAt\n      updatedAt\n      creditsCost\n      lastRunAt\n      lastRunId\n      nextRunAt\n      userId\n    }\n  }\n": typeof types.GetWorkflowsDocument,
    "\n  query GetWorkflow($id: ID!) {\n    getWorkflow(id: $id) {\n      id\n      name\n      status\n      definition\n      description\n      createdAt\n      updatedAt\n      creditsCost\n      lastRunAt\n      lastRunId\n      nextRunAt\n      userId\n    }\n  }\n": typeof types.GetWorkflowDocument,
    "\n  #graphql\n  query getAvailableTriggers {\n    getAvailableTriggers {\n      id\n      name\n      key\n      image\n      taskInfo {\n        label\n        icon\n        type\n        isEntryPoint\n        inputs {\n          type\n          name\n          required\n          variant\n          helperText\n          hideHandle\n        }\n        outputs {\n          type\n          name\n          required\n          variant\n          helperText\n          hideHandle\n        }\n        credits\n      }\n    }\n  }\n": typeof types.GetAvailableTriggersDocument,
    "\n  #graphql\n  query getAvailableActions {\n    getAvailableActions {\n      id\n      name\n      key\n      image\n      taskInfo {\n        label\n        icon\n        type\n        isEntryPoint\n        inputs {\n          type\n          name\n          required\n          variant\n          helperText\n          hideHandle\n        }\n        outputs {\n          type\n          name\n          required\n          variant\n          helperText\n          hideHandle\n        }\n        credits\n      }\n    }\n  }\n": typeof types.GetAvailableActionsDocument,
    "\n  #graphql\n  query getAvailableActionsForTrigger($triggerId: ID!) {\n    getAvailableActionsForTrigger(triggerId: $triggerId) {\n      actions {\n        id\n        name\n        key\n        image\n        taskInfo {\n          label\n          icon\n          type\n          isEntryPoint\n          inputs {\n            type\n            name\n            required\n            variant\n            helperText\n            hideHandle\n          }\n          outputs {\n            type\n            name\n            required\n            variant\n            helperText\n            hideHandle\n          }\n          credits\n        }\n      }\n      trigger {\n        id\n        name\n        key\n        image\n        taskInfo {\n          label\n          icon\n          type\n          isEntryPoint\n          inputs {\n            type\n            name\n            required\n            variant\n            helperText\n            hideHandle\n          }\n          outputs {\n            type\n            name\n            required\n            variant\n            helperText\n            hideHandle\n          }\n          credits\n        }\n      }\n    }\n  }\n": typeof types.GetAvailableActionsForTriggerDocument,
    "\n  query getWorkflowExecution($executionId: ID!) {\n    getWorkflowExecution(executionId: $executionId) {\n      id\n      workflowId\n      trigger\n      status\n      createdAt\n      startedAt\n      completedAt\n      creditsConsumed\n      workflow {\n        name\n      }\n      phases {\n        id\n        status\n        number \n        data\n        name\n        startedAt\n        completedAt\n        inputs\n        outputs\n        creditsConsumed\n        logs{\n          logLevel \n          message\n          timestamp\n        }\n      }\n    }\n  }\n": typeof types.GetWorkflowExecutionDocument,
    "\n  query getWorkflowExecutions($workflowId: ID!) {\n    getWorkflowExecutions(workflowId: $workflowId) {\n      id\n      status \n      startedAt\n      completedAt\n      trigger\n      creditsConsumed\n    }\n  }\n": typeof types.GetWorkflowExecutionsDocument,
    "\n  query CurrentUser {\n    getCurrentUser {\n      id\n    }\n  }\n": typeof types.CurrentUserDocument,
};
const documents: Documents = {
    "\n    #graphql\n    mutation CreateWorkflow($payload: createWorkflowPayload!) {\n        createWorkflow(payload: $payload) {\n            id\n        }\n    }\n": types.CreateWorkflowDocument,
    "\n    #graphql\n    mutation DeleteWorkflow($id: ID!) {\n        deleteWorkflow(id: $id)\n    }\n": types.DeleteWorkflowDocument,
    "\n    #graphql\n    mutation UpdateWorkflow($id: ID!, $payload: updateWorkflowPayload!) {\n        updateWorkflow(id: $id, payload: $payload)\n    }\n": types.UpdateWorkflowDocument,
    "\n    #graphql\n    mutation RunWorkflow($form: runWorkflowPayload!) {\n        runWorkflow(form: $form) {\n            id\n        }\n    }\n": types.RunWorkflowDocument,
    "\n  query GetWorkflows {\n    getWorkflows {\n      id\n      name\n      status\n      definition\n      description\n      createdAt\n      updatedAt\n      creditsCost\n      lastRunAt\n      lastRunId\n      nextRunAt\n      userId\n    }\n  }\n": types.GetWorkflowsDocument,
    "\n  query GetWorkflow($id: ID!) {\n    getWorkflow(id: $id) {\n      id\n      name\n      status\n      definition\n      description\n      createdAt\n      updatedAt\n      creditsCost\n      lastRunAt\n      lastRunId\n      nextRunAt\n      userId\n    }\n  }\n": types.GetWorkflowDocument,
    "\n  #graphql\n  query getAvailableTriggers {\n    getAvailableTriggers {\n      id\n      name\n      key\n      image\n      taskInfo {\n        label\n        icon\n        type\n        isEntryPoint\n        inputs {\n          type\n          name\n          required\n          variant\n          helperText\n          hideHandle\n        }\n        outputs {\n          type\n          name\n          required\n          variant\n          helperText\n          hideHandle\n        }\n        credits\n      }\n    }\n  }\n": types.GetAvailableTriggersDocument,
    "\n  #graphql\n  query getAvailableActions {\n    getAvailableActions {\n      id\n      name\n      key\n      image\n      taskInfo {\n        label\n        icon\n        type\n        isEntryPoint\n        inputs {\n          type\n          name\n          required\n          variant\n          helperText\n          hideHandle\n        }\n        outputs {\n          type\n          name\n          required\n          variant\n          helperText\n          hideHandle\n        }\n        credits\n      }\n    }\n  }\n": types.GetAvailableActionsDocument,
    "\n  #graphql\n  query getAvailableActionsForTrigger($triggerId: ID!) {\n    getAvailableActionsForTrigger(triggerId: $triggerId) {\n      actions {\n        id\n        name\n        key\n        image\n        taskInfo {\n          label\n          icon\n          type\n          isEntryPoint\n          inputs {\n            type\n            name\n            required\n            variant\n            helperText\n            hideHandle\n          }\n          outputs {\n            type\n            name\n            required\n            variant\n            helperText\n            hideHandle\n          }\n          credits\n        }\n      }\n      trigger {\n        id\n        name\n        key\n        image\n        taskInfo {\n          label\n          icon\n          type\n          isEntryPoint\n          inputs {\n            type\n            name\n            required\n            variant\n            helperText\n            hideHandle\n          }\n          outputs {\n            type\n            name\n            required\n            variant\n            helperText\n            hideHandle\n          }\n          credits\n        }\n      }\n    }\n  }\n": types.GetAvailableActionsForTriggerDocument,
    "\n  query getWorkflowExecution($executionId: ID!) {\n    getWorkflowExecution(executionId: $executionId) {\n      id\n      workflowId\n      trigger\n      status\n      createdAt\n      startedAt\n      completedAt\n      creditsConsumed\n      workflow {\n        name\n      }\n      phases {\n        id\n        status\n        number \n        data\n        name\n        startedAt\n        completedAt\n        inputs\n        outputs\n        creditsConsumed\n        logs{\n          logLevel \n          message\n          timestamp\n        }\n      }\n    }\n  }\n": types.GetWorkflowExecutionDocument,
    "\n  query getWorkflowExecutions($workflowId: ID!) {\n    getWorkflowExecutions(workflowId: $workflowId) {\n      id\n      status \n      startedAt\n      completedAt\n      trigger\n      creditsConsumed\n    }\n  }\n": types.GetWorkflowExecutionsDocument,
    "\n  query CurrentUser {\n    getCurrentUser {\n      id\n    }\n  }\n": types.CurrentUserDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    mutation CreateWorkflow($payload: createWorkflowPayload!) {\n        createWorkflow(payload: $payload) {\n            id\n        }\n    }\n"): (typeof documents)["\n    #graphql\n    mutation CreateWorkflow($payload: createWorkflowPayload!) {\n        createWorkflow(payload: $payload) {\n            id\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    mutation DeleteWorkflow($id: ID!) {\n        deleteWorkflow(id: $id)\n    }\n"): (typeof documents)["\n    #graphql\n    mutation DeleteWorkflow($id: ID!) {\n        deleteWorkflow(id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    mutation UpdateWorkflow($id: ID!, $payload: updateWorkflowPayload!) {\n        updateWorkflow(id: $id, payload: $payload)\n    }\n"): (typeof documents)["\n    #graphql\n    mutation UpdateWorkflow($id: ID!, $payload: updateWorkflowPayload!) {\n        updateWorkflow(id: $id, payload: $payload)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    mutation RunWorkflow($form: runWorkflowPayload!) {\n        runWorkflow(form: $form) {\n            id\n        }\n    }\n"): (typeof documents)["\n    #graphql\n    mutation RunWorkflow($form: runWorkflowPayload!) {\n        runWorkflow(form: $form) {\n            id\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetWorkflows {\n    getWorkflows {\n      id\n      name\n      status\n      definition\n      description\n      createdAt\n      updatedAt\n      creditsCost\n      lastRunAt\n      lastRunId\n      nextRunAt\n      userId\n    }\n  }\n"): (typeof documents)["\n  query GetWorkflows {\n    getWorkflows {\n      id\n      name\n      status\n      definition\n      description\n      createdAt\n      updatedAt\n      creditsCost\n      lastRunAt\n      lastRunId\n      nextRunAt\n      userId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetWorkflow($id: ID!) {\n    getWorkflow(id: $id) {\n      id\n      name\n      status\n      definition\n      description\n      createdAt\n      updatedAt\n      creditsCost\n      lastRunAt\n      lastRunId\n      nextRunAt\n      userId\n    }\n  }\n"): (typeof documents)["\n  query GetWorkflow($id: ID!) {\n    getWorkflow(id: $id) {\n      id\n      name\n      status\n      definition\n      description\n      createdAt\n      updatedAt\n      creditsCost\n      lastRunAt\n      lastRunId\n      nextRunAt\n      userId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getAvailableTriggers {\n    getAvailableTriggers {\n      id\n      name\n      key\n      image\n      taskInfo {\n        label\n        icon\n        type\n        isEntryPoint\n        inputs {\n          type\n          name\n          required\n          variant\n          helperText\n          hideHandle\n        }\n        outputs {\n          type\n          name\n          required\n          variant\n          helperText\n          hideHandle\n        }\n        credits\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getAvailableTriggers {\n    getAvailableTriggers {\n      id\n      name\n      key\n      image\n      taskInfo {\n        label\n        icon\n        type\n        isEntryPoint\n        inputs {\n          type\n          name\n          required\n          variant\n          helperText\n          hideHandle\n        }\n        outputs {\n          type\n          name\n          required\n          variant\n          helperText\n          hideHandle\n        }\n        credits\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getAvailableActions {\n    getAvailableActions {\n      id\n      name\n      key\n      image\n      taskInfo {\n        label\n        icon\n        type\n        isEntryPoint\n        inputs {\n          type\n          name\n          required\n          variant\n          helperText\n          hideHandle\n        }\n        outputs {\n          type\n          name\n          required\n          variant\n          helperText\n          hideHandle\n        }\n        credits\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getAvailableActions {\n    getAvailableActions {\n      id\n      name\n      key\n      image\n      taskInfo {\n        label\n        icon\n        type\n        isEntryPoint\n        inputs {\n          type\n          name\n          required\n          variant\n          helperText\n          hideHandle\n        }\n        outputs {\n          type\n          name\n          required\n          variant\n          helperText\n          hideHandle\n        }\n        credits\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getAvailableActionsForTrigger($triggerId: ID!) {\n    getAvailableActionsForTrigger(triggerId: $triggerId) {\n      actions {\n        id\n        name\n        key\n        image\n        taskInfo {\n          label\n          icon\n          type\n          isEntryPoint\n          inputs {\n            type\n            name\n            required\n            variant\n            helperText\n            hideHandle\n          }\n          outputs {\n            type\n            name\n            required\n            variant\n            helperText\n            hideHandle\n          }\n          credits\n        }\n      }\n      trigger {\n        id\n        name\n        key\n        image\n        taskInfo {\n          label\n          icon\n          type\n          isEntryPoint\n          inputs {\n            type\n            name\n            required\n            variant\n            helperText\n            hideHandle\n          }\n          outputs {\n            type\n            name\n            required\n            variant\n            helperText\n            hideHandle\n          }\n          credits\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getAvailableActionsForTrigger($triggerId: ID!) {\n    getAvailableActionsForTrigger(triggerId: $triggerId) {\n      actions {\n        id\n        name\n        key\n        image\n        taskInfo {\n          label\n          icon\n          type\n          isEntryPoint\n          inputs {\n            type\n            name\n            required\n            variant\n            helperText\n            hideHandle\n          }\n          outputs {\n            type\n            name\n            required\n            variant\n            helperText\n            hideHandle\n          }\n          credits\n        }\n      }\n      trigger {\n        id\n        name\n        key\n        image\n        taskInfo {\n          label\n          icon\n          type\n          isEntryPoint\n          inputs {\n            type\n            name\n            required\n            variant\n            helperText\n            hideHandle\n          }\n          outputs {\n            type\n            name\n            required\n            variant\n            helperText\n            hideHandle\n          }\n          credits\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getWorkflowExecution($executionId: ID!) {\n    getWorkflowExecution(executionId: $executionId) {\n      id\n      workflowId\n      trigger\n      status\n      createdAt\n      startedAt\n      completedAt\n      creditsConsumed\n      workflow {\n        name\n      }\n      phases {\n        id\n        status\n        number \n        data\n        name\n        startedAt\n        completedAt\n        inputs\n        outputs\n        creditsConsumed\n        logs{\n          logLevel \n          message\n          timestamp\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getWorkflowExecution($executionId: ID!) {\n    getWorkflowExecution(executionId: $executionId) {\n      id\n      workflowId\n      trigger\n      status\n      createdAt\n      startedAt\n      completedAt\n      creditsConsumed\n      workflow {\n        name\n      }\n      phases {\n        id\n        status\n        number \n        data\n        name\n        startedAt\n        completedAt\n        inputs\n        outputs\n        creditsConsumed\n        logs{\n          logLevel \n          message\n          timestamp\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getWorkflowExecutions($workflowId: ID!) {\n    getWorkflowExecutions(workflowId: $workflowId) {\n      id\n      status \n      startedAt\n      completedAt\n      trigger\n      creditsConsumed\n    }\n  }\n"): (typeof documents)["\n  query getWorkflowExecutions($workflowId: ID!) {\n    getWorkflowExecutions(workflowId: $workflowId) {\n      id\n      status \n      startedAt\n      completedAt\n      trigger\n      creditsConsumed\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CurrentUser {\n    getCurrentUser {\n      id\n    }\n  }\n"): (typeof documents)["\n  query CurrentUser {\n    getCurrentUser {\n      id\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;