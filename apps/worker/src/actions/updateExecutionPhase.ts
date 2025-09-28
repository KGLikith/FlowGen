import {
  ExecutionPhase,
  ExecutionPhaseStatus,
  logLevel,
  Prisma,
  prisma,
} from "@automation/db";

export type ExecutionPhaseUpdatePayload = Prisma.ExecutionPhaseUpdateInput;

export const updateExecutionPhase = async (
  executionId: string,
  payload: Partial<ExecutionPhaseUpdatePayload>
) => {
  try {
    console.log("hello");
    await prisma.executionPhase.update({
      where: { id: executionId },
      data: payload,
    });
  } catch (err) {
    console.error("Error updating execution phase:", err);
    return null;
  }
};

export const updatePendingExecutionPhases = async (
  executionId: string,
  payload: Partial<ExecutionPhaseUpdatePayload>,
  logData: { logLevel: logLevel; message: string; timestamp: Date }
) => {
  try {
    const pendingPhases = await prisma.executionPhase.findMany({
      where: { workflowExecutionId: executionId, status: "PENDING" },
      select: { id: true },
    });
    await prisma.executionPhase.updateMany({
      where: { id: executionId, status: ExecutionPhaseStatus.PENDING },
      data: payload,
    });

    await prisma.executionLog.createMany({
      data: pendingPhases.map((phase) => ({
        executionPhaseId: phase.id,
        ...logData,
      })),
    });
  } catch (err) {
    console.error("Error updating pending execution phases:", err);
    return null;
  }
};
