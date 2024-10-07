import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Course } from "./model/course";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const classifyCourseByBranch = (courseListByBranch: [], courseListInNewDB: any[]) => {
//   const courseList: {
//     branch: string;
//     id: number;
//     name: string;
//     image: string;
//     hasFeedback: boolean;
//   }[] = [];
const courseListObj:{[x: string]: Course} = {}
const courseList:Course[] = []
  courseListByBranch.forEach(
    (courseByBranch: { branch: string; courses: [] }) => {
      courseByBranch.courses.forEach(
        (course: {
          id: number;
          name: string;
          image: string;
          hasFeedback: boolean;
        }) => {
          courseListObj[`${course.id}`] = {
            status: course.hasFeedback ? 'enterForm' : 'noContent',
            branch: courseByBranch.branch,
            id: course.id,
            name: course.name,
            image: course.image,
            hasFeedback: course.hasFeedback,
            isWebApp: true,
          }
          courseList.push({
            status: course.hasFeedback ? 'enterForm' : 'noContent',
            branch: courseByBranch.branch,
            id: course.id,
            name: course.name,
            image: course.image,
            hasFeedback: course.hasFeedback,
            isWebApp: true,
          });
        }
      );
    }
  );
  console.log(courseListInNewDB);
  
  courseListInNewDB.forEach(courseInNewDB => {
    courseListObj[courseInNewDB.webappCourseId].name = courseInNewDB.name
  })
  
  return Object.values(courseListObj);
};
