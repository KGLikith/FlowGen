import { ExecutionPhase, TaskType } from "@automation/db";
import { AppNode, ExecutorRegistry } from "./types";

export async function executePhase(phase: ExecutionPhase, node: AppNode, environment: any): Promise<boolean> {
    const run = ExecutorRegistry[node.data.type];

    if(!run){
        return false;
    }
    return await run(environment);
}