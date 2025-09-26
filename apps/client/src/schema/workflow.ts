import { z } from "zod";
import { AppNode } from "./appNode";

export const createWorkflowSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(20, "Name must be less than 20 characters"),
  description: z
    .string()
    .max(50, "Description must be less than 50 characters")
    .optional(),
});

export type createWorkflowSchemaType = z.infer<typeof createWorkflowSchema>;

// export type WorkflowTask = {
//   label: string;
//   icon: React.FC<LucideProps>;
//   type: TaskType;
//   isEntryPoint?: boolean;
//   inputs: TaskParam[];
//   outputs: TaskParam[];
//   credits: number;
// };

export type WorkflowExecutionPlanPhase = {
  phase: number;
  nodes: AppNode[];
};

export type workflowExecutionPlan = WorkflowExecutionPlanPhase[];

// export type Workflow = {
//   id: string;
//   name: string;
//   description?: string;
//   createdAt: Date;
//   updatedAt: Date;
//   tasks: WorkflowTask[];
//   executionPlan?: workflowExecutionPlan;
// };

// export enum WorkflowExecutionStatus {
//   PENDING = "PENDING",
//   RUNNING = "RUNNING",
//   COMPLETED = "COMPLETED",
//   FAILED = "FAILED",
// }

// export enum ExecutionPhaseStatus {
//   CREATED = "CREATED",
//   PENDING = "PENDING",
//   RUNNING = "RUNNING",
//   COMPLETED = "COMPLETED",
//   FAILED = "FAILED",
// }
