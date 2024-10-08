// class Course {
//     name: string;

import { CourseLesson, Tutor } from "@prisma/client";
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
  status: "noContent" | "hasContent" | "uploadWebapp" | "enterForm" | string;
  tutorLink: number;
  image?: string;
  documents?: Document[];
  branch: string | null
  id: number
  hasFeedback?: boolean;
  // isWebApp: boolean;
  detail: string | null
  clueLink: string | null
  webappPlaylistId?: number | null
  webappCourseId?: number | null
  webappTableOfContentId?: number | null
  playlist?: string | null
  price: number,
  Tutor: Tutor,
  CourseLesson: CourseLesson[]
};

export type CourseByBranch = {
  branch: string;
  courses: Course[];
}

export type CourseCreate =  {
  name: string;
  status: "noContent" | "hasContent" | "uploadWebapp" | "enterForm";
  tutor: number;
  detail: string
  clueLink: string
  price: number
  playlist: string
}