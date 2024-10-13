import { getDeliver } from "@/lib/actions/deliver";
import { useQuery } from "@tanstack/react-query";

export const useDeliver = () => {
   return useQuery({
      queryKey: ["deliver"],
      queryFn: async () => {
         return await getDeliver();
      },
      refetchInterval: 5* 60 * 1000, // refetch every x minute
   });
};
