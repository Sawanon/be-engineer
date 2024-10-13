"use server"
import { CourseLesson, PrismaClient } from "@prisma/client";

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
    return response
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect()
  }
}