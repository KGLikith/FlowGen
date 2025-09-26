import { graphql } from "@/gql";

export const GET_WORKFLOWS = graphql(`
  query GetWorkflows {
    getWorkflows {
      id
      name
      status
      definition
      description
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
        isEntryPoint
        inputs {
          type
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
        isEntryPoint
        inputs {
          type
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
      id
      name
      key
      image
      taskInfo {
        label
        icon
        type
        isEntryPoint
        inputs {
          type
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
