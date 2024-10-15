import { modalProps, stateProps } from "@/@type";
import { tableClassnames } from "@/lib/res/const";
import {
   Button,
   Chip,
   Image,
   Pagination,
   Table,
   TableBody,
   TableCell,
   TableColumn,
   TableHeader,
   TableRow,
} from "@nextui-org/react";
import { DocumentSheet } from "@prisma/client";
import { ExternalLink, ScrollText } from "lucide-react";
import { HiOutlineTruck } from "react-icons/hi";
import {
   LuClipboard,
   LuClipboardList,
   LuFileSignature,
   LuListTree,
   LuPackage,
   LuPrinter,
} from "react-icons/lu";

const TableDocument = ({
   documentList,
   onViewStock,
   onEditBook,
   onViewUsage
}:{
   documentList? :DocumentSheet[],
   onViewStock: () => void,
   onEditBook: () => void,
   onViewUsage: () => void,
}) => {
   return (
      <Table
         classNames={tableClassnames}
         bottomContent={
            <div className="py-2 flex justify-center">
               <Pagination
                  showShadow
                  color="primary"
                  page={1}
                  total={10}
                  className="p-0 m-0"
                  classNames={{
                     cursor: "bg-default-foreground",
                  }}
                  // onChange={(page) => setPage(page)}
               />
            </div>
         }
         color={"primary"}
      >
         <TableHeader>
            <TableColumn className={`font-IBM-Thai`}>หนังสือ</TableColumn>
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
                        <div onClick={onEditBook} className="flex gap-2 items-center">
                           {/* <Image
                              // width={24}
                              height={44}
                              alt="NextUI hero Image"
                              src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
                           /> */}
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

export default TableDocument;
