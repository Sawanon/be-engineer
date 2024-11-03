"use server"
import { CourseLesson, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const addLessonToDB = async (courseId: number, lesson: any) => {
  try {
    const response = await prisma.courseLesson.create({
      data: {
        courseId: courseId,
        name: lesson.name,
        position: lesson.position,
      }
    })
    console.log("Lesson added to DB");
    await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        status: `hasContent`,
      }
    })
    console.log(`CourseId: ${courseId} update status to hasContent`);
    return response
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect()
  }
}

export const addDocumentToLesson = async (documentId: number, lessonId: number) => {
  try {
    const response = await prisma.lessonOnDocumentSheet.create({
      data: {
        lessonId: lessonId,
        sheetId: documentId,
      }
    })
    return response
  } catch (error) {
    console.error(error)
  } finally {
    prisma.$disconnect()
  }
}

export const addBookToLessonAction = async (bookId: number, lessonId: number) => {
  try {
    const response = await prisma.lessonOnDocumentBook.create({
      data: {
        lessonId: lessonId,
        bookId: bookId,
      }
    })
    return response
  } catch (error) {
    console.error(error)
  } finally {
    prisma.$disconnect()
  }
}

export const addPreExamToLessonAction = async (preExamId: number, lessonId: number) => {
  try {
    const response = await prisma.lessonOnDocument.create({
      data: {
        lessonId: lessonId,
        preExamId: preExamId,
      }
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

export const changePositionLesson = async (lessonId: number, newPosition: number) => {
  try {
    const response = await prisma.courseLesson.update({
      where: {
        id: lessonId,
      },
      data: {
        position: newPosition,
      },
    })
    return response
  } catch (error) {
    console.error(error)
  } finally {
    prisma.$disconnect()
  }
}