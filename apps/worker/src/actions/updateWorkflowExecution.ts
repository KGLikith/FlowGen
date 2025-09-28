import { Prisma, prisma } from "@automation/db";

export const updateWorkflowExecution = async (executionId: string, payload: Partial<Prisma.WorkflowExecutionUpdateInput>) => {
    try{
        return await prisma.workflowExecution.update({
          where: { id: executionId },
          data: payload
        })
    }catch(err){
        console.log(err)
        return;
    }
};
