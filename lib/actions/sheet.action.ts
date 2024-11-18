"use server";
import { DocumentSheet, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const addSheetAction = async (name: string, url: string) => {
   try {
      const response = await prisma.documentSheet.create({
         data: {
            name: name,
            url: url,
         },
      });
      return response;
   } catch (error) {
      console.error(error);
   } finally {
      prisma.$disconnect();
   }
};

export const listSheetsAction = async (): Promise<
   DocumentSheet[] | undefined
> => {
   try {
      const response = await prisma.documentSheet.findMany({
         include: {
            LessonOnDocumentSheet: {
               include: {
                  CourseLesson: {
                     include: {
                        Course: {
                           select: {
                              id: true,
                              name: true,
                              status: true,
                           }
                        }
                     }
                  }
               }
            }
         },
         orderBy: {
            createdAt: "desc",
         },
      });
      return response;
   } catch (error) {
      console.error(error);
   } finally {
      prisma.$disconnect();
   }
};

