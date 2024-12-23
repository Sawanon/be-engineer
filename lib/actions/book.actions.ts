"use server"

import { PrismaClient, Prisma, Delivery } from "@prisma/client"
import { addBookTransactionAction } from "./bookTransactions"
import { utapi } from "../uploading/server"
import { revalidatePath } from "next/cache"
import { renderBookName } from "../util"

const prisma = new PrismaClient()

export const addBookAction = async (book: Prisma.DocumentBookCreateInput) => {
  try {
    const responseBook = await prisma.documentBook.findFirst({
      where: {
        name: book.name,
        term: book.term,
        year: book.year,
        volume: book.volume,
      }
    })
    
    if(responseBook !== null){
      return 'name_UNIQUE'
    }
    
    // return
    const response = await prisma.documentBook.create({
      data: {
        ...book,
        inStock: 0,
      }
    })
    console.log('response', response);
    
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
      data: {
        ...book,
      },
    })
    const responseBook = await prisma.documentBook.findFirst({
      where: {
        id: bookId,
      }
    })
    if(!responseBook) throw `Can't find book id: ${bookId}`
    const fullName = renderBookName(responseBook);
    const responseUpdateFullName = await prisma.documentBook.update({
      where: {
        id: bookId,
      },
      data: {
        fullName: fullName,
      }
    })
    console.log('generate full name: ', responseUpdateFullName.fullName);
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

export const getTotalBook = async (search?: string) => {
  try {
    let query:Prisma.DocumentBookCountArgs = {}
    if(search){
      const searchQuery:Prisma.DocumentBookCountArgs = {
        where: {
          OR: [
            {
              name: {
                startsWith: search,
              },
            },
            {
              term: {
                startsWith: search,
              },
            },
            {
              year: search,
            }
          ]
        }
      }
      query = searchQuery
    }
    const response = await prisma.documentBook.count(query)
    return response
  } catch (error) {
    console.error(error)
    if(error instanceof Prisma.PrismaClientKnownRequestError) return error.message
  } finally {
    prisma.$disconnect()
  }
}

export const listBooksActionPerPage = async (rowPerPages: number, page: number, searchText?: string) => {
  try {
    let queryWhere = {}
    const search = searchText
    console.log("🚀 ~ listBooksActionPerPage ~ search:", search)
    if(search){
      const query:Prisma.DocumentBookCountArgs = {
        where: {
          fullName: {
            contains: search,
          }
        }
      }
      queryWhere = query
    }
    const reponse = await prisma.documentBook.findMany({
      skip: (page-1) * rowPerPages,
      take: rowPerPages,
      ...queryWhere,
      include: {
        LessonOnDocumentBook :{
          include: {
            CourseLesson: {
              include: {
                Course: {
                  select: {
                    id: true,
                    name: true,
                    status: true,
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
    // if(error instanceof Prisma.PrismaClientKnownRequestError) return error.message
  } finally {
    prisma.$disconnect()
  }
}

export const listBooksAction = async () => {
  try {
    console.log("listBooksAction");
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
                    status: true,
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
    console.log("listBooksAction", reponse[0]);
    return reponse
  } catch (error) {
    console.error(error)
    // if(error instanceof Prisma.PrismaClientKnownRequestError) return error.message
  } finally {
    prisma.$disconnect()
  }
}

export const getBookById = async (bookId: number) => {
  try {
    const response = await prisma.documentBook.findFirst({
      where: {
        id: bookId,
      },
      include: {
        LessonOnDocumentBook: true,
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
    
    // const responseLinkDeliveryWithCourse = await prisma.delivery_Course.createMany({
    //   data: deliveryListWithCourse,
    // })
    
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
    // const deliverId:number[] = []
    deliverList.forEach(delivery => {
      bookTransactions.push({
        startDate: delivery.approved ?? new Date(),
        endDate: delivery.approved ?? new Date(),
        detail: `deliver:restore from change web app:${new Date().toISOString()}`,
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
    
    // const responseLinkDeliveryWithCourse = await prisma.delivery_Course.deleteMany({
    //   where: {
    //     deliveryId: {
    //       in: deliverId,
    //     }
    //   }
    // })
    
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

export const revalidateBook = async (path?: string) => {
  revalidatePath(path ?? `/document`)
}

export const createFullNameBookAction = async () => {
  try {
    const responseBook = await prisma.documentBook.findMany()
    for (let i = 0; i < responseBook.length; i++) {
      const book = responseBook[i];
      console.log("book", book);
      let fullName = `${book.name} ${book.term} ${book.year}`
      if(book.volume){
        fullName = `${fullName} vol.${book.volume}`
      }
      const response = await prisma.documentBook.update({
        where: {
          id: book.id,
        },
        data: {
          fullName: fullName,
        }
      })
      console.log('response', response);
    }
  } catch (error) {
    console.error(error)
    if(error instanceof Prisma.PrismaClientKnownRequestError) return error.message
  } finally {
    prisma.$disconnect()
  }
}