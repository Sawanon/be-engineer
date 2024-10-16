"use server";

import axios from "axios";
import { Course, CourseCreate } from "../model/course";
import { PrismaClient, Course as CoursePrisma } from "@prisma/client";
import { handleError, parseStringify } from "../util";

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

export const listCourseAction = async (): Promise<Course[] | undefined> => {
   try {
      // const response = await axios({
      //   url: `${ENDPOINT_BE_ENGINEER_URL}/api/course/course`,
      //   method: "GET",
      //   headers: {
      //     "B-API-KEY": `${B_API_KEY}`
      //   }
      // })
      const course: Course[] = [];
      const courseListInNewDB = await listCourseInNewDB();
      // return courseListOnWebApp
      // courseListInNewDB.forEach(_course => {
      //   course.push({
      //     name: _course.name,
      //     status: _course.status,
      //     tutorLink: _course.tutorLink,
      //     branch: _course.branch,
      //     id: _course.id,
      //     detail: _course.detail,
      //     clueLink: _course.clueLink,
      //     webappPlaylistId:  _course.webappPlaylistId,
      //     webappCourseId:  _course.webappCourseId,
      //     webappTableOfContentId:  _course.webappTableOfContentId,
      //     playlist:  _course.playlist,
      //     price: _course.price,
      //     Tutor: _course.Tutor,
      //   })
      // })
      return courseListInNewDB;
   } catch (error) {
      console.error(error);
      return;
   }
};

const listCourseInNewDB = async () => {
   try {
      const res = await prisma.course.findMany({
         include: {
            Tutor: true,
            CourseLesson: {
               include: {
                  CourseVideo: true,
               },
            },
         },
      });
      // console.log("res", res[0]);
      // res.forEach(res => {
      //   // console.table({
      //   //   ...res,
      //   // })
      //   // console.log(res.createdAt)
      // })
      return res;
   } catch (error) {
      console.error(error);
      return [];
   } finally {
      prisma.$disconnect();
   }
};



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
