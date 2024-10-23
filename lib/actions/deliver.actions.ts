"use server";

import axios from "axios";
import { handleError, parseStringify } from "../util";
import {
   addMultiTrackingProps,
   addTrackingProps,
   courseProps,
   deliveryProps,
} from "@/@type";
import { PrismaClient } from "@prisma/client";
import {
   addDeliverShipService,
   getShipServiceByName,
} from "./delivery_ship.actions";
import { deliveryType } from "../res/const";
import _ from "lodash";
import { getCourseByWebappId } from "./course.actions";
import async from "async";
import { cache } from "react";
import { revalidatePath, revalidateTag } from "next/cache";
import { DeliverFilter } from "@/components/Deliver/form";
const { B_API_KEY, B_END_POINT } = process.env;
const prisma = new PrismaClient();
export type deliveryPrismaProps = NonNullable<
   Awaited<ReturnType<typeof prisma.delivery.findFirst>>
>;
type RequireddeliveryPrismaProps =
   | "status"
   | "type"
   | "webappOrderId"
   | "webappCourseId";
export type DeliverRes = Awaited<ReturnType<typeof getDeliver>>;
// export type deliveryPrismaProps = DeliverRes["data"][0]

export const refetchData = () => {
   console.log("Revalidate");
   revalidatePath("/deliver");
   // revalidateTag("getDeliver");
};

export const getLatestId = async (branch: "ODM" | "KMITL") => {
   try {
      const res = await axios({
         method: "GET",
         url: `${B_END_POINT}/api/deliver/latest-id?branch=${branch.toUpperCase()}`,
         headers: {
            "B-API-KEY": B_API_KEY,
         },
      });
      return res.data;
   } catch (error) {
      throw handleError(error);
   } finally {
      // prisma.$disconnect();
   }
};

export const getDeliver = cache(async () => {
   try {
      console.time("get deliver");
      const res = await prisma.delivery.findMany({
         include: {
            Delivery_Course: {
               include: {
                  Course: true,
               },
               // Course: {
               //    include: {
               //       CourseLesson: {
               //          include: {
               //             LessonOnDocument: true,
               //             LessonOnDocumentBook: true,
               //             LessonOnDocumentSheet: true,
               //          },
               //       },
               //    },
               // },
            },
            Delivery_WebappCourse: {
               include: {
                  WebappCourse: true,
               },
            },
         },
         orderBy: { id: "desc" },
         take: 500000,
      });
      const count = await prisma.delivery.count();
      console.timeEnd("get deliver");

      return parseStringify({
         total: count,
         data: res,
      });
   } catch (e) {
      throw handleError(e);
   } finally {
      prisma.$disconnect();
   }
});
export const getDeliverByIds = cache(async (Ids: number[]) => {
   try {
      const res = await prisma.delivery.findMany({
         where: {
            id: { in: Ids },
         },
         include: {
            Delivery_Course: {
               include: {
                  Course: {
                     include: {
                        CourseLesson: {
                           include: {
                              LessonOnDocument: {
                                 include: {
                                    DocumentPreExam: true,
                                 },
                              },
                              LessonOnDocumentBook: {
                                 include: {
                                    DocumentBook: true,
                                 },
                              },
                              LessonOnDocumentSheet: {
                                 include: {
                                    DocumentSheet: true,
                                 },
                              },
                           },
                        },
                     },
                  },
               },
            },
            Delivery_WebappCourse: {
               include: {
                  WebappCourse: true,
               },
            },
         },
         orderBy: { id: "desc" },
         take: 500000,
      });

      return parseStringify(res);
   } catch (e) {
      throw handleError(e);
   } finally {
      prisma.$disconnect();
   }
});
export const getInfinityDeliver = cache(
   async ({
      pageParam = 1,
      search,
   }: {
      search: DeliverFilter;
      pageParam?: number;
   }) => {
      try {
         const filter = {};

         // switch(search.status){

         // }

         const res = await prisma.delivery.findMany({
            orderBy: [{ id: "desc" }],
            take: 100,
            skip: (pageParam - 1) * 100,
            where: {
               approved: {
                  lte: new Date(),
                  gte: new Date(),
               },
               member: {
                  contains: "test",
               },
               branch: {
                  contains: "master",
               },
            },
            include: {
               Delivery_Course: {
                  include: {
                     Course: true,
                  },
               },
               Delivery_WebappCourse: {
                  include: {
                     WebappCourse: true,
                  },
               },
               DeliverShipService: true,
               //#endregion
            },
         });

         const count = await prisma.delivery.count();

         const data = res as deliveryPrismaProps[];

         // if (data.length < 100) {
         //    return { data: data };
         // }
         // return parseStringify({ data: data, nextOffset: pageParam + 1 }) as {
         //    data: deliveryPrismaProps[];
         //    nextOffset: number;
         // };

         if (data.length < 100) {
            return parseStringify({
               total: count,
               data,
               nextPage: undefined,
            });
         }
         return parseStringify({
            total: count,
            data,
            nextPage: pageParam + 1,
         });
      } catch (e) {
         throw handleError(e);
      }
   }
);

