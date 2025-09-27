import { AvailableAction, AvailableTrigger, TaskParam } from "@/gql/graphql";
import { AppInvalidNodes, AppNode, AppNodeMissingInputs } from "@/schema/appNode";
import {
  workflowExecutionPlan,
  WorkflowExecutionPlanPhase,
} from "@/schema/workflow";
import { Edge, getIncomers } from "@xyflow/react";

export enum FlowToExecutionPlanTypeErrorType {
  NO_ENTRY_POINT = "NO_ENTRY_POINT",
  INVALID_INPUTS = "INVALID_INPUTS",
  INVALID_NODES = "INVALID_NODES",
}

type FlowToExecutionPlanType = {
  executionPlan?: workflowExecutionPlan;
  error?: {
    type: FlowToExecutionPlanTypeErrorType;
    invalidElements?: AppNodeMissingInputs[];
    invalidNodes?: AppInvalidNodes[];
  };
};

export function FlowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[],
  actions: AvailableAction[],
  trigger: AvailableTrigger | null
): FlowToExecutionPlanType {
  const entryPoint = nodes.find(
    (nd) => nd.data.type === trigger?.key && nd.data.trigger === true
  );

  if (!entryPoint) {
    return {
      error: {
        type: FlowToExecutionPlanTypeErrorType.NO_ENTRY_POINT,
      },
    };
  }

  const invalidActions = nodes.filter(
    (nd) =>
      nd.data.type !== trigger?.key &&
      !actions.find((a) => a.key === nd.data.type)
  );

  if (invalidActions.length > 0) {
    return {
      error: {
        type: FlowToExecutionPlanTypeErrorType.INVALID_NODES,
        invalidNodes: invalidActions.map((ma) => ({
          nodeId: ma.id,
        })),
      }
    }
  }

  const inputsWithErrors: AppNodeMissingInputs[] = [];

  const invalidInputs = getInvalidInputs(entryPoint, edges, new Set(), trigger?.taskInfo.inputs || []);
  if (invalidInputs.length > 0) {
    inputsWithErrors.push({
      nodeId: entryPoint.id,
      inputs: invalidInputs,
    });
  }
  const planned = new Set<string>();
  const executionPlan: workflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];

  planned.add(entryPoint.id);

  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };

    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) {
        continue;
      }
      const inputs = actions.find((a) => a.key === currentNode.data.type)?.taskInfo.inputs
      const invalidInputs = getInvalidInputs(currentNode, edges, planned, inputs || []);
      if (invalidInputs.length > 0) {
        const incomers = getIncomers(currentNode, nodes, edges);
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          inputsWithErrors.push({
            nodeId: currentNode.id,
            inputs: invalidInputs,
          });
        } else {
          // todo:
          continue;
        }
      }

      nextPhase.nodes.push(currentNode);
      planned.add(currentNode.id);
    }

    if (nextPhase.nodes.length > 0) {
      executionPlan.push(nextPhase);
    }
  }

  if (inputsWithErrors.length > 0) {
    return {
      error: {
        type: FlowToExecutionPlanTypeErrorType.INVALID_INPUTS,
        invalidElements: inputsWithErrors,
      },
};
  }

  return {
    executionPlan,
  };
}

function getInvalidInputs(
  node: AppNode,
  edges: Edge[],
  planned: Set<string>,
  inputs: TaskParam[]
): string[] {
  const invalidInputs: string[] = [];

  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    const inputValueProvided = inputValue?.length > 0;
    //  Provided by the user
    if (inputValueProvided) continue;

    const incomingEdges = edges.filter((ed) => ed.target === node.id);

    const inputEdgesByOutput = incomingEdges.find(
      (ed) => ed.targetHandle === input.name
    );

    const requiredInputProvided =
      input.required &&
      inputEdgesByOutput &&
      planned.has(inputEdgesByOutput.source);

    if (requiredInputProvided) continue;
    else if (!input.required) {
      if (!inputEdgesByOutput) continue;
      if (inputEdgesByOutput && planned.has(inputEdgesByOutput.source))
        continue;
    }
    invalidInputs.push(input.name);
  }

  return invalidInputs;
}
