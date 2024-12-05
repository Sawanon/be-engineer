import { tableClassnames } from "@/lib/res/const";
import {
   Button,
   Image,
   Table,
   TableBody,
   TableCell,
   TableColumn,
   TableHeader,
   TableRow,
} from "@nextui-org/react";
import { DocumentPreExam } from "@prisma/client";
import { ClipboardList, ScrollText } from "lucide-react";
import {
   LuListTree,
} from "react-icons/lu";

const TablePreExam = ({
   preExamList,
  //  onViewStock,
  //  onEditBook,
   onViewUsage,
   onEditPreExam,
}:{
   preExamList? :DocumentPreExam[],
  //  onViewStock: (book: DocumentBook) => void,
  //  onEditBook: () => void,
   onViewUsage: (courseList: any[], book: DocumentPreExam) => void,
   onEditPreExam: (preExam: DocumentPreExam) => void,
}) => {

   const renderCourseUsage = (preExam: DocumentPreExam | any) => {
      const LessonOnDocument: any[] = preExam.LessonOnDocument
      const courseMap: Map<string, any> = new Map();
      LessonOnDocument.forEach((lessonOnDocument) => {
         const courseLesson = lessonOnDocument.CourseLesson;
         const course: any = courseLesson.Course;
         courseMap.set(course.id, course);
       });
       const courseList = Array.from(courseMap.values());
      return (
         <div className="flex gap-2 font-serif items-center">
            <p className="text-sm">{courseList.length}</p>
            <Button
               onClick={() => onViewUsage(courseList, preExam)}
               isIconOnly
               className={`bg-default-100 text-default-foreground min-w-0 w-8 h-8`}
            >
               <LuListTree size={24} />
            </Button>
         </div>
      )
   }

   return (
      <Table
         classNames={tableClassnames}
         color={"primary"}
      >
         <TableHeader>
            <TableColumn className={`font-IBM-Thai`}>เอกสาร</TableColumn>
            <TableColumn className={`font-IBM-Thai`}>Stock</TableColumn>
            <TableColumn className={`font-IBM-Thai`}>คอร์สที่ใช้งาน</TableColumn>
         </TableHeader>
         <TableBody>
            {
               preExamList ?
               preExamList?.map((preExam, index) => {
               return (
                  <TableRow key={`documentRow${index}`}>
                     <TableCell onClick={() => onEditPreExam(preExam)}>
                        <div
                          className="flex gap-2 items-center font-IBM-Thai-Looped text-default-foreground"
                        >
                          <ScrollText size={24} />
                           <p>{preExam.name}</p>
                        </div>
                     </TableCell>
                     <TableCell className={`flex items-center gap-2`}>
                      <Button
                          isIconOnly
                          className={`min-w-0 max-w-8 max-h-8 rounded-lg bg-default-100 text-default-foreground`}
                          onClick={() => {
                            window.open(preExam.url, '_blank')
                          }}
                      >
                          <ClipboardList size={24} />
                      </Button>
                     </TableCell>
                     <TableCell>
                        {renderCourseUsage(preExam)}
                     </TableCell>
                  </TableRow>
               )
            })
         : <TableRow>
            <TableCell colSpan={1}>
               No data
            </TableCell>
            <TableCell colSpan={1}>
               No data
            </TableCell>
            <TableCell colSpan={1}>
               No data
            </TableCell>
         </TableRow>}
         </TableBody>
      </Table>
   );
};

export default TablePreExam;
