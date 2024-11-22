"use server";

import { PrismaClient, Prisma } from "@prisma/client";
import { getBookById, updateBookInStock } from "./book.actions";
import { getDeliverByIds } from "./deliver.actions";

const prisma = new PrismaClient();

export const addRecordData = async (id: number) => {
   try {
      const getDataById = await getDeliverByIds([id]);
      const data = getDataById[0];
      for (let index = 0; index < data.Delivery_Course.length; index++) {
         const deliveryCourse = data.Delivery_Course[index];
         const findBook = deliveryCourse.Course?.CourseLesson?.find(
            (lesson) => {
               return lesson.LessonOnDocumentBook.length > 0;
            }
         );
    
         if (findBook) {
            await addBookRecord({
               detail: data.type,
               book_documentId: findBook.LessonOnDocumentBook[0].bookId,
               book_deliverId: id,
            });
         }

         const findSheet = deliveryCourse.Course?.CourseLesson?.find(
            (lesson) => {
               return lesson.LessonOnDocumentSheet.length > 0;
            }
         );
         if (findSheet) {
            await addSheetRecord({
               detail: data.type,
               sheetId: findSheet.LessonOnDocumentSheet[0].sheetId,
               sheet_deliverId: id,
            });
         }
      }
   } catch (error) {}
};

export const addSheetRecord = async (
   transaction: Prisma.RecordSheetCreateManyInput
) => {
   try {
      const response = await prisma.recordSheet.create({
         data: transaction,
      });

      return response;
   } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
         return error.message;
      }
   } finally {
      prisma.$disconnect();
   }
};

export const addBookRecord = async (
   bookTransaction: Prisma.RecordBookCreateManyInput
) => {
   try {
      const response = await prisma.recordBook.create({
         data: bookTransaction,
      });
      return response;
   } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
         return error.message;
      }
   } finally {
      prisma.$disconnect();
   }
};
