import { client } from "@/clients/api";
import { CreateWorkflowPayload } from "@/gql/graphql";
import {
  createWorkflowMutation,
  deleteWorkflowMutation,
} from "@/graphql/mutation/automation";
import { GET_WORKFLOW, GET_WORKFLOWS } from "@/graphql/query/automation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
        return {
          getWorkflows: [],
        };
      }
    },
  });

  return { ...query, workflowData: query.data?.getWorkflows };
};

export const useCreateWorkflow = () => {
  const queryclient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: CreateWorkflowPayload) => {
      try {
        const { data } = await client.mutate({
          mutation: createWorkflowMutation,
          variables: { payload },
        });
        return data;
      } catch (err) {
        console.log("Error creating workflow:", (err as Error).message);
        return null;
      }
    },
    onSuccess: async () => {
      await client.resetStore();
      await queryclient.invalidateQueries({ queryKey: ["workflows"] });
      toast.success("Workflow Created Successfully", {
        duration: 2000,
        id: "create_workflow",
      });
    },
    onError: (error) => {
      toast.error("Error creating workflow", {
        description: "Please try again",
        duration: 2000,
        id: "create_workflow",
      });
    },
  });
  return { ...mutation, createWorkflow: mutation.data?.createWorkflow };
};

export const useDeleteWorkflow = () => {
  const queryclient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (workflowId: string) => {
      try {
        const { data } = await client.mutate({
          mutation: deleteWorkflowMutation,
          variables: { id: workflowId },
        });
        return data;
      } catch (err) {
        console.log("Error deleting workflow:", (err as Error).message);
        return null;
      }
    },
    onSuccess: async () => {
      await client.resetStore();
      await queryclient.invalidateQueries({ queryKey: ["workflows"] });
      toast.success("Workflow Deleted Successfully", {
        duration: 2000,
      });
    },
  });
  return { ...mutation, deleteWorkflow: mutation.data?.deleteWorkflow };
};

export const useGetWorkflow = (workflowId: string) => {
  const query = useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: async () => {
      try {
        console.log(workflowId, "workflowId in useGetWorkflow")
        const res = await client.query({
          query: GET_WORKFLOW,
          variables: { id: workflowId },
        });
        return res.data;
      } catch (err) {
        console.log("Error fetching workflow:", (err as Error).message);
        return {
          getWorkflow: null
        };
      }
    },
  });
  return { ...query, workflow: query.data?.getWorkflow };
};
