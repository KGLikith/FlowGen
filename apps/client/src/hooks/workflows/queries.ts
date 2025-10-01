import { client } from "@/clients/api";
import {
  GET_AVAILABLE_ACTIONS,
  GET_AVAILABLE_ACTIONS_FOR_TRIGGERS,
  GET_AVAILABLE_TRIGGERS,
  GET_WORKFLOW,
  GET_WORKFLOW_EXECUTION,
  GET_WORKFLOW_EXECUTIONS,
  GET_WORKFLOWS,
} from "@/graphql/query/automation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetWorkflow = (workflowId: string) => {
  const query = useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: async () => {
      try {
        const res = await client.query({
          query: GET_WORKFLOW,
          variables: { id: workflowId },
        });
        return res.data;
      } catch (err) {
        console.log("Error fetching workflow:", (err as Error).message);
        toast.error("Error fetching workflow", {
          description: (err as Error).message || "Please try again",
          duration: 2000,
          id: "fetch_workflow",
        });
        return {
          getWorkflow: null,
        };
      }
    },
  });
  return { ...query, workflow: query.data?.getWorkflow };
};

export const useGetWorkflows = () => {
  const query = useQuery({
    queryKey: ["workflows"],
    queryFn: async () => {
      try {
        const res = await client.query({
          query: GET_WORKFLOWS,
        });
        return res.data;
      } catch (err) {
        console.log("Error fetching workflows:", (err as Error).message);
        toast.error("Error fetching workflows", {
          description: (err as Error).message || "Please try again",
          duration: 2000,
          id: "fetch_workflows",
        });
        return {
          getWorkflows: [],
        };
      }
    },
  });

  return { ...query, workflowData: query.data?.getWorkflows };
};

export const useGetAvailableTriggers = (triggerId?: string) => {
  const query = useQuery({
    queryKey: ["AvailableTriggers"],
    queryFn: async () => {
      try {
        const res = await client.query({
          query: GET_AVAILABLE_TRIGGERS,
        });
        return res.data;
      } catch (err) {
        console.log(err);
        toast.error("Error fetching available triggers", {
          description: (err as Error).message || "Please try again",
          duration: 2000,
          id: "fetch_available_triggers",
        });

        return null;
      }
    },
    enabled: !triggerId,
  });
  return { ...query, triggers: query.data?.getAvailableTriggers };
};

export const useGetAvailableActions = () => {
  const query = useQuery({
    queryKey: ["AvailableActions"],
    queryFn: async () => {
      try {
        const res = await client.query({
          query: GET_AVAILABLE_ACTIONS,
        });
        return res.data;
      } catch (err) {
        console.log(err);
        toast.error("Error fetching available actions", {
          description: (err as Error).message || "Please try again",
          duration: 2000,
          id: "fetch_available_actions",
        });
        return null;
      }
    },
  });
  return { ...query, actions: query.data?.getAvailableActions };
};

export const useGetAvailableActionsForTrigger = (
  triggerId: string | undefined
) => {
  return useQuery({
    queryKey: ["AvailableActions", triggerId],
    queryFn: async () => {
      try {
        if (!triggerId) return null;
        const res = await client.query({
          query: GET_AVAILABLE_ACTIONS_FOR_TRIGGERS,
          variables: {
            triggerId,
          },
        });
        return res.data?.getAvailableActionsForTrigger;
      } catch (err) {
        console.log(err);
        toast.error("Error fetching available actions", {
          description: (err as Error).message || "Please try again",
          duration: 2000,
          id: "fetch_available_actions",
        });

        return null;
      }
    },
    enabled: !!triggerId,
  });
};

export const useGetWorkflowExecutionWithPhases = (executionId: string) => {
  const query = useQuery({
    queryKey: ["WorkflowExecution", executionId],
    queryFn: async () => {
      try {
        const res = await client.query({
          query: GET_WORKFLOW_EXECUTION,
          variables: { executionId },
          fetchPolicy: "network-only",
        });
        return res.data;
      } catch (err) {
        console.log(
          "Error fetching workflow execution:",
          (err as Error).message
        );
        toast.error("Error fetching workflow execution", {
          description: (err as Error).message || "Please try again",
          duration: 2000,
          id: "fetch_workflow_execution",
        });

        return {
          getWorkflowExecution: null,
        };
      }
    },
    refetchInterval: 3000,
  });
  return { ...query, workflowExecution: query.data?.getWorkflowExecution };
};

export const useGetWorkflowExecutions = (workflowId: string) => {
  const query = useQuery({
    queryKey: ["WorkflowExecutions", workflowId],
    queryFn: async () => {
      try {
        const res = await client.query({
          query: GET_WORKFLOW_EXECUTIONS,
          variables: { workflowId },
          fetchPolicy: "network-only",
        });
        return res.data;
      } catch (err) {
        console.log(
          "Error fetching workflow executions:",
          (err as Error).message
        );
        toast.error("Error fetching workflow executions", {
          description: (err as Error).message || "Please try again",
          duration: 2000,
          id: "fetch_workflow_executions",
        });
        return {
          getWorkflowExecutions: [],
        };
      }
    },
    refetchInterval: 5000,
    enabled: !!workflowId,
  });
  return { ...query, workflowExecutions: query.data?.getWorkflowExecutions };
};