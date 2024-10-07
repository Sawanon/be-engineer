"use server"

import axios from "axios";
import { Course } from '../model/course'
import { classifyCourseByBranch } from "../util";
import { PrismaClient } from "@prisma/client";

const ENDPOINT_BE_ENGINEER_URL = process.env.ENDPOINT_BE_ENGINEER_URL;
const B_API_KEY = process.env.B_API_KEY;
const prisma = new PrismaClient()

export const listCourseAction= async ():Promise<Course[] | undefined>  => {
  try {
    const response = await axios({
      url: `${ENDPOINT_BE_ENGINEER_URL}/api/course/course`,
      method: "GET",
      headers: {
        "B-API-KEY": `${B_API_KEY}`
      }
    })
    const course:Course[] = []
    const courseListInNewDB = await listCourseInNewDB();
    // const courseListOnWebApp = classifyCourseByBranch(response.data, courseListInNewDB)
    // return courseListOnWebApp
    courseListInNewDB.forEach(_course => {
      course.push({
        id: _course.id,
        name: _course.name,
        hasFeedback: false,
        isWebApp: false,
        branch: _course.branch,
        status: 'noContent',
      })
    })
    return course
  } catch (error) {
    console.error(error);
    return
  }
}

const listCourseInNewDB = async () => {
  try {
    const res = await prisma.course.findMany()
    // console.log("res", res[0]);
    res.forEach(res => {
      console.table({
        ...res,
      })
      console.log(res.createdAt)
    })
    return res
  } catch (error) {
    console.error(error);
    return []
  } finally {
    prisma.$disconnect()
  }
}