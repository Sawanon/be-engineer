import CourseContext from "@/app/course/provider";
import { useContext } from "react";

export const useCourse = () => {
   const context = useContext(CourseContext);
   if (context === undefined) {
      throw new Error(`useCourse must be used within a CourseContextProvider`);
   }
   return context;
};
