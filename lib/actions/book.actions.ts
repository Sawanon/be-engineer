"use server"

import { PrismaClient, Prisma } from "@prisma/client"
import { addBookTransactionAction } from "./bookTransactions"
import { utapi } from "../uploading/server"

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