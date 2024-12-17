"use server"

import { PrismaClient, Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export const getTotalPreExam = async (search?: string) => {
  try {
     const response = await prisma.documentPreExam.count({
        where: {
           name: search ?
           {
              contains: search,
           }
           :
           {
              not: undefined,
           }
        }
     })
     return response
  } catch (error) {
     console.error(error)
     if(error instanceof Prisma.PrismaClientKnownRequestError) return error.message
  } finally {
     prisma.$disconnect()
  }
}

export const listPreExamActionPerPage = async (rowPerPages: number, page: number, search?: string) => {
  try {
    const response = await prisma.documentPreExam.findMany({
      where: {
        name: search ?
        {
           contains: search,
        }
        :
        {
           not: undefined,
        }
      },
      skip: (page-1) * rowPerPages,
      take: rowPerPages,
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

export const listPreExamAction = async () => {
  try {
    console.log('listPreExamAction');
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
    console.log('listPreExamAction', response[0]);
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

export const editPreExamAction = async (preExamId: number, name: string, url: string) => {
  try {
     const response = await prisma.documentPreExam.update({
        where: {
           id: preExamId,
        },
        data: {
           name: name,
           url: url,
        },
     })
     return response
  } catch (error) {
     if(error instanceof Prisma.PrismaClientKnownRequestError) return error.message
  } finally {
     prisma.$disconnect()
  }
}

export const deletePreExamAction = async (sheetId: number) => {
  try {
     const response = await prisma.documentPreExam.delete({
        where: {
           id: sheetId,
        }
     })
     return response
  } catch (error) {
     if(error instanceof Prisma.PrismaClientKnownRequestError) return error.message
  } finally {
     prisma.$disconnect()
  }
}

export const revalidatePreExam = async (path?: string) => {
  revalidatePath(path ?? `/document`)
}