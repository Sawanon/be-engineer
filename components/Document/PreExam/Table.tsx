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
   onViewUsage
}:{
   preExamList? :DocumentPreExam[],
  //  onViewStock: (book: DocumentBook) => void,
  //  onEditBook: () => void,
   onViewUsage: () => void,
}) => {

  // const handleOnViewStock = (book: DocumentBook) => {
  //   onViewStock(book)
  // }
   return (
      <Table
         classNames={tableClassnames}
         color={"primary"}
      >
         <TableHeader>
            <TableColumn className={`font-IBM-Thai`}>หนังสือ</TableColumn>
            <TableColumn className={`font-IBM-Thai`}>Stock</TableColumn>
            <TableColumn className={`font-IBM-Thai`}>คอร์สที่ใช้งาน</TableColumn>
         </TableHeader>
         <TableBody>
            {
               preExamList ?
               preExamList?.map((preExam, index) => {
               return (
                  <TableRow key={`documentRow${index}`}>
                     <TableCell>
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
                        <div className="flex gap-2  items-center">
                           <p className="text-sm">1</p>
                           <Button onClick={onViewUsage} isIconOnly color="secondary">
                              <LuListTree size={24} />
                           </Button>
                        </div>{" "}
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
