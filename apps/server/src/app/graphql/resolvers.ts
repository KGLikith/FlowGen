import {
  ActionKey,
  ExecutionPhaseStatus,
  prisma,
  TriggerKey,
  WorkflowExecutionStatus,
  WorkflowExecutionType,
  WorkflowStatus,
} from "@automation/db";
import { GraphqlContext } from "../../interface";
import {
  CreateWorkflowDataPayload,
  workflowExecutionPlan,
} from "../schema/workflow";

const queries = {
  getUserByClerkId: async (
    __: any,
    { clerkId }: { clerkId: string },
    context: GraphqlContext
  ) => {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        UserBalance: true,
      },
    });
    return user;
  },

  getCurrentUser: async (_: any, __: any, context: GraphqlContext) => {
    const clerkId = context.clerkId;
    if (!clerkId) return null;
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        UserBalance: true,
      },
    });
    return user;
  },

  getWorkflows: async (_: any, __: any, context: GraphqlContext) => {
    const clerkId = context.clerkId;
    if (!clerkId) return [];
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        Workflows: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return user?.Workflows || [];
  },
  getWorkflow: async (
    __: any,
    { id }: { id: string },
    context: GraphqlContext
  ) => {
    const clerkId = context.clerkId;
    if (!clerkId) return null;
    try {
      const workflow = await prisma.workflow.findUnique({
        where: { id },
      });
      return workflow;
    } catch (error) {
      console.error("Error fetching workflow:", error);
      return null;
    }
  },

  getAvailableTriggers: async (_: any, __: any, context: GraphqlContext) => {
    const clerkId = context.clerkId;
    if (!clerkId) return null;
    try {
      const actions = await prisma.availableTrigger.findMany({
        include: {
          taskInfo: {
            include: {
              inputs: true,
              outputs: true,
            },
          },
        },
      });

      return actions;
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong. Please try again later.");
    }
  },

  getAvailableActions: async (_: any, __: any, context: GraphqlContext) => {
    const clerkId = context.clerkId;
    if (!clerkId) return null;
    try {
      const actions = await prisma.availableAction.findMany({
        include: {
          taskInfo: {
            include: {
              inputs: true,
              outputs: true,
            },
          },
        },
      });

      return actions;
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong. Please try again later.");
    }
  },
  getAvailableActionsForTrigger: async (
    _: any,
    { triggerId }: { triggerId: string },
    context: GraphqlContext
  ) => {
    const clerkId = context.clerkId;
    if (!clerkId) return null;
    try {
      const actions = await prisma.availableTriggerAction.findMany({
        where: {
          triggerId,
        },
        include: {
          trigger: {
            include: {
              taskInfo: {
                include: {
                  inputs: true,
                  outputs: true,
                },
              },
            },
          },
          action: {
            include: {
              taskInfo: {
                include: {
                  inputs: true,
                  outputs: true,
                },
              },
            },
          },
        },
      });

      const actionList = actions.map((a) => a.action);
      const trigger = actions[0]?.trigger;
      return { trigger, actions: actionList };
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong. Please try again later.");
    }
  },

  getWorkflowExecution: async (
    __: any,
    { executionId }: { executionId: string },
    context: GraphqlContext
  ) => {
    const clerkId = context.clerkId;
    if (!clerkId) return null;
    try {
      const execution = await prisma.workflowExecution.findUnique({
        where: { id: executionId },
        include: {
          phases: {
            orderBy: {
              number: "asc",
            },
          },
        },
      });
      return execution;
    } catch (error) {
      console.error("Error fetching workflow execution:", error);
      return null;
    }
  },

  getExecutionPhaseDetails: async (
    __: any,
    { phaseId }: { phaseId: string },
    context: GraphqlContext
  ) => {
    const clerkId = context.clerkId;
    if (!clerkId) return null;
    try {
      const phase = await prisma.executionPhase.findUnique({
        where: { id: phaseId },
      });
      return phase;
    } catch (error) {
      console.error("Error fetching execution phase details:", error);
      return null;
    }
  },
};

