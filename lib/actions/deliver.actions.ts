"use server";

import axios from "axios";
import { handleError, parseStringify } from "../util";
import { addMultiTrackingProps, addTrackingProps, deliverProps } from "@/@type";
import { PrismaClient } from "@prisma/client";
import {
   addDeliverShipService,
   getShipServiceByName,
} from "./delivery_ship.actions";
import { deliveryType } from "../res/const";
import _ from "lodash";
import { getCourseByWebappId } from "./course.actions";
import async from "async";
const { B_API_KEY, B_END_POINT } = process.env;
const prisma = new PrismaClient();
export type deliveryPrismaProps = Awaited<
   ReturnType<typeof prisma.delivery.findFirst>
>;

type RequiredDeliverProps =
   | "status"
   | "type"
   | "webappOrderId"
   | "webappCourseId";
export const getDeliver = async () => {
   try {
      const res = await axios({
         method: "GET",
         url: `${B_END_POINT}/api/deliver`,
         headers: {
            "B-API-KEY": B_API_KEY,
         },
      });
      return parseStringify(res.data as deliverProps[]);
   } catch (e) {
      throw handleError(e);
   }
};
export const getInfinityDeliver = async ({ pageParam = 1 }) => {
   try {
      const res = await axios({
         method: "GET",
         url: `${B_END_POINT}/api/deliver?page=${pageParam}`,
         headers: {
            "B-API-KEY": B_API_KEY,
         },
      });

      const data = res.data as deliverProps[];

      // if (data.length < 100) {
      //    return { data: data };
      // }
      // return parseStringify({ data: data, nextOffset: pageParam + 1 }) as {
      //    data: deliverProps[];
      //    nextOffset: number;
      // };

      if (data.length < 100) {
         return parseStringify({
            data,
            nextPage: undefined,
         });
      }
      return parseStringify({
         data,
         nextPage: pageParam + 1,
      });
   } catch (e) {
      throw handleError(e);
   }
};

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
      // const res = await prisma.delivery_Course.findFirst({
      //    where: {
      //       webappOrderId: webAppOrderId,
      //    },
      //    include: {
      //       // DeliverShipService: true,
      //       Course: true,
      //       Delivery: true,
      //    },
      // });
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
      handleError(error);
   } finally {
      prisma.$disconnect();
   }
};

