"use server";

import {
  PrismaClient,
  Prisma,
  DocumentBook,
  DocumentSheet,
} from "@prisma/client";
import { getBookById, updateBookInStock } from "./book.actions";
import { getDeliverByIds } from "./deliver.actions";
import _ from "lodash";

const prisma = new PrismaClient();

export const addRecordData = async (id: number) => {
  try {
    const getDataById = await getDeliverByIds([id]);
    const data = getDataById[0];

    for (let index = 0; index < data.Delivery_Course.length; index++) {
      const bookArr: DocumentBook[] = [];
      const sheetArr: DocumentSheet[] = [];
      const deliveryCourse = data.Delivery_Course[index];
      deliveryCourse.Course?.CourseLesson.forEach((lesson) => {
        lesson.LessonOnDocumentBook.forEach((book) => {
          bookArr.push(book.DocumentBook);
        });
        lesson.LessonOnDocumentSheet.forEach((sheet) => {
          sheetArr.push(sheet.DocumentSheet);
        });
      });
      _.uniqBy(bookArr, "id").forEach(async (book) => {
        await addBookRecord({
          detail: data.type,
          book_documentId: book.id,
          book_deliverId: id,
        });
      });
      _.uniqBy(sheetArr, "id").map(async (sheet) => {
        await addSheetRecord({
          detail: data.type,
          sheetId: sheet.id,
          sheet_deliverId: id,
        });
      });
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
