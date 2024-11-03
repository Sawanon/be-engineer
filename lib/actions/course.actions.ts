"use server";

import axios from "axios";
import { Course, CourseCreate } from '../model/course'
import { PrismaClient, Course as CoursePrisma, Prisma } from "@prisma/client";
import { handleError, parseStringify } from "../util";
import dayjs from "dayjs";

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
          orderBy: {
            position: 'asc',
          },
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
      orderBy: {
        createdAt: 'desc',
      },
    })
    return res
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect()
  }
}

export const getCourseByWebappId = async (webappId: number[]) => {
  try {
     const res = await prisma.course.findMany({
        where: {
           webappCourseId: { in: webappId },
        },
        include: {
           Tutor: true,
           CourseLesson: {
              include: {
                 CourseVideo: true,
              },
           },
        },
     });
     return parseStringify(res);
  } catch (error) {
     console.error(error);
     throw handleError(error);
     return [];
  } finally {
     prisma.$disconnect();
  }
};

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

export const getCourseById = async (courseId: number) => {
  try {
    const response = await prisma.course.findFirst({
      include: {
        Tutor: true,
        CourseLesson: {
          orderBy: {
            position: 'asc',
          },
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
      where: {
        id: courseId,
      },
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

export const courseConnectWebAppCourse = async (courseId: number, branch: string, webAppCourseId: number, bookId: number) => {
  try {
    const deliverList = await prisma.delivery.findMany({
      where: {
        webappCourseId: webAppCourseId.toString(),
      },
    })
    const dates:ReturnType<typeof dayjs>[] = []
    deliverList.forEach(deliver => {
      if(deliver.approved){
        dates.push(dayjs(deliver.approved))
      }
    })
    // หาวันที่มากสุด
    const maxDate = dates.reduce((max, date) => (date.isAfter(max) ? date : max), dates[0]);
    // หาวันที่น้อยสุด
    const minDate = dates.reduce((min, date) => (date.isBefore(min) ? date : min), dates[0]);
    if(deliverList.length > 0){
      const response = await prisma.bookTransactions.create({
        data: {
          startDate: minDate.toDate(),
          endDate: maxDate.toDate(),
          detail: 'deliver',
          qty: -(deliverList.length),
          bookId: bookId,
        }
      })
      console.log(response);
    }
    return deliverList
    
    const response = await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        branch: branch,
        webappCourseId: webAppCourseId,
      },
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