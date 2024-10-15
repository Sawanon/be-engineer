"use server";
import { CourseLesson, PrismaClient } from "@prisma/client";
import { deliveryType } from "../res/const";
import { handleError, parseStringify } from "../util";
import { deliverShipServiceKey } from "@/@type";

const prisma = new PrismaClient();

export const addDeliverShipService = async ({
   name,
   imageUrl,
   url,
}: {
   url?: string;
   imageUrl?: string;
   name?: deliverShipServiceKey;
}) => {
   try {
      const getData = deliveryType["flash"];
      // const response = await prisma.deliverShipService.create({
      //    data: {
      //       name: name,
      //       imageUrl: imageUrl,
      //       trackingUrl: getData.url,
      //    },
      // });
      const response = await prisma.deliverShipService.create({
         data: {
            name: "flash",
            // imageUrl: imageUrl,
            trackingUrl: deliveryType["flash"].url,
         },
      });
      await prisma.deliverShipService.create({
         data: {
            name: "j&t",
            // imageUrl: imageUrl,
            trackingUrl: deliveryType["j&t"].url,
         },
      });
      await prisma.deliverShipService.create({
         data: {
            name: "kerry",
            // imageUrl: imageUrl,
            trackingUrl: deliveryType["kerry"].url,
         },
      });
      await prisma.deliverShipService.create({
         data: {
            name: "thaipost",
            imageUrl: imageUrl,
            trackingUrl: deliveryType["thaipost"].url,
         },
      });
      // console.log("Ship Add added to DB");
      return parseStringify(response);
   } catch (error) {
      console.error(error);
   } finally {
      prisma.$disconnect();
   }
};

export const getShipServiceByName = async (
   serviceName: deliverShipServiceKey
) => {
   try {
      const response = await prisma.deliverShipService.findFirst({
         where: {
            name: serviceName,
         },
      });

      return parseStringify(response);
   } catch (error) {
      console.error(error);
      throw handleError(error);
   } finally {
      prisma.$disconnect();
   }
};
