import { ExecutionPhase, Prisma, prisma } from "@automation/db";

export type ExecutionPhaseUpdatePayload = Prisma.ExecutionPhaseUpdateInput;

export const updateExecutionPhase = async(executionId: string, payload: Partial<ExecutionPhaseUpdatePayload>) => {
    try {
        await prisma.executionPhase.update({
            where: { id: executionId },
            data: payload
        });
    } catch (err) {
        return null;
    }
}