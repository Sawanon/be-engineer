"use server"

import { PrismaClient, Prisma } from "@prisma/client"
import { getBookById, updateBookInStock } from "./book.actions"
import { getSheetById } from "./sheet.action"

const prisma = new PrismaClient()

export const addSheetTransactionAction = async (transaction: Prisma.SheetTransactionsCreateManyInput) => {
  try {
    const response = await prisma.sheetTransactions.create({
      data: transaction,
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
