import { client } from "@/clients/api";
import queryclient from "@/clients/queryClient";
import { CreateWorkflowPayload, UpdateWorkflowPayload } from "@/gql/graphql";
import {
  CREATE_WORKFLOW,
  DELETE_WORKFLOW,
  RUN_WORKFLOW,
  UPDATE_WORKFLOW,
} from "@/graphql/mutation/automation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateWorkflow = () => {
  const mutation = useMutation({
    mutationFn: async (payload: CreateWorkflowPayload) => {
      try {
        const { data } = await client.mutate({
          mutation: CREATE_WORKFLOW,
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
  });
  return { ...mutation, createWorkflow: mutation.data?.createWorkflow };
};

export const useDeleteWorkflow = () => {
  const mutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      try {
        const { data } = await client.mutate({
          mutation: DELETE_WORKFLOW,
          variables: { id },
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
        id: "delete_workflow",
      });
    },
  });
  return { ...mutation, deleteWorkflow: mutation.mutateAsync };
};

export const useUpdateWorkflow = (workflowId: string) => {
  const mutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateWorkflowPayload;
    }) => {
      const { data } = await client.mutate({
        mutation: UPDATE_WORKFLOW,
        variables: { id, payload },
      });
      return data;
    },
    onSuccess: async (data) => {
      await client.resetStore();
      await queryclient.invalidateQueries({
        queryKey: ["workflow", workflowId],
      });
      toast.success("Workflow Updated Successfully", {
        duration: 2000,
        id: "update_workflow",
      });
    },
    onError: (error) => {
      toast.error("Error updating workflow", {
        description: (error as Error).message || "Please try again",
        duration: 2000,
        id: "update_workflow",
      });
    },
  });
  return { ...mutation };
};

export const useRunWorkflow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: {
      workflowId: string;
      flowDefinition?: string;
      name: string;
      executionPlan: string;
    }) => {
      const { data } = await client.mutate({
        mutation: RUN_WORKFLOW,
        variables: { form },
      });
      return data?.runWorkflow;
    },
    onSuccess: async () => {
      await client.resetStore();
      await queryClient.invalidateQueries({ queryKey: ["workflows"] });
      toast.success("Workflow Started Successfully", {
        duration: 2000,
        id: "run_workflow",
      });
    },
    onError: (error) => {
      toast.error("Error running workflow", {
        description: (error as Error).message || "Please try again",
        duration: 2000,
        id: "run_workflow",
      });
      return null;
    },
  });
};
