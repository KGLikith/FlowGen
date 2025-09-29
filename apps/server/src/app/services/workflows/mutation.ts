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
  CreateWorkflowDataPayload,
  workflowExecutionPlan,
} from "../../schema/workflow";

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
      throw new Error("Error updating workflow. Please try again later.");
    }
  }

  public static async runWorkflow(form: {
    workflowId: string;
    name: string;
    executionPlan: string;
    flowDefinition?: string;
  }) {
    try {
      const { workflowId, flowDefinition, executionPlan, name } = form;
      const workflow = await prisma.workflow.findUnique({
        where: { id: form.workflowId },
        select: { userId: true },
      });

      if (!workflow) {
        throw new Error("Workflow not found.");
      }

      if (!flowDefinition) {
        throw new Error(
          "Server side error: Missing flow definition. Please try again later."
        );
      }

    //   const flow = JSON.parse(flowDefinition);
      const plan: workflowExecutionPlan = JSON.parse(executionPlan);

      await prisma.workflow.update({
        where: { id: workflowId },
        data: {
          definition: flowDefinition,
          executionPlan: executionPlan,
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
            definition: flowDefinition,
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
}