export const getTrackingByWebappIdArr = async (webappId: number[]) => {
   try {
      const res = await prisma.delivery.findMany({
         where: {
            webappOrderId: { in: webappId },
         },

         // include: {
         //    DeliverShipService: true,
         //  },
      });
      return parseStringify(res);
   } catch (error) {
      handleError(error);
   } finally {
      prisma.$disconnect();
   }
};

export const getTrackingByWebappId = async (webAppOrderId: number) => {
   try {
      const res = await prisma.delivery.findFirst({
         where: {
            webappOrderId: webAppOrderId,
         },
         include: {
            // DeliverShipService: true,
            Course: true,
            Delivery_Course: {
               include: {
                  Course: true,
               },
            },
         },
      });
      return parseStringify(res);
   } catch (error) {
      throw handleError(error);
   } finally {
      prisma.$disconnect();
   }
};
export const getTrackingById = async (id: number) => {
   try {
      const res = await prisma.delivery.findFirst({
         where: {
            id,
         },
         include: {
            // DeliverShipService: true,
            Course: true,
            Delivery_Course: {
               include: {
                  Course: true,
               },
            },
         },
      });
      return parseStringify(res);
   } catch (error) {
      handleError(error);
   } finally {
      prisma.$disconnect();
   }
};

export const updateAddress = async ({
   updateAddress,
   id,
}: // courseId,
{
   id: number;
   updateAddress: string;
}) => {
   try {
      const getDelivery = await getTrackingById(id);
      console.log("getDelivery", getDelivery);
      if (_.isEmpty(getDelivery)) {
         // const res = await createDelivery({
         //    type: "ship",
         //    status: "waiting",
         //    updatedAddress: updateAddress,
         //    webappOrderId,
         //    // webappCourseId: courseId?.toString(),
         // });
         // return parseStringify(res);
      } else {
         const res = await prisma.delivery.update({
            where: {
               id: getDelivery.id,
            },
            data: {
               type: "ship",
               status: getDelivery.status,
               updatedAddress: updateAddress,
            },
         });
         refetchData();
         return parseStringify(res);
      }
   } catch (error) {
      console.log("error", error);
      throw handleError(error);
   } finally {
      prisma.$disconnect();
   }
};
export const addMultiTracking = async ({
   deliveryData,
   service,
   ids,
   courseIds,
}: addMultiTrackingProps) => {
   try {
      const getShipService = await getShipServiceByName(service);
      const getDeliveries = await getTrackingByWebappIdArr(ids);
      const groupDelivery: Record<string, deliveryPrismaProps> = {};
      getDeliveries?.forEach((delivery) => {
         groupDelivery[delivery.webappOrderId.toString()] = delivery;
      });
      async.forEachOf(deliveryData, async (delivery, key, callback) => {
         console.log("delivery", delivery);
         const res = await prisma.delivery.update({
            where: {
               // webappOrderId: webAppOrderId,
               id: delivery.id,
            },
            data: {
               type: "ship",
               status: "success",
               trackingCode: delivery.trackingCode,
               updatedAt: new Date(),
            },
         });
         refetchData();
         return parseStringify(res);
      });
   } catch (error) {
      throw handleError(error);
   } finally {
      prisma.$disconnect();
   }
};
export const addTracking = async ({
   updateAddress,
   trackingCode,
   note,
   service,
   id,
}: // courseId,
addTrackingProps) => {
   try {
      // TODO: need to check duplicate or not
      const getShipService = await getShipServiceByName(service);
      const res = await prisma.delivery.update({
         where: {
            // webappOrderId: webAppOrderId,
            id: id,
         },
         data: {
            type: "ship",
            status: "success",
            updatedAddress: updateAddress,
            trackingCode: trackingCode,
            note: note,
            updatedAt: new Date(),
         },
      });
      refetchData();
      return parseStringify(res);
   } catch (error) {
      throw handleError(error);
   } finally {
      prisma.$disconnect();
   }
};
export const receiveOrder = async ({
   note,
   id,
}: Pick<addTrackingProps, "note" | "id">) => {
   try {
      const res = await prisma.delivery.update({
         where: {
            id: id,
         },
         data: {
            type: "pickup",
            status: "success",
            // updatedAddress: updateAddress,
            note: note,
            updatedAt: new Date(),
         },
      });
      refetchData();
      return parseStringify(res);
      throw "not found doc id";
   } catch (error) {
      throw handleError(error);
   } finally {
      prisma.$disconnect();
   }
};

