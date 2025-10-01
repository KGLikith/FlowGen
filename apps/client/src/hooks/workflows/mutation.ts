import { client } from "@/clients/api";
import queryclient from "@/clients/queryClient";
import {
  CreateWorkflowPayload,
  RunWorkflowPayload,
  UpdateWorkflowPayload,
} from "@/gql/graphql";
import {
  CREATE_WORKFLOW,
  DELETE_WORKFLOW,
  PUBLISH_WORKFLOW,
  RUN_WORKFLOW,
  UNPUBLISH_WORKFLOW,
  UPDATE_WORKFLOW,
} from "@/graphql/mutation/automation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateWorkflow = () => {
  const mutation = useMutation({
    mutationFn: async (payload: CreateWorkflowPayload) => {
      const { data } = await client.mutate({
        mutation: CREATE_WORKFLOW,
        variables: { payload },
      });
      return data;
    },
    onSuccess: async (data) => {
      if (!data || !data.createWorkflow) {
        toast.error("Error creating workflow", {
          description: "Please try again",
          duration: 2000,
          id: "create_workflow",
        });
        return;
      }

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
      const { data } = await client.mutate({
        mutation: DELETE_WORKFLOW,
        variables: { id },
      });
      return data;
    },
    onSuccess: async (data) => {
      if (!data || !data.deleteWorkflow) {
        toast.error("Error deleting workflow", {
          description: "Please try again",
          duration: 2000,
          id: "delete_workflow",
        });
        return;
      }
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
      if (!data || !data.updateWorkflow) {
        toast.error("Error updating workflow", {
          description: "Please try again",
          duration: 2000,
          id: "update_workflow",
        });
        return;
      }
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
      console.log(error);
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
    mutationFn: async (form: RunWorkflowPayload) => {
      const { data } = await client.mutate({
        mutation: RUN_WORKFLOW,
        variables: { form },
      });
      return data?.runWorkflow;
    },
    onSuccess: async (data) => {
      if (!data || !data.id) {
        toast.error("Error running workflow", {
          description: "Please try again",
          duration: 2000,
          id: "run_workflow",
        });
        return;
      }
      await client.resetStore();
      await queryClient.invalidateQueries({ queryKey: ["workflows"] });
      await queryClient.invalidateQueries({ queryKey: ["workflow",data.id] });
      await queryClient.invalidateQueries({ queryKey: ["WorkflowExecutions",data.id] });
      toast.success("Workflow Started Successfully", {
        duration: 2000,
        id: "run_workflow",
      });
    },
    onError: (error) => {
      console.log(error, "error")
      toast.error("Error running workflow", {
        description: (error as Error).message || "Please try again",
        duration: 2000,
        id: "run_workflow",
      });
      return null;
    },
    onMutate: () => {
      toast.loading("Starting Workflow...", {
        duration: 2000,
        id: "run_workflow",
      });
    },
  });
};

export const usePublishWorkflow = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: RunWorkflowPayload) => {
      const { data } = await client.mutate({
        mutation: PUBLISH_WORKFLOW,
        variables: { form },
      });
      return data;
    },
    onSuccess: async (data) => {
      if (!data || !data.publishWorkflow) {
        toast.error("Error publishing workflow", {
          description: "Please try again",
          duration: 2000,
          id: "publish_workflow",
        });
        return;
      }
      await client.resetStore();
      await queryClient.invalidateQueries({ queryKey: ["workflow",id] });
      await queryClient.invalidateQueries({ queryKey: ["workflows"] });
      toast.success("Workflow Published Successfully", {
        duration: 2000,
        id: "publish_workflow",
      });
    },
    onError: (error) => {
      toast.error("Error publishing workflow", {
        description: (error as Error).message || "Please try again",
        duration: 2000,
        id: "publish_workflow",
      });
      return null;
    },
    onMutate: () => {
      toast.loading("Publishing Workflow...", {
        duration: 2000,
        id: "publish_workflow",
      });
    },
  });
};

export const useUnpublishWorkflow = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await client.mutate({
        mutation: UNPUBLISH_WORKFLOW,
        variables: { id },
      });
      return data;
    },
    onSuccess: async (data) => {
      if (!data || !data.unpublishWorkflow) {
        toast.error("Error unpublishing workflow", {
          description: "Please try again",
          duration: 2000,
          id: "unpublish_workflow",
        });
        return;
      }
      await client.resetStore();
      await queryClient.invalidateQueries({ queryKey: ["workflow", id] });
      await queryClient.invalidateQueries({ queryKey: ["workflows"] });
      toast.success("Workflow Unpublished Successfully", {
        duration: 2000,
        id: "unpublish_workflow",
      });
    },
    onError: (error) => {
      toast.error("Error unpublishing workflow", {
        description: (error as Error).message || "Please try again",
        duration: 2000,
        id: "unpublish_workflow",
      });
      return null;
    },
    onMutate: () => {
      toast.loading("Unpublishing Workflow...", {
        duration: 2000,
        id: "unpublish_workflow",
      });
    }
  });
}
