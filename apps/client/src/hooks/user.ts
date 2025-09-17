import { client } from "@/clients/api";
import { CURRENT_USER } from "@/graphql/query/user";
import { useQuery } from "@tanstack/react-query";

export const useGetCurrentUser = () => {
  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const res = await client.query({
          query: CURRENT_USER,
          fetchPolicy: "network-only",
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
