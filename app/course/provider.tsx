import { createContext } from "react";

const CourseContext = createContext<[() => Promise<any>] | undefined>(
   undefined
);
export default CourseContext;
