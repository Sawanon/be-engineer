"use server"

import { PrismaClient, Prisma } from "@prisma/client"
import { getBookById, updateBookInStock } from "./book.actions"
import dayjs from "dayjs"
import { revalidatePath } from "next/cache"

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
        startDate: 'desc',
      },
    })
    return response
  } catch (error) {
    console.error(error)
  } finally {
    prisma.$disconnect()
  }
}

export const listBookTransactionByBookIdGroupByYearMonth = async (bookId: number):Promise<{
  startDate: Date;
  endDate: Date;
  detail: string;
  qty: number;
}[] | undefined> =>  {
  try {
    let allResponse =  []
    const responseWithoutDeliver = await prisma.bookTransactions.findMany({
      where :{
        bookId: bookId,
        AND: [
          {
            detail: {
              not : {
                startsWith: "ship",
              },
            },
          },
          {
            detail: {
              not : {
                startsWith: "pickup",
              },
            },
          },
        ],
      },
      select: {
        // startDate: true,
        qty: true,
        detail: true,
        startDate: true,
        endDate: true,
      },
      orderBy: [
        {
          startDate: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ]
    })
    const response:any[] = await prisma.$queryRaw`
      SELECT detail, DATE_FORMAT(startDate, '%Y-%m') as year_months, SUM(qty) AS total_amount
      FROM defaultdb.BookTransactions
      WHERE bookId = ${bookId}
      AND (detail LIKE 'ship%' OR detail LIKE 'pickup%')
      GROUP BY detail, year_months
      ORDER BY year_months desc;
    `
    const formattedResponse = response.map(data => ({
      qty: data.total_amount,
      detail: data.detail,
      startDate: dayjs(`${data.year_months}-01`),
      endDate: dayjs(`${data.year_months}-01`).endOf('month').startOf('date'),
    }))
    allResponse = [...responseWithoutDeliver, ...formattedResponse]
    return allResponse as {
      startDate: Date;
      endDate: Date;
      detail: string;
      qty: number;
    }[]
  } catch (error) {
    console.error(error)
  } finally {
    prisma.$disconnect()
  }
}

export const revalidateBookTransaction = async (bookId: number) => {
  revalidatePath(`/document?stockBookId=${bookId}`)
}