"use server"

import { PrismaClient, Prisma } from "@prisma/client"
import { addBookTransactionAction } from "./bookTransactions"

const prisma = new PrismaClient()

export const addBookAction = async (book: Prisma.DocumentBookCreateInput) => {
  try {
    const response = await prisma.documentBook.create({
      data: {
        ...book,
        inStock: 0,
      }
    })
    addBookTransactionAction({
      detail: 'ค่าเริ่มต้น',
      startDate: new Date(),
      endDate: new Date(),
      qty: book.inStock!,
      bookId: response.id,
    })
    return response
  } catch (error) {
    console.error(error)
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
                  }
                },
              }
            }
          }
        }
      }
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