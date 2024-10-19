"use server";

import axios from "axios";
import { Course, CourseCreate } from '../model/course'
import { PrismaClient, Course as CoursePrisma, Prisma } from "@prisma/client";

const ENDPOINT_BE_ENGINEER_URL = process.env.ENDPOINT_BE_ENGINEER_URL;
const B_API_KEY = process.env.B_API_KEY;
const prisma = new PrismaClient();


export const searchImageByCourseName = async (courseName: string) => {
  try {
    const response = await axios({
      method: `GET`,
      url: `${ENDPOINT_BE_ENGINEER_URL}/api/course/image?search=${courseName}`,
      headers: {
        "B-API-KEY": `${B_API_KEY}`
      },
    })
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const listCourseAction = async ()  => {
  try {
    const res = await prisma.course.findMany({
      include: {
        Tutor: true,
        CourseLesson: {
          include: {
            CourseVideo: true,
            LessonOnDocumentSheet: {
              include: {
                DocumentSheet: true,
              }
            },
            LessonOnDocument: {
              include: {
                DocumentPreExam: true,
              },
            },
            LessonOnDocumentBook: {
              include: {
                DocumentBook: true,
              },
            },
          },
        },
      },
    })
    return res
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect()
  }
}

export const addCourse = async (courseData: CourseCreate) : Promise<CoursePrisma | undefined> => {
  try {
    const res = await prisma.course.create({
      data: {
        name: courseData.name,
        detail: courseData.detail,
        tutorLink: courseData.tutorLink,
        tutorId: courseData.tutor,
        price: courseData.price,
        clueLink: courseData.clueLink,
        status: courseData.status,
        defaultHours: 0,
        playlist: courseData.playlist,
      }
    })
    return res
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect()
  }
}

export const updateCourse = async (courseId: number , payload: any) => {
  try {
    const response = await prisma.course.update({
      where: {
        id: courseId
      },
      data: payload,
    })
    return response
  } catch (error) {
    console.error(error)
  } finally {
    prisma.$disconnect()
  }
}

function isJsonObject(val: any): val is Prisma.JsonObject {
  return val && typeof val === 'object' && !Array.isArray(val)
}

const ya = async () => {
  const test =  await prisma.testjson.findMany()
  if(test[0].json && isJsonObject(test[0].json)){
    const ya = test[0].json.df
  }
}

export const deleteCourse = async (courseId: number) => {
  try {
    const res = await prisma.course.delete({
      where: {
        id: courseId,
      }
    })
    return res
  } catch (error) {
    console.error(error)
  } finally {
    prisma.$disconnect()
  }
}

export const listCourseWebapp = async ():Promise<any[] | undefined> => {
  try {
    const response = await axios({
      url: `${ENDPOINT_BE_ENGINEER_URL}/api/course/course`,
      method: "GET",
      headers: {
        "B-API-KEY": `${B_API_KEY}`
      }
    })
    return response.data
  } catch (error) {
    console.error(error)
  }
}