export const updateAddress = async ({
   updateAddress,
   webappOrderId,
   courseId,
}: Pick<addTrackingProps, "updateAddress" | "webappOrderId" | "courseId">) => {
   try {
      const getDelivery = await getTrackingByWebappId(webappOrderId);
      if (_.isEmpty(getDelivery)) {
         const res = await createDelivery({
            type: "ship",
            status: "waiting",
            updatedAddress: updateAddress,
            webappOrderId,
            webappCourseId: courseId?.toString(),
         });
         return parseStringify(res);
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
   webappOrderIds,
   courseIds,
}: addMultiTrackingProps) => {
   try {
      const getShipService = await getShipServiceByName(service);
      const getDeliveries = await getTrackingByWebappIdArr(webappOrderIds);
      const groupDelivery: Record<string, deliveryPrismaProps> = {};
      getDeliveries?.forEach((delivery) => {
         groupDelivery[delivery.webappOrderId.toString()] = delivery;
      });
      async.forEachOf(deliveryData, async (delivery, key, callback) => {
         console.log("delivery", delivery);
         const getDelivery = groupDelivery[delivery.webappOrderId];
         if (!_.isEmpty(getDelivery)) {
            const res = await prisma.delivery.update({
               where: {
                  // webappOrderId: webAppOrderId,
                  id: getDelivery.id,
               },
               data: {
                  type: "ship",
                  status: "success",
                  trackingCode: delivery.trackingCode,
                  updatedAt: new Date(),
               },
            });
            return parseStringify(res);
         } else {
            const res = await createDelivery({
               type: "ship",
               status: "success",
               trackingCode: delivery.trackingCode,
               DeliverShipService: { connect: { id: getShipService?.id } },
               webappOrderId: delivery.webappOrderId,
               webappCourseId: delivery.courseId.toString(),
            });
            return parseStringify(res);
         }
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
   webappOrderId,
   courseId,
}: addTrackingProps) => {
   try {
      // TODO: need to check duplicate or not
      const getShipService = await getShipServiceByName(service);
      const getDelivery = await getTrackingByWebappId(webappOrderId);
      if (!_.isEmpty(getDelivery)) {
         const res = await prisma.delivery.update({
            where: {
               // webappOrderId: webAppOrderId,
               id: getDelivery.id,
            },
            data: {
               type: "ship",
               status: "success",
               updatedAddress: updateAddress,
               trackingCode: trackingCode,
               note: note,
               updatedAt: new Date(),
               webappOrderId: webappOrderId,
            },
         });
         return parseStringify(res);
      } else {
         const res = await createDelivery({
            type: "ship",
            status: "success",
            updatedAddress: updateAddress,
            trackingCode: trackingCode,
            note: note,
            DeliverShipService: { connect: { id: getShipService?.id } },
            webappOrderId: webappOrderId,
            webappCourseId: courseId.toString(),

            // webappAdminId?: number | null
            // Course?: CourseCreateNestedOneWithoutDeliveryInput
         });

         return parseStringify(res);
      }
   } catch (error) {
      throw handleError(error);
   } finally {
      prisma.$disconnect();
   }
};
export const receiveOrder = async ({
   note,
   webappOrderId,
   courseId,
}: Pick<addTrackingProps, "courseId" | "note" | "webappOrderId">) => {
   try {
      const getDelivery = await getTrackingByWebappId(webappOrderId!);
      if (!_.isEmpty(getDelivery)) {
         const res = await prisma.delivery.update({
            where: {
               id: getDelivery.id,
            },
            data: {
               type: "pickup",
               status: "success",
               // updatedAddress: updateAddress,
               note: note,
               updatedAt: new Date(),
            },
         });
         return parseStringify(res);
      } else {
         const res = await createDelivery({
            type: "pickup",
            status: "success",
            note: note,
            webappOrderId: webappOrderId!,
            webappCourseId: courseId.toString(),
            // webappCourseId?: number | null
            // webappAdminId?: number | null
            // Course?: CourseCreateNestedOneWithoutDeliveryInput
         });
         return parseStringify(res);
      }
   } catch (error) {
      throw handleError(error);
   } finally {
      prisma.$disconnect();
   }
};

export const changeType = async ({
   type,
   webappOrderId,
   courseId,
}: { courseId: string[] } & Pick<
   NonNullable<deliveryPrismaProps>,
   "type" | "webappOrderId"
>) => {
   try {
      // TODO: need admin id
      const getDelivery = await getTrackingByWebappId(webappOrderId);
      const updatedAddress = type === "pickup" ? "รับที่สถาบัน" : "";
      if (!_.isEmpty(getDelivery)) {
         const res = await prisma.delivery.update({
            where: {
               // webappOrderId: webAppOrderId,
               id: getDelivery.id,
            },
            data: {
               type: type,
               status: "waiting",
               updatedAddress,
               webappOrderId: webappOrderId,
            },
         });
         return parseStringify(res);
      } else {
         await prisma.delivery.create({
            data: {
               type,
               status: "waiting",
               updatedAddress,
               webappOrderId: webappOrderId,
               // webappCourseId: courseId?.toString(),
            },
         });
         const res = await createDelivery({
            type,
            status: "waiting",
            updatedAddress,
            webappOrderId: webappOrderId,
            webappCourseId: courseId?.toString(),
         });
         return parseStringify(res);
      }
   } catch (error) {
      throw handleError(error);
   } finally {
      prisma.$disconnect();
   }
};

const createDelivery = async (
   data: Parameters<typeof prisma.delivery.create>[0]["data"]
) => {
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

      // demoCourse?.forEach((courseId) => {
      webappCourseId?.forEach((courseId) => {
         const course = groupCourse[courseId];
         relationCourse.push({
            webappOrderId: data.webappOrderId,
            webappCourseId: courseId,
            Course: course ? { connect: { id: course?.id! } } : undefined,
         });

         return course;
      });
      console.log("relationCourse", relationCourse);
      const res = await prisma.delivery.create({
         data: {
            ...data,
            Delivery_Course: {
               create: relationCourse,
            },
         },
      });
      console.log("create Tracking res", res);
      return parseStringify(res);
   } catch (error) {
      console.log(error);
      throw handleError(error);
   }
};
