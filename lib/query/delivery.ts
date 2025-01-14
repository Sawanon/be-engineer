import {
  addMultiTrackingProps,
  addTrackingProps,
  deliveryTypeProps,
  updateTrackingProps,
} from "@/@type";
import { DeliverFilter } from "@/components/Deliver/form";
import {
  addMultiTracking,
  addTracking,
  changeType,
  deliveryPrismaProps,
  getDeliver,
  getDeliverByFilter,
  getDeliverById,
  getDeliverByIds,
  getInfinityDeliver,
  getTrackingByWebappIdArr,
  receiveOrder,
  updateAddress,
  updateDeliver,
} from "@/lib/actions/deliver.actions";
import { DocumentBook, Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { addRecordData } from "../actions/record.actions";
import _ from "lodash";

export const formatCourse = (
  delivery: NonNullable<Awaited<ReturnType<typeof getDeliverByIds>>[0]>
) => {
  let bookLesson: ({
    DocumentBook: DocumentBook;
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
      console.log("lesson", lesson);
      if (lesson.LessonOnDocumentBook.length > 0) {
        // bookLesson.push(lesson.LessonOnDocumentBook)
        bookLesson = [...bookLesson, ...lesson.LessonOnDocumentBook];
      }
      if (lesson.LessonOnDocument.length > 0) {
        preExamLesson = [...preExamLesson, ...lesson.LessonOnDocument];
      }
      if (lesson.LessonOnDocumentSheet.length > 0) {
        sheetLesson = [...sheetLesson, ...lesson.LessonOnDocumentSheet];
      }
    });
  });
  return {
    bookLesson: _.uniqBy(bookLesson, "bookId"),
    preExamLesson: _.uniqBy(preExamLesson, "preExamId"),
    sheetLesson: _.uniqBy(sheetLesson, "sheetId"),
  };
};
export const formatRecord = (
  delivery: NonNullable<Awaited<ReturnType<typeof getDeliverByIds>>[0]>
) => {
  let bookRecord: (typeof delivery.RecordBook)[0][] = [];
  let sheetRecord: (typeof delivery.RecordSheet)[0][] = [];
  console.log("delivery 86", delivery);
  delivery.RecordBook?.forEach((book) => {
    bookRecord.push(book);
  });
  delivery.RecordSheet?.forEach((sheet) => {
    sheetRecord.push(sheet);
  });
  return { bookRecord, sheetRecord };
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

export const useDeliverByFilter = (
  props: DeliverFilter & { page: number },
  initData?: Awaited<ReturnType<typeof getDeliverByFilter>>
) => {
  return useQuery({
    queryKey: ["deliver", props],
    queryFn: async () => {
      const masterDeliver = await getDeliverByFilter(props);
      return masterDeliver;
    },
    //  enabled:false,
    //   initialData: props.status === "pickup,ship" && props.page === 1 ? initData : undefined,
    refetchInterval: 5 * 60 * 1000, // refetch every x minute
  });
};

export const useDeliverByIds = (Ids: number[] | undefined) => {
  return useQuery({
    queryKey: ["deliverByIds", Ids],
    queryFn: async () => {
      const masterDeliver = await getDeliverByIds(Ids!);
      return masterDeliver;
    },
    refetchInterval: 5 * 60 * 1000, // refetch every x minute
    enabled: Ids !== undefined && Ids.length !== 0,
  });
};
export const useDeliverById = (Id: number | undefined, enabled: boolean) => {
  return useQuery({
    queryKey: ["deliverById", Id],
    queryFn: async () => {
      const masterDeliver = await getDeliverById(Id!);
      return masterDeliver;
    },
    refetchInterval: 5 * 60 * 1000, // refetch every x minute
    enabled,
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
      const groupDeliver: Record<string, NonNullable<deliveryPrismaProps>> = {};
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
  onSuccess?: (data: Awaited<ReturnType<typeof addTracking>>) => void;

  onError?: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: (data: addTrackingProps) => {
      return addTracking(data);
    },
    onError(error, variables, context) {
      if (onError) onError(error);
    },
    async onSuccess(data, variables, context) {
      try {
        await addRecordData(data!.id);
      } catch (error) {
        console.log("error", error);
      }
      if (onSuccess) onSuccess(data);
    },
  });
};
export const useUpdateTracking = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;

  onError?: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: (data: updateTrackingProps) => {
      return updateDeliver(data);
    },
    onError(error, variables, context) {
      if (onError) onError(error);
    },
    async onSuccess(data, variables, context) {
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
    mutationFn: (
      data: Pick<
        addTrackingProps,
        "note" | "id" | "webappAdminId" | "webappAdminUsername"
      >
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
  onSuccess?: (data: Awaited<ReturnType<typeof changeType>>) => void;
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
      if (onSuccess) onSuccess(data);
    },
  });
};
