import { TaskParamType } from "@automation/db";
import { Browser, Page } from "puppeteer";
import {
  Edge,
  ExecutionPhaseWithPayload,
  ExecutorRegistry,
  TaskWithInfo,
} from "./schema/types";
import { AppNode } from "./schema/appnode";
import { Environment, ExecutionEnvironment } from "./schema/environment";
import { LogCollector } from "./schema/log";

export async function executePhase(
  phase: ExecutionPhaseWithPayload,
  node: AppNode,
  environment: Environment,
  edges: Edge[],
  logCollector: LogCollector
): Promise<boolean> {
  const run = ExecutorRegistry[node.data.type];

  const taskInfo = phase.action
    ? phase.action?.taskInfo
    : phase.trigger?.taskInfo;
  if (taskInfo) {
    setUpEnvironmentForPhase(node, taskInfo, environment, edges);
  }

  if (!run) {
    return false;
  }

  const executionEnvironment = createExecutionEnvironment(
    node,
    environment,
    logCollector
  );
  return await run(environment.phases[node.id], executionEnvironment);
}

function setUpEnvironmentForPhase(
  node: AppNode,
  task: TaskWithInfo,
  environment: Environment,
  edges: Edge[]
) {
  environment.phases[node.id] = { inputs: {}, outputs: {} };

  const RequiredInputs = task.inputs;

  for (const input of RequiredInputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue;
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }
    const connectedEdge = edges.find((e) => {
      return e.target === node.id && e.targetHandle === input.name;
    });

    if (!connectedEdge) {
      console.warn(
        `⚠️ Input ${input.name} for node ${node.id} not found and not connected, skipping...`
      );
      continue;
    }

    const outputValue =
      environment.phases[connectedEdge.source]?.outputs[
        connectedEdge.sourceHandle!
      ];

    environment.phases[node.id].inputs[input.name] = outputValue;
  }
}

function createExecutionEnvironment(
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): ExecutionEnvironment {
  return {
    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => {
      environment.browser = browser;
    },
    getPage: () => environment.page,
    setPage: (page: Page) => {
      environment.page = page;
    },

    log: logCollector,
  };
}