export const changeType = async ({
   type,
   id,
}: Pick<NonNullable<deliveryPrismaProps>, "type" | "id">) => {
   try {
      // TODO: need admin id
      const updatedAddress = type === "pickup" ? "รับที่สถาบัน" : "";
      const res = await prisma.delivery.update({
         where: {
            // webappOrderId: webAppOrderId,
            id: id,
         },
         data: {
            type: type,
            status: "waiting",
            updatedAddress,
         },
      });
      refetchData();
      return parseStringify(res);
   } catch (error) {
      console.error(error);
      throw handleError(error);
   } finally {
      prisma.$disconnect();
   }
};

const createDelivery = async ({
   data,
   courses,
}: {
   data: Parameters<typeof prisma.delivery.create>[0]["data"];
   courses: courseProps[];
}) => {
   try {
      // const demoCourse = [1579, 3863];
      const webappCourseId = data.webappCourseId
         ?.split(",")
         .map((d) => parseInt(d));

      // const getCourse = await getCourseByWebappId(demoCourse);
      const getCourse = await getCourseByWebappId(webappCourseId!);
      const groupCourse: Record<
         string,
         Awaited<ReturnType<typeof prisma.course.findFirst>>
      > = {};
      getCourse?.forEach((course) => {
         groupCourse[course.webappCourseId!.toString()] = course;
      });

      const relationCourse: {
         webappOrderId: number;
         webappCourseId: number;
         Course: { connect: { id: number } } | undefined;
      }[] = [];

      const relationWebappCourse: {
         WebappCourse: {
            connectOrCreate: {
               where: {
                  webappCourseId: number;
               };
               create: {
                  webappCourseId: number;
                  name: string;
                  term: string;
               };
            };
         };
      }[] = [];

      courses.forEach((c) => {
         relationWebappCourse.push({
            WebappCourse: {
               connectOrCreate: {
                  where: {
                     webappCourseId: c.id,
                  },
                  create: {
                     webappCourseId: c.id,
                     name: c.course,
                     term: c.term,
                  },
               },
            },
         });
      });

      // demoCourse?.forEach((courseId) => {
      webappCourseId?.forEach((courseId) => {
         const course = groupCourse[courseId];
         relationCourse.push({
            webappOrderId: data.webappOrderId,
            webappCourseId: courseId,
            Course: course ? { connect: { id: course?.id } } : undefined,
         });

         return course;
      });
      // console.log("relationCourse", relationCourse);
      const res = await prisma.delivery.create({
         data: {
            ...data,
            Delivery_WebappCourse: {
               create: relationWebappCourse,
            },
            Delivery_Course: {
               create: relationCourse,
            },
         },
      });
      // console.log("create Tracking res", res);
      return parseStringify(res);
   } catch (error) {
      console.error(error);
      throw handleError(error);
   } finally {
      prisma.$disconnect();
   }
};

export const updateDataByBranch = async ({
   branch,
   startId,
}: {
   startId: number;
   branch: "ODM" | "KMITL";
}) => {
   try {
      console.time("test");
      const res = await axios({
         method: "GET",
         url: `${B_END_POINT}/api/deliver?start-id=${startId}&branch=${branch}`,
         headers: {
            "B-API-KEY": B_API_KEY,
         },
      });
      const orderData = _.orderBy(res.data, ["id"], ["asc"]);
      for (let index = 0; index < orderData.length; index++) {
         const deliver = orderData[index] as deliveryProps;
         const type = deliver.note?.includes("รับที่สถาบัน")
            ? "pickup"
            : "ship";
         await createDelivery({
            data: {
               status: "waiting",
               type,
               approved: deliver.last_updated,
               webappOrderId: deliver.id,
               updatedAddress: deliver.note,
               branch: deliver.branch,
               member: deliver.member,
               webappCourseId: deliver.courses
                  .map((course) => course.id)
                  .toString(),
               mobile: deliver.mobile,
            },
            courses: deliver.courses,
         });
         // console.log("done", deliver.id);
      }

      console.timeEnd("test");

      return parseStringify(res.data as deliveryPrismaProps[]);
   } catch (error) {
   } finally {
      prisma.$disconnect();
   }
};
