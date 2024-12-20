"use server";
import { DocumentSheet, Prisma, PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

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

export const getTotalSheet = async (search?: string) => {
   try {
      const response = await prisma.documentSheet.count({
         where: {
            name: search ?
            {
               contains: search,
            }
            :
            {
               not: undefined,
            }
         }
      })
      return response
   } catch (error) {
      console.error(error)
      if(error instanceof Prisma.PrismaClientKnownRequestError) return error.message
   } finally {
      prisma.$disconnect()
   }
}

export const listSheetActionPerPage = async (rowPerPages: number, page: number, search?: string) => {
   try {
      const response = await prisma.documentSheet.findMany({
         where: {
            name: search ?
            {
               contains: search,
            }
            :
            {
               not: undefined,
            }
         },
         skip: (page-1) * rowPerPages,
         take: rowPerPages,
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
      })
      return response
   } catch (error) {
      console.error(error)
      if(error instanceof Prisma.PrismaClientKnownRequestError) return error.message
   } finally {
      prisma.$disconnect()
   }
}

export const listSheetsAction = async () => {
   try {
      console.log('listSheetsAction');
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
      console.log('listSheetsAction', response[0]);
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

export const revalidateSheet = async (path?: string) => {
   revalidatePath(path ?? `/document`)
}