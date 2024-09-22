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
  tutor: string;
  imageUrl?: string;
  documents: Document[];
};
