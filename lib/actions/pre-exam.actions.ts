"use server"

import { PrismaClient, Prisma } from "@prisma/client"

const prisma = new PrismaClient()

export const listPreExamAction = async () => {
  try {
    const response = await prisma.documentPreExam.findMany({
      include: {
        LessonOnDocument: {
          include: {
            CourseLesson: {
              include: {
                Course: {
                  select: {
                    id: true,
                    name: true,
                    status: true,
                  }
                }
              }
            }
          }
        }
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

export const addPreExamAction = async (preExam: Prisma.DocumentPreExamCreateManyInput) => {
  try {
    const response = await prisma.documentPreExam.create({
      data: preExam,
    })
    return response
  } catch (error) {
    console.error(error)
  } finally {
    prisma.$disconnect()
  }
}