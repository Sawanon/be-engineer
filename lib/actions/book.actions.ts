"use server"

import { PrismaClient, Prisma, Delivery } from "@prisma/client"
import { addBookTransactionAction } from "./bookTransactions"
import { utapi } from "../uploading/server"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export const addBookAction = async (book: Prisma.DocumentBookCreateInput) => {
  try {
    const response = await prisma.documentBook.create({
      data: {
        ...book,
        inStock: 0,
      }
    })
    // addBookTransactionAction({
    //   detail: 'ค่าเริ่มต้น',
    //   startDate: new Date(),
    //   endDate: new Date(),
    //   qty: book.inStock!,
    //   bookId: response.id,
    // })
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

export const editBookAction = async (bookId: number, book: Prisma.DocumentBookUpdateInput) => {
  try {
    const response = await prisma.documentBook.update({
      where: {
        id: bookId,
      },
      data: book,
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

export const updateBookInStock = async (bookId: number, inStock: number) => {
  try {
    const response = await prisma.documentBook.update({
      where: {
        id: bookId,
      },
      data: {
        inStock: inStock,
      }
    })
    return response
  } catch (error) {
    console.error(error)
  } finally {
    prisma.$disconnect()
  }
}

export const listBooksAction = async () => {
  try {
    const reponse = await prisma.documentBook.findMany({
      include: {
        LessonOnDocumentBook :{
          include: {
            CourseLesson: {
              include: {
                Course: {
                  select: {
                    id: true,
                    name: true,
                  }
                },
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return reponse
  } catch (error) {
    console.error(error)
  } finally {
    prisma.$disconnect()
  }
}

export const getBookById = async (bookId: number) => {
  try {
    const response = await prisma.documentBook.findFirst({
      where: {
        id: bookId,
      }
    })
    return response
  } catch (error) {
    console.error(error)
  } finally {
    prisma.$disconnect()
  }
}

export const getCourseUsageBook = async (bookId: number) => {
  try {
    const response = await prisma.documentBook.findFirst({
      where: {
        id: bookId,
      },
      include: {
        LessonOnDocumentBook :{
          include: {
            CourseLesson: {
              include: {
                Course: true,
              }
            }
          }
        }
      }
    })
    return response
  } catch (error) {
    console.error(error)
  } finally {
    prisma.$disconnect()
  }
}

export const deleteBookAction = async (bookId: number, imageKey: string) => {
  try {
    const response = await prisma.documentBook.delete({
      where: {
        id: bookId,
      },
    })
    const responseDeleteFile = await utapi.deleteFiles(imageKey, {
      keyType: "fileKey",
    })
    console.log(responseDeleteFile);
    return response
  } catch (error) {
    console.error(error)
    if(error instanceof Prisma.PrismaClientKnownRequestError){
      console.error(error.message)
      return error.message
    }
  } finally {
    prisma.$disconnect()
  }
}

export const deleteBookImage = async (imageKey: string) => {
  try {
    const response = await utapi.deleteFiles(imageKey, {
      keyType: "fileKey",
    })
    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

export const cutBook = async (bookId: number, webAppCourseId: number, courseId: number) => {
  try {
    const deliverList:Delivery[] = await prisma.$queryRaw`
      SELECT *
      FROM Delivery
      WHERE FIND_IN_SET(${webAppCourseId}, webappCourseId) > 0
      AND status = 'waiting'
    `
    const bookTransactions:{
      startDate: Date,
      endDate: Date,
      detail: string,
      qty: number,
      bookId: number,
      deliverId: number,
    }[] = []
    // const deliveryListWithCourse: {
    //   deliveryId: number,
    //   courseId: number,
    //   webappCourseId: number,
    //   webappOrderId: number,
    // }[] = []
    deliverList.forEach(delivery => {
      bookTransactions.push({
        startDate: delivery.approved ?? new Date(),
        endDate: delivery.approved ?? new Date(),
        detail: delivery.approved == null ? 'deliver:not found approved' : 'deliver',
        qty: -1,
        bookId: bookId,
        deliverId: delivery.id,
      })
      // deliveryListWithCourse.push({
      //   deliveryId: delivery.id,
      //   courseId: courseId,
      //   webappCourseId: webAppCourseId,
      //   webappOrderId: delivery.webappOrderId,
      // })
    })
    const currentBook = await getBookById(bookId)
    const inStock = currentBook!.inStock + -(bookTransactions.length);
    await updateBookInStock(bookId, inStock)
    const responseAddBookTransaction = await prisma.bookTransactions.createMany({
      data: bookTransactions,
    })
    console.log("🚀 ~ courseConnectWebAppCourse ~ responseAddBookTransaction:", responseAddBookTransaction)
    // const responseLinkDeliveryWithCourse = await prisma.delivery_Course.createMany({
    //   data: deliveryListWithCourse,
    // })
    // console.log("🚀 ~ courseConnectWebAppCourse ~ responseLinkDeliveryWithCourse:", responseLinkDeliveryWithCourse)
    // revalidatePath("/deliver")
    revalidatePath("/document")
    return responseAddBookTransaction
  } catch (error) {
    console.error(error)
    if(error instanceof Prisma.PrismaClientKnownRequestError){
      console.error(error.message)
      return error.message
    }
  } finally {
    prisma.$disconnect()
  }
}

export const restoreBook = async (bookId: number, webAppCourseId: number) => {
  try {
    console.log("start changeBindWebApp vvvv");
    const deliverList:Delivery[] = await prisma.$queryRaw`
      SELECT *
      FROM Delivery
      WHERE FIND_IN_SET(${webAppCourseId}, webappCourseId) > 0
      AND status = 'waiting'
    `
    console.log("🚀 ~ restoreBook ~ deliverList:", deliverList.length)
    const bookTransactions:{
      startDate: Date,
      endDate: Date,
      detail: string,
      qty: number,
      bookId: number,
      deliverId: number,
    }[] = []
    // const deliverId:number[] = []
    deliverList.forEach(delivery => {
      bookTransactions.push({
        startDate: delivery.approved ?? new Date(),
        endDate: delivery.approved ?? new Date(),
        detail: 'deliver:restore from change web app',
        qty: 1,
        bookId: bookId,
        deliverId: delivery.id,
      })
      // deliverId.push(delivery.id)
    })
    const currentBook = await getBookById(bookId)
    const inStock = currentBook!.inStock + bookTransactions.length;
    await updateBookInStock(bookId, inStock)
    const responseAddBookTransaction = await prisma.bookTransactions.createMany({
      data: bookTransactions,
    })
    console.log("🚀 ~ courseConnectWebAppCourse ~ responseAddBookTransaction:", responseAddBookTransaction)
    // const responseLinkDeliveryWithCourse = await prisma.delivery_Course.deleteMany({
    //   where: {
    //     deliveryId: {
    //       in: deliverId,
    //     }
    //   }
    // })
    // console.log("🚀 ~ changeBindWebApp ~ responseLinkDeliveryWithCourse:", responseLinkDeliveryWithCourse)
    console.log("end changeBindWebApp ^^^^");
    revalidatePath("/document")
  } catch (error) {
    console.error(error)
    if(error instanceof Prisma.PrismaClientKnownRequestError){
      console.error(error.message)
      return error.message
    }
  } finally {
    prisma.$disconnect()
  }
}