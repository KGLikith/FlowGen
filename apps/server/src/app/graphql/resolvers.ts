import { GraphqlContext } from "../../interface";
import { CreateWorkflowDataPayload } from "../schema/workflow";
import userService from "../services/user";
import WorkflowQueriesService from "../services/workflows/queries";
import WorkflowMutationService from "../services/workflows/mutation";

const queries = {
  getUserByClerkId: async (
    __: any,
    { clerkId }: { clerkId: string },
    context: GraphqlContext
  ) => {
    if (!context.clerkId) throw new Error("Unauthorized");
    return await userService.getUserByClerkId(clerkId);
  },

  getCurrentUser: async (_: any, __: any, context: GraphqlContext) => {
    const clerkId = context.clerkId;
    if (!clerkId) throw new Error("Unauthorized");
    return await userService.getUserByClerkId(clerkId);
  },

  getWorkflows: async (_: any, __: any, context: GraphqlContext) => {
    const clerkId = context.clerkId;
    if (!clerkId) throw new Error("Unauthorized");
    return await WorkflowQueriesService.getWorkflows(clerkId);
  },

  getWorkflow: async (
    __: any,
    { id }: { id: string },
    context: GraphqlContext
  ) => {
    const clerkId = context.clerkId;
    if (!clerkId) throw new Error("Unauthorized");
    return await WorkflowQueriesService.getWorkflowById(id);
  },

  getAvailableTriggers: async (_: any, __: any, context: GraphqlContext) => {
    const clerkId = context.clerkId;
    if (!clerkId) {
      throw new Error("Unauthorized to access the triggers");
    }
    return await WorkflowQueriesService.getAvailableTriggers();
  },

  getAvailableActions: async (_: any, __: any, context: GraphqlContext) => {
    const clerkId = context.clerkId;
    if (!clerkId) throw new Error("Unauthorized to access the actions");

    return await WorkflowQueriesService.getAvailableActions();
  },

  getAvailableActionsForTrigger: async (
    _: any,
    { triggerId }: { triggerId: string },
    context: GraphqlContext
  ) => {
    const clerkId = context.clerkId;
    if (!clerkId) throw new Error("Unauthorized to access the triggers");

    return await WorkflowQueriesService.getAvailableActionsForTrigger(
      triggerId
    );
  },

  getWorkflowExecution: async (
    __: any,
    { executionId }: { executionId: string },
    context: GraphqlContext
  ) => {
    const clerkId = context.clerkId;
    if (!clerkId) throw new Error("Unauthorized");
    return await WorkflowQueriesService.getWorkflowExecution(executionId);
  },

  getWorkflowExecutions: async (
    __: any,
    { workflowId }: { workflowId: string },
    context: GraphqlContext
  ) => {
    const clerkId = context.clerkId;
    if (!clerkId) throw new Error("Unauthorized");
    return await WorkflowQueriesService.getWorkflowExecutions(workflowId);
  },

  getExecutionPhaseDetails: async (
    __: any,
    { phaseId }: { phaseId: string },
    context: GraphqlContext
  ) => {
    const clerkId = context.clerkId;
    if (!clerkId) throw new Error("Unauthorized");
    return await WorkflowQueriesService.getExecutionPhaseDetails(phaseId);
  },
};

const mutations = {
  createWorkflow: async (
    _: any,
    { payload }: { payload: CreateWorkflowDataPayload },
    context: GraphqlContext
  ) => {
    if (!context.clerkId) throw new Error("Unauthorized");
    return await WorkflowMutationService.createWorkflow(payload);
  },

  deleteWorkflow: async (
    _: any,
    { id }: { id: string },
    context: GraphqlContext
  ) => {
    if (!context.clerkId) throw new Error("Unauthorized");
    return await WorkflowMutationService.deleteWorkflow(id);
  },

  updateWorkflow: async (
    _: any,
    {
      id,
      payload,
    }: { id: string; payload: { definition: string; description?: string } },
    context: GraphqlContext
  ) => {
    if (!context.clerkId) throw new Error("Unauthorized");
    return await WorkflowMutationService.updateWorkflow(id, payload);
  },

  runWorkflow: async (
    _: any,
    {
      form,
    }: {
      form: {
        workflowId: string;
        executionPlan: string;
        flowDefinition?: string;
      };
    },
    context: GraphqlContext
  ) => {
    if (!context.clerkId) throw new Error("Unauthorized");
    return await WorkflowMutationService.runWorkflow(form);
  },

  publishWorkflow: async (
    _: any,
    { form }: { form: {
      workflowId: string;
      executionPlan: string
      flowDefinition: string
    } },
    context: GraphqlContext
  ) => {
    if (!context.clerkId) throw new Error("Unauthorized");
    return await WorkflowMutationService.publishWorkflow(form);
  },

  unpublishWorkflow: async (
    _: any,
    { id }: { id: string },
    context: GraphqlContext
  ) => {
    if (!context.clerkId) throw new Error("Unauthorized");
    return await WorkflowMutationService.unpublishWorkflow(id);
  },

  updateWorkflowCron: async (
    _: any,
    { workflowId, cron }: { workflowId: string; cron: string },
    context: GraphqlContext
  ) => {
    if (!context.clerkId) throw new Error("Unauthorized");
    return await WorkflowMutationService.updateWorkflowCron(workflowId, cron);
  },

  deleteWorkflowCron: async (
    _: any,
    { workflowId }: { workflowId: string },
    context: GraphqlContext
  ) => {
    if (!context.clerkId) throw new Error("Unauthorized");
    return await WorkflowMutationService.deleteWorkflowCron(workflowId);
  },
};

export const resolvers = {
  queries,
  mutations,
};
