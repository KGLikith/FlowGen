import { prisma } from "@automation/db";

export const getExecutionDetails = async (executionId: string, stage: number) => {
  try {
    return await prisma.workflowExecution.findUnique({
      where: { id: executionId },
      include: {
        phases: {
          where: { number: stage },
          include: {
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
          },
        },
        _count: {
          select: { phases: true },
        },
      },
    });
  } catch (err) {
    return null;
  }
};