const mutations = {
  createWorkflow: async (
    _: any,
    { payload }: { payload: CreateWorkflowDataPayload },
    context: GraphqlContext
  ) => {
    if (!context.clerkId) throw new Error("Unauthorized");
    try {
      const workflow = await prisma.workflow.create({
        data: {
          userId: payload.userId,
          name: payload.name,
          definition: payload.definition,
          description: payload.description,
          creditsCost: 0,
        },
      });
      return workflow;
    } catch (error) {
      console.error("Error creating workflow:", error);
      throw new Error("Failed to create workflow");
    }
  },
  deleteWorkflow: async (
    _: any,
    { id }: { id: string },
    context: GraphqlContext
  ) => {
    if (!context.clerkId) throw new Error("Unauthorized");
    try {
      await prisma.workflow.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error deleting workflow:", error);
      return false;
    }
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
    try {
      const workflow = await prisma.workflow.findUnique({
        where: { id },
      });
      if (!workflow) {
        throw new Error("Workflow not found");
      }
      if (workflow.status !== WorkflowStatus.DRAFT) {
        throw new Error("Cannot update a DRAFT workflow");
      }
      await prisma.workflow.update({
        where: { id },
        data: {
          definition: payload.definition,
          description: payload.description,
          updatedAt: new Date(),
        },
      });
      return true;
    } catch (error) {
      console.error("Error updating workflow:", error);
      throw new Error("Failed to update workflow. Please try again.");
    }
  },

  runWorkflow: async (
    _: any,
    {
      form,
    }: {
      form: {
        workflowId: string;
        name: string;
        executionPlan: string;
        flowDefinition?: string;
      };
    },
    context: GraphqlContext
  ) => {
    if (!context.clerkId) throw new Error("Unauthorized");
    try {
      const { workflowId, flowDefinition, executionPlan, name } = form;
      const workflow = await prisma.workflow.findUnique({
        where: { id: form.workflowId },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      if (!flowDefinition) {
        throw new Error("Flow definition is required to run the workflow");
      }

      const flow = JSON.parse(flowDefinition);
      const plan: workflowExecutionPlan = JSON.parse(executionPlan);

      await prisma.workflow.update({
        where: { id: workflowId },
        data: {
          definition: flowDefinition,
        },
      });

      const execution = prisma.$transaction(async (tx) => {
        const execution = await tx.workflowExecution.create({
          data: {
            workflowId,
            userId: workflow.userId,
            status: WorkflowExecutionStatus.PENDING,
            trigger: WorkflowExecutionType.MANUAL,
            creditsConsumed: 0,
            phases: {
              create: plan.flatMap((phase) => {
                return phase.nodes.flatMap((node) => {
                  return {
                    userId: workflow.userId,
                    status: ExecutionPhaseStatus.CREATED,
                    number: phase.phase,
                    data: JSON.stringify(node),
                    name:
                      ActionKey[node.data.type as ActionKey] ||
                      TriggerKey[node.data.type as TriggerKey],
                    creditsConsumed: node.data.credits || 0,
                    actionId: node.data?.actionId,
                    triggerId: node.data?.triggerId,
                  };
                });
              }),
            },
          },
          select: {
            id: true,
            phases: true,
          },
        });

        await tx.executionOutbox.create({
          data: {
            workflowExecId: execution.id,
          },
        });

        return execution;
      });

      if (!execution) {
        throw new Error("Failed to create workflow execution");
      }
      return execution;
    } catch (error) { 
      console.error("Error running workflow:", error);
      throw new Error("Failed to run workflow. Please try again.");
    }
  },

  initializeWorkflowExecution: async (
    _: any,
    { executionId, workflowId }: { executionId: string; workflowId: string },
    context: GraphqlContext
  ) => {
    if (!context.clerkId) throw new Error("Unauthorized");
    try {
      await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
          startedAt: new Date(),
          status: WorkflowExecutionStatus.RUNNING,
        },
      });

      await prisma.workflow.update({
        where: { id: workflowId },
        data: {
          lastRunAt: new Date(),
          lastRunStatus: WorkflowExecutionStatus.RUNNING,
          lastRunId: executionId,
        },
      });
      return true;
    } catch (error) {
      console.error("Error initializing workflow execution:", error);
      throw new Error("Failed to initialize workflow execution");
    }
  },
};

export const resolvers = {
  queries,
  mutations,
};
