import { graphql } from "@/gql";

export const GET_WORKFLOWS = graphql(`
  query GetWorkflows {
    getWorkflows {
      id
      name
      status
      definition
      description
      executionPlan
      createdAt
      updatedAt
      creditsCost
      lastRunAt
      lastRunId
      nextRunAt
      userId
    }
  }
`);

export const GET_WORKFLOW = graphql(`
  query GetWorkflow($id: ID!) {
    getWorkflow(id: $id) {
      id
      name
      status
      definition
      description
      executionPlan
      createdAt
      updatedAt
      creditsCost
      cron
      nextRunAt
      lastRunAt
      lastRunId
      nextRunAt
      userId
    }
  }
`);

export const GET_AVAILABLE_TRIGGERS = graphql(`
  #graphql
  query getAvailableTriggers {
    getAvailableTriggers {
      id
      name
      key
      image
      taskInfo {
        label
        icon
        type
        group
        isEntryPoint
        inputs {
          type
        options
          name
          required
          variant
          helperText
          hideHandle
        }
        outputs {
          type
          name
          required
          variant
          helperText
          hideHandle
        }
        credits
      }
    }
  }
`);

export const GET_AVAILABLE_ACTIONS = graphql(`
  #graphql
  query getAvailableActions {
    getAvailableActions {
      id
      name
      key
      image
      taskInfo {
        label
        icon
        type
        group
        isEntryPoint
        inputs {
          type
          options
          name
          required
          variant
          helperText
          hideHandle
        }
        outputs {
          type
          name
          required
          variant
          helperText
          hideHandle
        }
        credits
      }
    }
  }
`);

export const GET_AVAILABLE_ACTIONS_FOR_TRIGGERS = graphql(`
  #graphql
  query getAvailableActionsForTrigger($triggerId: ID!) {
    getAvailableActionsForTrigger(triggerId: $triggerId) {
      actions {
        id
        name
        key
        image
        taskInfo {
          label
          group
          icon
          type
          isEntryPoint
          inputs {
            type
            options
            name
            required
            variant
            helperText
            hideHandle
          }
          outputs {
            type
            name
            required
            variant
            helperText
            hideHandle
          }
          credits
        }
      }
      trigger {
        id
        name
        key
        image
        taskInfo {
          label
          group
          icon
          type
          isEntryPoint
          inputs {
            type
            name
            required
            variant
            options
            helperText
            hideHandle
          }
          outputs {
            type
            name
            required
            variant
            helperText
            hideHandle
          }
          credits
        }
      }
    }
  }
`);

export const GET_WORKFLOW_EXECUTION = graphql(`
  query getWorkflowExecution($executionId: ID!) {
    getWorkflowExecution(executionId: $executionId) {
      id
      workflowId
      trigger
      status
      createdAt
      startedAt
      completedAt
      creditsConsumed
      workflow {
        name
      }
      phases {
        id
        status
        number
        data
        name
        startedAt
        completedAt
        inputs
        outputs
        creditsConsumed
        logs {
          logLevel
          message
          timestamp
        }
      }
    }
  }
`);

export const GET_WORKFLOW_EXECUTIONS = graphql(`
  query getWorkflowExecutions($workflowId: ID!) {
    getWorkflowExecutions(workflowId: $workflowId) {
      id
      status
      startedAt
      completedAt
      trigger
      creditsConsumed
    }
  }
`);
