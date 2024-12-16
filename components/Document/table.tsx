import { tableClassnames } from "@/lib/res/const";
import {
   Button,
   Table,
   TableBody,
   TableCell,
   TableColumn,
   TableHeader,
   TableRow,
} from "@nextui-org/react";
import { DocumentSheet } from "@prisma/client";
import { ExternalLink, ScrollText } from "lucide-react";
import {
   LuListTree,
} from "react-icons/lu";

const TableDocument = ({
   documentList,
   onEditSheet,
   onViewUsage
}:{
   documentList? :DocumentSheet[],
   onEditSheet: (sheet: DocumentSheet) => void,
   onViewUsage: (courseList: any[], book: DocumentSheet) => void,
}) => {

   const renderCourseUsage = (sheet: DocumentSheet | any) => {
      const LessonOnDocument: any[] = sheet.LessonOnDocumentSheet
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
               onClick={() => onViewUsage(courseList, sheet)}
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
         // bottomContent={
         //    <div className="py-2 flex justify-center">
         //       <Pagination
         //          showShadow
         //          color="primary"
         //          page={1}
         //          total={10}
         //          className="p-0 m-0"
         //          classNames={{
         //             cursor: "bg-default-foreground",
         //          }}
         //          // onChange={(page) => setPage(page)}
         //       />
         //    </div>
         // }
         color={"primary"}
      >
         <TableHeader>
            <TableColumn className={`font-IBM-Thai`}>เอกสาร</TableColumn>
            <TableColumn className={`font-IBM-Thai`}>เปิดดู</TableColumn>
            <TableColumn className={`font-IBM-Thai`}>คอร์สที่ใช้งาน</TableColumn>
         </TableHeader>
         <TableBody>
            {
               documentList ?
            documentList?.map((document, index) => {
               return (
                  <TableRow key={`documentRow${index}`}>
                     <TableCell>
                        <div onClick={() => onEditSheet(document)} className={`flex gap-2 items-center font-serif`}>
                           <ScrollText size={24} />
                           <p>{document.name}</p>
                        </div>
                     </TableCell>
                     <TableCell className="">
                        <Button
                           isIconOnly
                           className={`min-w-0 max-w-8 max-h-8 rounded-lg bg-default-100`}
                           onClick={() => {
                              window.open(document.url, '_blank')
                           }}
                        >
                           <ExternalLink size={24} />
                        </Button>
                        {/* <div className="flex gap-2  items-center">
                           <p className="text-sm">12</p>
                           <Button onClick={onViewStock} isIconOnly color="secondary">
                              <LuClipboardList size={24} />
                           </Button>
                        </div> */}
                     </TableCell>
                     <TableCell>
                        {renderCourseUsage(document)}
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

export default TableDocument;
