import { prisma } from "@automation/db";

export default class WorkflowQueriesService {
  public static async getWorkflows(clerkId: string) {
    try {
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
    } catch (err) {
      throw new Error("Failed to fetch workflows. Please try again later.");
    }
  }

  public static async getWorkflowById(id: string) {
    try {
      const workflow = await prisma.workflow.findUnique({
        where: { id },
      });
      return workflow;
    } catch (error) {
      throw new Error("Failed to fetch the workflow. Please try again later.");
    }
  }

  public static async getAvailableTriggers() {
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
      throw new Error(
        "Failed to fetch available triggers. Please try again later."
      );
    }
  }

  public static async getAvailableActions() {
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
      throw new Error(
        "Failed to fetch available actions. Please try again later."
      );
    }
  }

  public static async getAvailableActionsForTrigger(triggerId: string) {
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
      throw new Error(
        "Unable to fetch actions for the trigger. Please try again later."
      );
    }
  }

  public static async getWorkflowExecution(executionId: string) {
    try {
      const execution = await prisma.workflowExecution.findUnique({
        where: { id: executionId },
        include: {
          workflow: {
            select: {
              id: true,
              name: true,
            },
          },
          phases: {
            orderBy: {
              number: "asc",
            },
            include: {
              logs: true,
            },
          },
        },
      });
      return execution;
    } catch (error) {
      throw new Error(
        "Error fetching workflow execution details. Please try again later."
      );
    }
  }

  public static async getWorkflowExecutions(workflowId: string) {
    try {
      const executions = await prisma.workflowExecution.findMany({
        where: { workflowId },
        orderBy: {
          createdAt: "desc",
        },
      });
      return executions;
    } catch (err) {
      throw new Error(
        "Error fetching workflow executions. Please try again later."
      );
    }
  }

  public static async getExecutionPhaseDetails(phaseId: string) {
    try {
      const phase = await prisma.executionPhase.findUnique({
        where: { id: phaseId },
      });
      return phase;
    } catch (error) {
      throw new Error(
        "Error fetching execution phase details. Please try again later."
      );
    }
  }
}
