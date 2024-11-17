"use server"
import { CourseLesson, Prisma, PrismaClient } from "@prisma/client";
import { countBookInCourse } from "./course.actions";
import { cutBook, restoreBook } from "./book.actions";
import { revalidatePath } from "next/cache";

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
    if(error instanceof Prisma.PrismaClientKnownRequestError){
      return error.message
    }
  } finally {
    prisma.$disconnect()
  }
}

export const updateBookInLesson = async (oldBookId: number, newBookId: number, lessonId: number) => {
  try {
    const lesson = await prisma.courseLesson.findFirst({
      where: {
        id: lessonId,
      },
      include: {
        Course: true,
      },
    })
    if(!lesson) throw `lesson is ${lesson}`
    if(lesson.Course.webappCourseId !== null){
      // goto count old book in course if last restore it
      const responseLeftOldBookInCourse = await countBookInCourse(lesson.courseId, oldBookId)
      if(!responseLeftOldBookInCourse) throw `responseLeftOldBookInCourse is ${responseLeftOldBookInCourse}`
      if(typeof responseLeftOldBookInCourse === "string") throw responseLeftOldBookInCourse
      const leftOldBook = Number(responseLeftOldBookInCourse.leftBook)
      console.log("🚀 ~ updateBookInLesson ~ leftOldBook:", leftOldBook)
      if(leftOldBook === 1){
        // restore book
        await restoreBook(oldBookId, lesson.Course.webappCourseId)
      }
      // new book
      const responseLeftNewBookInCourse = await countBookInCourse(lesson.courseId, newBookId)
      if(!responseLeftNewBookInCourse) throw `responseLeftNewBookInCourse is ${responseLeftNewBookInCourse}`
      if(typeof responseLeftNewBookInCourse === "string") throw responseLeftNewBookInCourse
      const leftNewBook = Number(responseLeftNewBookInCourse.leftBook)
      console.log("🚀 ~ updateBookInLesson ~ leftNewBook:", leftNewBook)
      if(leftNewBook === 0){
        // cut book
        const responesRestore = await cutBook(newBookId, lesson.Course.webappCourseId, lesson.courseId)
        console.log("🚀 ~ updateBookInLesson ~ responesRestore: cut book", responesRestore)
      }
    }
    const response = await prisma.lessonOnDocumentBook.update({
      where: {
        lessonId_bookId: {
          bookId: oldBookId,
          lessonId: lessonId,
        }
      },
      data: {
        bookId: newBookId,
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

export const removeDocumentSheetInLessonAction = async (sheetId: number, lessonId: number) => {
  try {
    const response = await prisma.lessonOnDocumentSheet.delete({
      where: {
        lessonId_sheetId: {
          sheetId: sheetId,
          lessonId: lessonId,
        }
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

export const addBookToLessonAction = async (bookId: number, lessonId: number) => {
  try {
    const lesson = await prisma.courseLesson.findFirst({
      where: {
        id: lessonId,
      },
      include: {
        Course: true,
      },
    })
    if(lesson === null) throw `lesson is null`
    if(lesson.Course.webappCourseId !== null){
      // goto update book instock
      const responseLeftBookInCourse = await countBookInCourse(lesson.courseId, bookId)
      console.log("🚀 ~ addBookToLessonAction ~ responseLeftBookInCourse:", responseLeftBookInCourse)
      if(!responseLeftBookInCourse) throw `responseLeftBookInCourse is ${responseLeftBookInCourse}`
      if(typeof responseLeftBookInCourse === "string") throw responseLeftBookInCourse
      const leftBook = Number(responseLeftBookInCourse.leftBook)
      if(leftBook === 0){
        // cut stock
        const responseCutBook = await cutBook(bookId, lesson.Course.webappCourseId, lesson.courseId)
        console.log("🚀 ~ addBookToLessonAction ~ responseCutBook:", responseCutBook)
      }
    }
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

export const removeBookLessonAction = async (bookId: number, lessonId: number) => {
  try {
    const response = await prisma.lessonOnDocumentBook.delete({
      where: {
        lessonId_bookId: {
          bookId: bookId,
          lessonId: lessonId,
        }
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

export const removeDocumentPreExamInLessonAction = async (preExamId: number, lessonId: number) => {
  try {
    const response = await prisma.lessonOnDocument.delete({
      where: {
        lessonId_preExamId: {
          preExamId: preExamId,
          lessonId: lessonId,
        }
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

export const updateLesson = async (lessonId: number, lesson: Prisma.CourseLessonUpdateInput) => {
  try {
    const response = await prisma.courseLesson.update({
      where: {
        id: lessonId,
      },
      data: lesson,
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

export const deleteLesson = async (lessonId: number) => {
  try {
    const lesson = await prisma.courseLesson.findFirst({
      where: {
        id: lessonId,
      },
      include: {
        Course: true,
        LessonOnDocumentBook: {
          include: {
            DocumentBook: true,
          },
        },
      },
    })
    if(!lesson) throw `lesson is ${lesson}`
    if(lesson.Course.webappCourseId !== null && lesson.LessonOnDocumentBook.length > 0){
      for (let i = 0; i < lesson.LessonOnDocumentBook.length; i++) {
        const lessonOnDocument = lesson.LessonOnDocumentBook[i];
        const responseLeftBookInCourse = await countBookInCourse(lesson.courseId, lessonOnDocument.bookId)
        if(!responseLeftBookInCourse) throw `responseLeftBookInCourse is ${responseLeftBookInCourse}`
        if(typeof responseLeftBookInCourse === "string") throw responseLeftBookInCourse
        const leftBook = Number(responseLeftBookInCourse.leftBook)
        console.log("🚀 ~ updateBookInLesson ~ leftBook:", leftBook)
        if(leftBook === 1){
          // restore book
          await restoreBook(lessonOnDocument.bookId, lesson.Course.webappCourseId)
        }
      }
    }
    const response = await prisma.courseLesson.delete({
      where: {
        id: lessonId,
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

export const getLessonById = async (lessonId: number) => {
  try {
    const response = await prisma.courseLesson.findFirst({
      where: {
        id: lessonId,
      },
    })
    return response
  } catch (error) {
    console.error(error)
    if(error instanceof Prisma.PrismaClientKnownRequestError) return error.message
  } finally {
    prisma.$disconnect()
  }
}