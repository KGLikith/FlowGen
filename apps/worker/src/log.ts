import { logLevel } from "@automation/db";
import { ExecutionLogSubset, LogCollector, LogFunction } from "./schema/log";

export const createLogCollector = (phaseId: string): LogCollector => {
  const logs: ExecutionLogSubset[] = [];
  const getAll = () => logs;

  const logCollector = {
    getAll,
    INFO: (message: string) =>
      logs.push({
        logLevel: "INFO",
        message,
        executionPhaseId: phaseId,
        timestamp: new Date(),
      }),
    WARN: (message: string) =>
      logs.push({
        logLevel: "WARN",
        message: message,
        executionPhaseId: phaseId,
        timestamp: new Date(),
      }),
    ERROR: (message: string) =>
      logs.push({
        logLevel: "ERROR",
        message,
        executionPhaseId: phaseId,
        timestamp: new Date(),
      }),
  };
  return logCollector;
};
