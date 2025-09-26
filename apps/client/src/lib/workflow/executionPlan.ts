import { AppNode, AppNodeMissingInputs } from "@/schema/appNode";
import {
  workflowExecutionPlan,
  WorkflowExecutionPlanPhase,
} from "@/schema/workflow";
import { Edge, getIncomers } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";

export enum FlowToExecutionPlanTypeErrorType {
  NO_ENTRY_POINT = "NO_ENTRY_POINT",
  INVALID_INPUTS = "INVALID_INPUTS",
}

type FlowToExecutionPlanType = {
  executionPlan?: workflowExecutionPlan;
  error?: {
    type: FlowToExecutionPlanTypeErrorType;
    invalidElements?: AppNodeMissingInputs[];
  };
};

export function FlowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[]
): FlowToExecutionPlanType {
  const entryPoint = nodes.find(
    (nd) => TaskRegistry[nd.data.type].isEntryPoint
  );

  if (!entryPoint) {
    return {
      error: {
        type: FlowToExecutionPlanTypeErrorType.NO_ENTRY_POINT,
      },
    };
  }

  const inputsWithErrors: AppNodeMissingInputs[] = [];

  const invalidInputs = getInvalidInputs(entryPoint, edges, new Set());
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

      const invalidInputs = getInvalidInputs(currentNode, edges, planned);
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
  planned: Set<string>
): string[] {
  const invalidInputs: string[] = [];

  const inputs = TaskRegistry[node.data.type].inputs;

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
