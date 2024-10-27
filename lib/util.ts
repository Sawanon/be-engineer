import { ErrorMessageProps } from "@/@type";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isErrorMessageProps } from "./typeGuard";
import { CustomError } from "@/@type/classes";
import { AxiosError } from "axios";
import { Course } from "./model/course";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}
export const parseStringify = <T>(value: T): T =>
   JSON.parse(JSON.stringify(value));

export const handleError = (error: unknown): ErrorMessageProps => {
   let errDetails: Record<string, any> = {
      isError: true,
      code: 404,
      message: JSON.stringify(error),
   };
   if (isErrorMessageProps(error)) {
      return parseStringify({
         isError: true,
         code: 404,
         message: error.message,
      });
   }
   if (error instanceof Error) {
      const stackTrace = error.stack;

      if (stackTrace) {
         const lines = stackTrace.split("\n");
         const firstStackFrame = lines[1].trim();
         const match = RegExp(/at (.+) \((.+):(\d+):(\d+)\)/).exec(
            firstStackFrame
         );
         if (match) {
            const fileName = match[2];
            const lineNumber = Number(match[3]);
            const columnNumber = Number(match[4]);
            console.error(
               `Error occurred at: ${fileName}:${lineNumber}:${columnNumber}`
            );
            errDetails = {
               isError: true,
               code: 404,
               message: error.message,
               type: "Libary Error",
               // type: `Error occurred at: ${fileName}:${lineNumber}:${columnNumber}`,
            };
         } else {
            console.error("Error parsing stack trace");
         }
      } else {
         console.error("No stack trace available");
      }
   } else {
      console.error("Unexpected error type:", error);
   }

   if (error instanceof CustomError) {
      errDetails = {
         isError: true,
         code: error.code,
         message: error.message,
         type: "Custom Error",
      };
   }

   // if (error instanceof z.ZodError) {
   //    errDetails = {
   //       isError: true,
   //       code: error.issues[0].code,
   //       message: error.issues[0].message,
   //       type: "Zod Error",
   //    };
   // }

   if (error instanceof AxiosError) {
      const axiosError = error as AxiosError;
      console.error("Error fetching data:", axiosError);
      if (axiosError.response) {
         console.error("Data:", axiosError.response.data);
         console.error("Status:", axiosError.response.status);
         console.error("Headers:", axiosError.response.headers);
      } else if (axiosError.request) {
         console.error("Error:", axiosError.request);
      } else {
         console.error("Error message:", axiosError.message);
      }
      errDetails = {
         isError: true,
         code: axiosError.response?.status!,
         message: axiosError.response?.data ?? axiosError.message,
         type: "AxiosError",
      };
   }

   return parseStringify(errDetails as ErrorMessageProps);
};

// export const classifyCourseByBranch = (courseListByBranch: [], courseListInNewDB: any[]) => {
// //   const courseList: {
// //     branch: string;
// //     id: number;
// //     name: string;
// //     image: string;
// //     hasFeedback: boolean;
// //   }[] = [];
// const courseListObj:{[x: string]: Course} = {}
// const courseList:Course[] = []
//   courseListByBranch.forEach(
//     (courseByBranch: { branch: string; courses: [] }) => {
//       courseByBranch.courses.forEach(
//         (course: {
//           id: number;
//           name: string;
//           image: string;
//           hasFeedback: boolean;
//         }) => {
//           courseListObj[`${course.id}`] = {
//             status: course.hasFeedback ? 'enterForm' : 'noContent',
//             branch: courseByBranch.branch,
//             id: course.id,
//             name: course.name,
//             image: course.image,
//             hasFeedback: course.hasFeedback,
//           }
//           courseList.push({
//             status: course.hasFeedback ? 'enterForm' : 'noContent',
//             branch: courseByBranch.branch,
//             id: course.id,
//             name: course.name,
//             image: course.image,
//             hasFeedback: course.hasFeedback,
//           });
//         }
//       );
//     }
//   );
//   console.log(courseListInNewDB);

//   courseListInNewDB.forEach(courseInNewDB => {
//     courseListObj[courseInNewDB.webappCourseId].name = courseInNewDB.name
//   })

//   return Object.values(courseListObj);
// };
