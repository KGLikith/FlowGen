import { prisma, WorkflowStatus } from "@automation/db";
import { GraphqlContext } from "../../interface";

export interface CreateWorkflowDataPayload {
  name: string;
  definition: string;
  description?: string;
  userId: string;
}

const queries = {
  getUserByClerkId: async (
    __: any,
    { clerkId }: { clerkId: string },
    context: GraphqlContext
  ) => {
    // console.log("context in getUserByClerkId", context);
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        UserBalance: true,
      },
    });
    return user;
  },

  getCurrentUser: async (_: any, __: any, context: GraphqlContext) => {
    // console.log("context in getCurrentUser", context);
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
      if(workflow.status !== WorkflowStatus.DRAFT){ 
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
};

export const resolvers = {
  queries,
  mutations,
};
