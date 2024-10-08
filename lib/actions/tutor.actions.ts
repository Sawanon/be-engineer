"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const listTutor = async () => {
  try {
    const res = await prisma.tutor.findMany()
    return res
  } catch (error) {
    console.error(error)
    return []
  } finally {
    prisma.$disconnect()
  }
}