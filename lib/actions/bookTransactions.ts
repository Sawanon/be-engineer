"use server"

import { PrismaClient, Prisma } from "@prisma/client"
import { getBookById, updateBookInStock } from "./book.actions"

const prisma = new PrismaClient()

export const addBookTransactionAction = async (bookTransaction: Prisma.BookTransactionsCreateManyInput) => {
  try {
    const response = await prisma.bookTransactions.create({
      data: bookTransaction,
      select: {
        id: true,
      }
    })
    const book = await getBookById(bookTransaction.bookId)
    const inStock = book!.inStock + bookTransaction.qty;
    console.log("🚀 ~ addBookTransactionAction ~ inStock:", inStock)
    await updateBookInStock(bookTransaction.bookId, inStock)
    console.log(`bookTransaction created: ${response.id}`);
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

export const listBookTransactionByBookId = async (bookId: number) => {
  try {
    const response = await prisma.bookTransactions.findMany({
      where :{
        bookId: bookId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return response
  } catch (error) {
    console.error(error)
  } finally {
    prisma.$disconnect()
  }
}