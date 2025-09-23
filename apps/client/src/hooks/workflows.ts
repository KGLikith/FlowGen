import { client } from "@/clients/api";
import queryclient from "@/clients/queryClient";
import { CreateWorkflowPayload, UpdateWorkflowPayload } from "@/gql/graphql";
import {
  CREATE_WORKFLOW,
  DELETE_WORKFLOW,
  UPDATE_WORKFLOW,
} from "@/graphql/mutation/automation";
import { GET_WORKFLOW, GET_WORKFLOWS } from "@/graphql/query/automation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
        return {
          getWorkflows: [],
        };
      }
    },
  });

  return { ...query, workflowData: query.data?.getWorkflows };
};

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
    onError: (error) => {
      toast.error("Error deleting workflow", {
        description: "Please try again",
        duration: 2000,
        id: "delete_workflow",
      });
      console.log("Error deleting workflow:", (error as Error).message);
    },
  });
  return { ...mutation, deleteWorkflow: mutation.mutateAsync };
};

export const useUpdateWorkflow = (workflowId: string) => {
  const mutation = useMutation({
    mutationFn: async ({id,payload}: {id: string; payload: UpdateWorkflowPayload;}) => {
      try {
        const { data } = await client.mutate({
          mutation: UPDATE_WORKFLOW,
          variables: { id, payload },
        });
        return data;
      } catch (err) {
        console.log("Error updating workflow:", (err as Error).message);
        return null;
      }
    },
    onSuccess: async (data) => {
      console.log(data)
      await client.resetStore();
      await queryclient.invalidateQueries({ queryKey: ["workflow", workflowId] });
      toast.success("Workflow Updated Successfully", {
        duration: 2000,
        id: "update_workflow",
      });
    },
    onError: (error) => {
      toast.error("Error updating workflow", {
        description: "Please try again",
        duration: 2000,
        id: "update_workflow",
      });
      console.log("Error updating workflow:", (error as Error).message);
    },
  });
  return { ...mutation };
};
