"use server";

import axios from "axios";
import { Course, CourseCreate } from '../model/course'
import { PrismaClient, Course as CoursePrisma, Prisma, Delivery, DocumentBook } from "@prisma/client";
import { handleError, parseStringify } from "../util";
import dayjs from "dayjs";
import { addBookTransactionAction } from "./bookTransactions";
import { revalidatePath } from "next/cache";
import { getBookById, updateBookInStock } from "./book.actions";

const ENDPOINT_BE_ENGINEER_URL = process.env.ENDPOINT_BE_ENGINEER_URL;
const B_API_KEY = process.env.B_API_KEY;
const prisma = new PrismaClient();


export const searchImageByCourseName = async (courseName: string) => {
  try {
    const response = await axios({
      method: `GET`,
      url: `${ENDPOINT_BE_ENGINEER_URL}/api/course/image?search=${courseName}`,
      headers: {
        "B-API-KEY": `${B_API_KEY}`
      },
    })
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const listCourseAction = async ()  => {
  try {
    const res = await prisma.course.findMany({
      include: {
        Tutor: true,
        CourseLesson: {
          orderBy: {
            position: 'asc',
          },
          include: {
            CourseVideo: true,
            LessonOnDocumentSheet: {
              include: {
                DocumentSheet: true,
              }
            },
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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return res
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect()
  }
}

export const getCourseByWebappId = async (webappId: number[]) => {
  try {
     const res = await prisma.course.findMany({
        where: {
           webappCourseId: { in: webappId },
        },
        include: {
           Tutor: true,
           CourseLesson: {
              include: {
                 CourseVideo: true,
              },
           },
        },
     });
     return parseStringify(res);
  } catch (error) {
     console.error(error);
     throw handleError(error);
     return [];
  } finally {
     prisma.$disconnect();
  }
};

export const addCourse = async (courseData: CourseCreate) : Promise<CoursePrisma | undefined | string> => {
  try {
    const res = await prisma.course.create({
      data: {
        name: courseData.name,
        detail: courseData.detail,
        tutorLink: courseData.tutorLink,
        tutorId: courseData.tutor,
        price: courseData.price,
        clueLink: courseData.clueLink,
        status: courseData.status,
        defaultHours: 0,
        playlist: courseData.playlist,
      }
    })
    return res
  } catch (error) {
    console.error(error);
    if(error instanceof Prisma.PrismaClientKnownRequestError) {
      return error.message
    }
  } finally {
    prisma.$disconnect()
  }
}

export const updateCourse = async (courseId: number , payload: Prisma.CourseUpdateInput) => {
  try {
    const response = await prisma.course.update({
      where: {
        id: courseId
      },
      data: payload,
    })
    return response
  } catch (error) {
    console.error(error)
    if(error instanceof Prisma.PrismaClientKnownRequestError) return error.message
  } finally {
    prisma.$disconnect()
  }
}

function isJsonObject(val: any): val is Prisma.JsonObject {
  return val && typeof val === 'object' && !Array.isArray(val)
}

export const deleteCourse = async (courseId: number) => {
  try {
    const res = await prisma.course.delete({
      where: {
        id: courseId,
      }
    })
    return res
  } catch (error) {
    console.error(error)
  } finally {
    prisma.$disconnect()
  }
}

export const listCourseWebapp = async ():Promise<any[] | undefined> => {
  try {
    const response = await axios({
      url: `${ENDPOINT_BE_ENGINEER_URL}/api/course/course`,
      method: "GET",
      headers: {
        "B-API-KEY": `${B_API_KEY}`
      }
    })
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const getCourseById = async (courseId: number) => {
  try {
    const response = await prisma.course.findFirst({
      include: {
        Tutor: true,
        CourseLesson: {
          orderBy: {
            position: 'asc',
          },
          include: {
            CourseVideo: true,
            LessonOnDocumentSheet: {
              include: {
                DocumentSheet: true,
              }
            },
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
          },
        },
      },
      where: {
        id: courseId,
      },
    })
    return response
  } catch (error) {
    console.error(error)
    if(error instanceof Prisma.PrismaClientKnownRequestError){
      return error.message
    }
  } finally {
    prisma.$disconnect()
  }
}

const changeBindWebApp = async (courseId: number, branch: string, webAppCourseId: number, books: DocumentBook[]) => {
  console.log("start changeBindWebApp vvvv");
  const deliverList:Delivery[] = await prisma.$queryRaw`
    SELECT *
    FROM Delivery
    WHERE FIND_IN_SET(${webAppCourseId}, webappCourseId) > 0
    AND status = 'waiting'
  `
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const bookTransactions:{
      startDate: Date,
      endDate: Date,
      detail: string,
      qty: number,
      bookId: number,
      deliverId: number,
    }[] = []
    const deliverId:number[] = []
    deliverList.forEach(delivery => {
      bookTransactions.push({
        startDate: delivery.approved ?? new Date(),
        endDate: delivery.approved ?? new Date(),
        detail: 'deliver:restore from change web app',
        qty: 1,
        bookId: book.id,
        deliverId: delivery.id,
      })
      deliverId.push(delivery.id)
    })
    // const currentBook = await getBookById(bookId)
    const inStock = book.inStock + bookTransactions.length;
    await updateBookInStock(book.id, inStock)
    const responseAddBookTransaction = await prisma.bookTransactions.createMany({
      data: bookTransactions,
    })
    console.log("🚀 ~ courseConnectWebAppCourse ~ responseAddBookTransaction:", responseAddBookTransaction)
    const responseLinkDeliveryWithCourse = await prisma.delivery_Course.deleteMany({
      where: {
        deliveryId: {
          in: deliverId,
        }
      }
    })
    console.log("🚀 ~ changeBindWebApp ~ responseLinkDeliveryWithCourse:", responseLinkDeliveryWithCourse)
    console.log("end changeBindWebApp ^^^^");
  }
}

export const courseConnectWebAppCourse = async (courseId: number, branch: string, webAppCourseId: number, books: DocumentBook[], imageUrl: string | null) => {
  try {
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
      }
    })
    if(course?.webappCourseId){
      await changeBindWebApp(courseId, branch, course.webappCourseId, books)
    }
    const deliverList:Delivery[] = await prisma.$queryRaw`
      SELECT *
      FROM Delivery
      WHERE FIND_IN_SET(${webAppCourseId}, webappCourseId) > 0
      AND status = 'waiting'
    `
    for (let i = 0; i < books.length; i++) {
      const bookTransactions:{
        startDate: Date,
        endDate: Date,
        detail: string,
        qty: number,
        bookId: number,
        deliverId: number,
      }[] = []
      const deliveryListWithCourse: {
        deliveryId: number,
        courseId: number,
        webappCourseId: number,
        webappOrderId: number,
      }[] = []
      const book = books[i];
      deliverList.forEach(delivery => {
        bookTransactions.push({
          startDate: delivery.approved ?? new Date(),
          endDate: delivery.approved ?? new Date(),
          detail: delivery.approved == null ? 'deliver:not found approved' : 'deliver',
          qty: -1,
          bookId: book.id,
          deliverId: delivery.id,
        })
        deliveryListWithCourse.push({
          deliveryId: delivery.id,
          courseId: courseId,
          webappCourseId: webAppCourseId,
          webappOrderId: delivery.webappOrderId,
        })
      })
      // const currentBook = await getBookById(book.id)
      const inStock = book.inStock + -(bookTransactions.length);
      await updateBookInStock(book.id, inStock)
      const responseAddBookTransaction = await prisma.bookTransactions.createMany({
        data: bookTransactions,
      })
      console.log("🚀 ~ courseConnectWebAppCourse ~ responseAddBookTransaction:", responseAddBookTransaction)
      const responseLinkDeliveryWithCourse = await prisma.delivery_Course.createMany({
        data: deliveryListWithCourse,
      })
      console.log("🚀 ~ courseConnectWebAppCourse ~ responseLinkDeliveryWithCourse:", responseLinkDeliveryWithCourse)
    }
    revalidatePath("/deliver")
    const response = await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        branch: branch,
        webappCourseId: webAppCourseId,
        imageUrl: imageUrl,
      },
    })
    return response
  } catch (error) {
    console.error(error)
    if(error instanceof Prisma.PrismaClientKnownRequestError){
      return error.message
    }
  } finally {
    prisma.$disconnect()
  }
}

export const countBookInCourse = async (courseId: number, bookId: number):Promise<{
  leftBook: number,
} | undefined | string> => {
  try {
    const response:{
      leftBook: number,
    }[] = await prisma.$queryRaw`
      SELECT 
        COUNT(DocumentBook.id) as leftBook
      FROM 
          defaultdb.Course
      JOIN 
          defaultdb.CourseLesson ON defaultdb.Course.id = defaultdb.CourseLesson.courseId
      JOIN 
          defaultdb.LessonOnDocumentBook ON defaultdb.CourseLesson.id = LessonOnDocumentBook.lessonId
      JOIN 
          defaultdb.DocumentBook ON defaultdb.LessonOnDocumentBook.bookId= DocumentBook.id
      WHERE 
          Course.id = ${courseId}
      AND DocumentBook.id = ${bookId};
    `
    return response[0]
  } catch (error) {
    console.error(error)
    if(error instanceof Prisma.PrismaClientKnownRequestError) return error.message
  } finally {
    prisma.$disconnect()
  }
}