import {
   addMultiTrackingProps,
   addTrackingProps,
   deliveryTypeProps,
} from "@/@type";
import { DeliverFilter } from "@/components/Deliver/form";
import {
   addMultiTracking,
   addTracking,
   changeType,
   deliveryPrismaProps,
   getDeliver,
   getDeliverByIds,
   getInfinityDeliver,
   getTrackingByWebappIdArr,
   receiveOrder,
   updateAddress,
} from "@/lib/actions/deliver.actions";
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const formatCourse = (
   delivery: NonNullable<Awaited<ReturnType<typeof getDeliverByIds>>[0]>
) => {
   let bookLesson: ({
      DocumentBook: {
         id: number;
         name: string;
         image: string | null;
         inStock: number | null;
      };
   } & {
      lessonId: number;
      bookId: number;
   })[] = [];
   let preExamLesson: ({
      DocumentPreExam: {
         id: number;
         name: string;
         url: string;
      };
   } & {
      lessonId: number;
      preExamId: number;
   })[] = [];
   let sheetLesson: ({
      DocumentSheet: {
         id: number;
         name: string;
         url: string;
      };
   } & {
      lessonId: number;
      sheetId: number;
   })[] = [];

   delivery.Delivery_Course?.forEach((course) => {
      course.Course?.CourseLesson?.forEach((lesson) => {
         if (lesson.LessonOnDocumentBook.length > 0) {
            bookLesson = lesson.LessonOnDocumentBook;
         }
         if (lesson.LessonOnDocument.length > 0) {
            preExamLesson = lesson.LessonOnDocument;
         }
         if (lesson.LessonOnDocumentSheet.length > 0) {
            sheetLesson = lesson.LessonOnDocumentSheet;
         }
      });
   });
   return { bookLesson, preExamLesson, sheetLesson };
};

export const useDeliver = () => {
   return useQuery({
      queryKey: ["deliver"],
      queryFn: async () => {
         const masterDeliver = await getDeliver();
         return masterDeliver;
      },
      refetchInterval: 5 * 60 * 1000, // refetch every x minute
   });
};

export const useDeliverByIds = (Ids: number[] | undefined) => {
   return useQuery({
      queryKey: ["deliver", Ids],
      queryFn: async () => {
         const masterDeliver = await getDeliverByIds(Ids!);
         return masterDeliver;
      },
      refetchInterval: 5 * 60 * 1000, // refetch every x minute
      enabled: Ids !== undefined,
   });
};

export const useInfinityDeliver = (search: DeliverFilter) => {
   return useInfiniteQuery({
      refetchInterval: 5 * 60 * 1000, // refetch every x minute
      queryKey: ["deliver_infinity"],
      queryFn: async (props) => {
         const masterDeliver = await getInfinityDeliver({
            pageParam: props.pageParam,
            search,
         });
         const groupDeliver: Record<
            string,
            NonNullable<deliveryPrismaProps>
         > = {};
         // const idArr = masterDeliver.data.map((deliver: deliveryPrismaProps) => {
         //    groupDeliver[deliver.id] = deliver;
         //    return deliver.id;
         // });

         // const getTracking = await getTrackingByWebappIdArr(idArr);
         // const groupTrack: Record<string, deliveryPrismaProps> = {};
         // getTracking?.forEach((track) => {
         //    groupDeliver[track.webappOrderId.toString()]["tracking"] = track;
         //    groupTrack[track.webappOrderId.toString()] = track;
         // });

         // masterDeliver.data.forEach((delivery) => {
         //    delivery["tracking"] = groupTrack[delivery.id];
         // });
         return {
            data: groupDeliver,
            nextPage: masterDeliver.nextPage,
            dataArr: masterDeliver.data as NonNullable<deliveryPrismaProps>[],
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
   onSuccess?: (data: Awaited<ReturnType<typeof updateAddress>>) => void;
   onError?: (error: Error) => void;
}) => {
   return useMutation({
      mutationFn: (data: { id: number; updateAddress: string }) => {
         return updateAddress(data);
      },
      onError(error, variables, context) {
         if (onError) onError(error);
      },
      onSuccess(data, variables, context) {
         if (onSuccess) onSuccess(data);
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
      mutationFn: (data: Pick<addTrackingProps, "note" | "id">) => {
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
         data: Pick<NonNullable<deliveryPrismaProps>, "type" | "id">
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
