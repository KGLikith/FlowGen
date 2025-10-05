import {
  ActionKey,
  ExecutionPhaseStatus,
  prisma,
  TriggerKey,
  WorkflowExecutionStatus,
  WorkflowExecutionType,
  WorkflowStatus,
} from "@automation/db";
import {
  ALG,
  CreateWorkflowDataPayload,
  workflowExecutionPlan,
} from "../../schema/workflow";
import parser from "cron-parser";
import crypto from "crypto";

export default class WorkflowMutationService {
  public static async createWorkflow(payload: CreateWorkflowDataPayload) {
    try {
      const workflow = await prisma.workflow.create({
        data: {
          userId: payload.userId,
          name: payload.name,
          definition: payload.definition,
          description: payload.description,
          creditsCost: 0,
        },
        select: { id: true },
      });
      return workflow;
    } catch (error) {
      return null;
    }
  }

  public static async deleteWorkflow(id: string) {
    try {
      await prisma.workflow.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error deleting workflow:", error);
      return false;
    }
  }

  public static async updateWorkflow(id: string, payload: any) {
    try {
      const workflow = await prisma.workflow.findUnique({
        where: { id },
        select: { status: true },
      });
      if (!workflow) {
        throw new Error("Workflow not found.");
      }
      if (workflow.status !== WorkflowStatus.DRAFT) {
        throw new Error("Cannot update a active workflow");
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
      throw new Error("Error updating workflow. Please try again later.");
    }
  }

  public static async publishWorkflow(form: {
    workflowId: string;
    executionPlan: string;
    flowDefinition: string;
  }) {
    try {
      const plan: workflowExecutionPlan = JSON.parse(form.executionPlan);

      if (!plan || plan.length === 0) {
        throw new Error("Invalid execution plan.");
      }

      const creditsCost = plan.reduce((total, phase) => {
        return (
          total +
          phase.nodes.reduce((nodeTotal, node) => {
            return nodeTotal + (node.data.credits || 0);
          }, 0)
        );
      }, 0);

      const workflow = await prisma.workflow.update({
        where: { id: form.workflowId },
        data: {
          definition: form.flowDefinition,
          executionPlan: form.executionPlan,
          status: WorkflowStatus.ACTIVE,
          creditsCost,
          updatedAt: new Date(),
        },
        select: {
          id: true,
        },
      });
      if (!workflow) return false;
      return true;
    } catch (error) {
      console.error("Error publishing workflow:", error);
      throw new Error("Error publishing workflow. Please try again later.");
    }
  }

  public static async runWorkflow(form: {
    workflowId: string;
    executionPlan: string;
    flowDefinition?: string;
  }) {
    try {
      const { workflowId, flowDefinition, executionPlan } = form;
      const workflow = await prisma.workflow.findUnique({
        where: { id: form.workflowId },
        select: { userId: true, definition: true },
      });
      if (!workflow) {
        throw new Error("Workflow not found.");
      }

      const plan: workflowExecutionPlan = JSON.parse(form.executionPlan);

      if (flowDefinition && executionPlan) {
        await prisma.workflow.update({
          where: { id: workflowId },
          data: {
            definition: flowDefinition,
            executionPlan: executionPlan,
          },
        });
      }

      const execution = await prisma.$transaction(async (tx) => {
        const execution = await tx.workflowExecution.create({
          data: {
            workflowId,
            userId: workflow.userId,
            status: WorkflowExecutionStatus.PENDING,
            trigger: WorkflowExecutionType.MANUAL,
            creditsConsumed: 0,
            definition: flowDefinition || workflow.definition,
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
        throw new Error("Error running workflow. Please try again later.");
      }
      return execution;
    } catch (error) {
      console.error("Error running workflow:", error);
      throw new Error("Error running workflow. Please try again later.");
    }
  }

  public static async unpublishWorkflow(id: string) {
    try {
      const workflow = await prisma.workflow.findUnique({
        where: { id },
        select: { status: true },
      });
      if (!workflow) {
        throw new Error("Workflow not found.");
      }
      if (workflow.status !== WorkflowStatus.ACTIVE) {
        throw new Error("Only ACTIVE workflows can be unpublished.");
      }

      await prisma.workflow.update({
        where: { id },
        data: {
          status: WorkflowStatus.DRAFT,
          executionPlan: null,
          creditsCost: 0,
        },
      });
      return true;
    } catch (error) {
      console.error("Error unpublishing workflow:", error);
      throw new Error("Error unpublishing workflow. Please try again later.");
    }
  }

  public static async updateWorkflowCron(workflowId: string, cron: string) {
    try {
      const interval = parser.parse(cron);
      await prisma.workflow.update({
        where: { id: workflowId },
        data: {
          cron,
          nextRunAt: interval.next().toDate(),
          updatedAt: new Date(),
        },
      });
      return true;
    } catch (error) {
      console.error("Error updating workflow cron:", error);
      throw new Error("Error updating workflow cron. Please try again later.");
    }
  }

  public static async deleteWorkflowCron(workflowId: string) {
    try {
      await prisma.workflow.update({
        where: { id: workflowId },
        data: {
          cron: null,
          nextRunAt: null,
          updatedAt: new Date(),
        },
      });
      return true;
    } catch (error) {
      console.error("Error deleting workflow cron:", error);
      throw new Error("Error deleting workflow cron. Please try again later.");
    }
  }

  
}
