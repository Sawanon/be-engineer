import {
   addMultiTrackingProps,
   addTrackingProps,
   deliverProps,
   deliveryTypeProps,
} from "@/@type";
import {
   addMultiTracking,
   addTracking,
   changeType,
   deliveryPrismaProps,
   getDeliver,
   getInfinityDeliver,
   getTrackingByWebappIdArr,
   receiveOrder,
   updateAddress,
} from "@/lib/actions/deliver.actions";
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

export const useDeliver = () => {
   return useQuery({
      queryKey: ["deliver"],
      queryFn: async () => {
         const masterDeliver = await getDeliver();
         const groupDeliver: Record<string, deliverProps> = {};
         const idArr = masterDeliver.map((deliver: deliverProps) => {
            groupDeliver[deliver.id] = deliver;
            return deliver.id;
         });
         const getTracking = await getTrackingByWebappIdArr(idArr);
         // const groupTracking: Record<string, deliveryPrismaProps> = {};
         getTracking?.forEach((track) => {
            groupDeliver[track.webappOrderId]["tracking"] = track;
            // groupTracking[track.webappOrderId] = track;
         });
         return groupDeliver;
      },
      refetchInterval: 5 * 60 * 1000, // refetch every x minute
   });
};
export const useInfinityDeliver = ({}) => {
   return useInfiniteQuery({
      refetchInterval: 5 * 60 * 1000, // refetch every x minute
      queryKey: ["deliver_infinity"],
      queryFn: async (props) => {
         const masterDeliver = await getInfinityDeliver({
            pageParam: props.pageParam,
         });
         const groupDeliver: Record<string, deliverProps> = {};
         const idArr = masterDeliver.data.map((deliver: deliverProps) => {
            groupDeliver[deliver.id] = deliver;
            return deliver.id;
         });

         const getTracking = await getTrackingByWebappIdArr(idArr);
         const groupTrack: Record<string, deliveryPrismaProps> = {};
         getTracking?.forEach((track) => {
            groupDeliver[track.webappOrderId.toString()]["tracking"] = track;
            groupTrack[track.webappOrderId.toString()] = track;
         });

         masterDeliver.data.forEach((delivery) => {
            delivery["tracking"] = groupTrack[delivery.id];
         });
         return {
            data: groupDeliver,
            nextPage: masterDeliver.nextPage,
            dataArr: masterDeliver.data,
         };
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => lastPage.nextPage,
   });
};

export const useAddTracking = ({
   onSuccess,
   onError,
}: {
   onSuccess?: () => void;

   onError?: (error: Error) => void;
}) => {
   return useMutation({
      mutationFn: (data: addTrackingProps) => {
         return addTracking(data);
      },
      onError(error, variables, context) {
         if (onError) onError(error);
      },
      onSuccess(data, variables, context) {
         if (onSuccess) onSuccess();
      },
   });
};

export const useAddMultiTracking = ({
   onSuccess,
   onError,
}: {
   onSuccess?: () => void;

   onError?: (error: Error) => void;
}) => {
   return useMutation({
      mutationFn: (data: addMultiTrackingProps) => {
         return addMultiTracking(data);
      },
      onError(error, variables, context) {
         if (onError) onError(error);
      },
      onSuccess(data, variables, context) {
         if (onSuccess) onSuccess();
      },
   });
};

export const useUpdateAddress = ({
   onSuccess,
   onError,
}: {
   onSuccess?: () => void;
   onError?: (error: Error) => void;
}) => {
   return useMutation({
      mutationFn: (
         data: Pick<
            addTrackingProps,
            "updateAddress" | "webappOrderId" | "courseId"
         >
      ) => {
         return updateAddress(data);
      },
      onError(error, variables, context) {
         if (onError) onError(error);
      },
      onSuccess(data, variables, context) {
         if (onSuccess) onSuccess();
      },
   });
};
export const useUpdatePickup = ({
   onSuccess,
   onError,
}: {
   onSuccess?: () => void;
   onError?: (error: Error) => void;
}) => {
   return useMutation({
      mutationFn: (
         data: Pick<addTrackingProps, "note" | "webappOrderId" | "courseId">
      ) => {
         return receiveOrder(data);
      },
      onError(error, variables, context) {
         if (onError) onError(error);
      },
      onSuccess(data, variables, context) {
         if (onSuccess) onSuccess();
      },
   });
};

export const useChangeType = ({
   onSuccess,
   onError,
}: {
   onSuccess?: () => void;
   onError?: (error: Error) => void;
}) => {
   return useMutation({
      mutationFn: (
         data: { courseId: string[] } & Pick<
            NonNullable<deliveryPrismaProps>,
            "type" | "webappOrderId"
         >
      ) => {
         return changeType(data);
      },
      onError(error, variables, context) {
         console.error(error);
         if (onError) onError(error);
      },
      onSuccess(data, variables, context) {
         if (onSuccess) onSuccess();
      },
   });
};
