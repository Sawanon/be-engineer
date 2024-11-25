"use server";
import { DocumentSheet, Prisma, PrismaClient } from "@prisma/client";

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

export const editSheetAction = async (sheetId: number, name: string, url: string) => {
   try {
      const response = await prisma.documentSheet.update({
         where: {
            id: sheetId,
         },
         data: {
            name: name,
            url: url,
         },
      })
      return response
   } catch (error) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) return error.message
   } finally {
      prisma.$disconnect()
   }
}

export const deleteSheetAction = async (sheetId: number) => {
   try {
      const response = await prisma.documentSheet.delete({
         where: {
            id: sheetId,
         }
      })
      return response
   } catch (error) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) return error.message
   } finally {
      prisma.$disconnect()
   }
}