// class Course {
//     name: string;

import { Document } from "./document";

//     constructor(name: string){
//         this.name = name;
//     }

//     static fromJson = () => {
//         return new Course('default course');
//     }
// }

export type Course = {
  name: string;
  status: "noContent" | "hasContent" | "uploadWebapp" | "enterForm";
  tutor?: string;
  image?: string;
  documents?: Document[];
  branch: string
  id: number
  hasFeedback: boolean;
  isWebApp: boolean;
  detail?: string
  clueLink?: string
  webappPlaylistId?: number
  price?: number
};

export type CourseByBranch = {
  branch: string;
  courses: Course[];
}