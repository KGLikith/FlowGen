import { client } from "@/clients/api";
import queryClient from "@/clients/queryClient";
import { CreateCredentialPayload } from "@/gql/graphql";
import { CREATE_CREDENTIAL, DELETE_CREDENTIAL } from "@/graphql/mutation/user";
import {
  CURRENT_USER,
  GET_CREDENTIAL,
  GET_CREDENTIALS,
} from "@/graphql/query/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetCurrentUser = () => {
  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const res = await client.query({
          query: CURRENT_USER,
        });
        return res.data;
      } catch (err) {
        console.log("Error fetching current user:", (err as Error).message);
        return null;
      }
    },
  });
  return { ...query, user: query.data?.getCurrentUser || null };
};

export const useGetCredentials = () => {
  const query = useQuery({
    queryKey: ["credentials"],
    queryFn: async () => {
      try {
        const res = await client.query({
          query: GET_CREDENTIALS,
        });
        return res.data;
      } catch (err) {
        toast.error("Failed to fetch credentials. Please try again.");
        return null;
      }
    },
  });
  return { ...query, credentials: query.data?.getCredentials || [] };
};

export const useGetCredential = (id: string) => {
  const query = useQuery({
    queryKey: ["credential", id],
    queryFn: async () => {
      try {
        const res = await client.query({
          query: GET_CREDENTIAL,
          variables: { id },
        });
        return res.data;
      } catch (err) {
        console.log("Error fetching credential:", (err as Error).message);
        return null;
      }
    },
    enabled: !!id,
  });
  return { ...query, credential: query.data?.getCredential || null };
};

export const useCreateCredential = () => {
  const mutation = useMutation({
    mutationFn: async (payload: CreateCredentialPayload) => {
      try {
        const res = await client.mutate({
          mutation: CREATE_CREDENTIAL,
          variables: { payload },
        });
        return res.data;
      } catch (err) {
        console.log("Error creating credential:", (err as Error).message);
        return null;
      }
    },
    mutationKey: ["createCredential"],
    onSuccess: async(data) => {
      if(!data || !data.createCredential) {
        toast.error("Failed to create credential. Please try again.");
        return;
      }
      toast.success("Credential created successfully!");
      await client.resetStore();
      await queryClient.invalidateQueries({ queryKey: ["credentials"] });
    }
  });

  return mutation;
};

export const useDeleteCredential = () => {
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const res = await client.mutate({
          mutation: DELETE_CREDENTIAL,
          variables: { id },
        });
        return res.data;
      } catch (err) {
        console.log("Error deleting credential:", (err as Error).message);
        return null;
      }
    },
    mutationKey: ["deleteCredential"],
    onSuccess: async(data) => {
      if(!data || !data.deleteCredential) {
        toast.error("Failed to delete credential. Please try again.");
        return;
      }
      toast.success("Credential deleted successfully!");
      await client.resetStore();
      await queryClient.invalidateQueries({ queryKey: ["credentials"] });
    }
    
  });
  return mutation;
};
