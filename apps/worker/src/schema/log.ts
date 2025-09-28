import { ExecutionLog, logLevel } from "@automation/db";

export type ExecutionLogSubset = Pick<ExecutionLog, "message" | "logLevel" | "timestamp" >;
export type LogCollector = {
  getAll(): ExecutionLogSubset[];
} & {
  [K in logLevel]: LogFunction;
}

export type LogFunction = (message: string) => void;