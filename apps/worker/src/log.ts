import { logLevel } from "@automation/db";
import { ExecutionLogSubset, LogCollector, LogFunction } from "./schema/log";

export const createLogCollector = (): LogCollector => {
  const logs: ExecutionLogSubset[] = [];
  const getAll = () => logs;

  const logCollector = {
    getAll,
    INFO: (message: string) =>
      logs.push({
        logLevel: "INFO",
        message,
        timestamp: new Date(),
      }),
    WARN: (message: string) =>
      logs.push({
        logLevel: "WARN",
        message: message,
        timestamp: new Date(),
      }),
    ERROR: (message: string) =>
      logs.push({
        logLevel: "ERROR",
        message,
        timestamp: new Date(),
      }),
  };
  return logCollector;
};
