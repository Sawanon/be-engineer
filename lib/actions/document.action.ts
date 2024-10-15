"use server"
import { DocumentSheet, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
export const addDocumentAction = async (name: string, url: string) => {
  try {
    const response = await prisma.documentSheet.create({
      data: {
        name: name,
        url: url,
      },
    })
    return response
  } catch (error) {
    console.error(error)
  } finally {
    prisma.$disconnect()
  }
}

export const listDocument = async ():Promise<DocumentSheet[] | undefined> => {
  try {
    const response = await prisma.documentSheet.findMany()
    return response
  } catch (error) {
    console.error(error)
  } finally {
    prisma.$disconnect()
  }
}