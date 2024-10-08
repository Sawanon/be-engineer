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
   onViewStock,
   onEditBook,
   onViewUsage
}:{
   onViewStock: () => void,
   onEditBook: () => void,
   onViewUsage: () => void,
}) => {
   return (
      <Table
         classNames={tableClassnames}
         bottomContent={
            <div className="flex w-full justify-center">
               <Pagination
                  showShadow
                  color="primary"
                  page={1}
                  total={10}
                  // onChange={(page) => setPage(page)}
               />
            </div>
         }
         color={"primary"}

      >
         <TableHeader>
            <TableColumn>หนังสือ</TableColumn>
            <TableColumn>Stock</TableColumn>
            <TableColumn>คอร์สที่ใช้งาน</TableColumn>
         </TableHeader>
         <TableBody>
            <TableRow key="1">
               <TableCell>
                  <div onClick={onEditBook} className="flex gap-2 items-center">
                     <Image
                        // width={24}
                        height={44}
                        alt="NextUI hero Image"
                        src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
                     />
                     <p>Dynamics midterm 2/2565</p>
                  </div>
               </TableCell>
               <TableCell className="">
                  <div className="flex gap-2  items-center">
                     <p className="text-sm">12</p>
                     <Button onClick={onViewStock} isIconOnly color="secondary">
                        <LuClipboardList size={24} />
                     </Button>
                  </div>
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
            <TableRow key="2" className="even:bg-[#F4F4F5]">
               <TableCell>
                  <div className="flex gap-2 items-center">
                     <Image
                        // width={24}
                        height={44}
                        alt="NextUI hero Image"
                        src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
                     />
                     <p>Dynamics midterm 2/2565</p>
                  </div>
               </TableCell>
               <TableCell className="">
                  <div className="flex gap-2  items-center">
                     <p className="text-sm">12</p>
                     <Button onClick={onViewStock} isIconOnly color="secondary">
                        <LuClipboardList size={24} />
                     </Button>
                  </div>
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
            <TableRow key="3" className="even:bg-[#F4F4F5]">
               <TableCell>
                  <div className="flex gap-2 items-center">
                     <Image
                        // width={24}
                        height={44}
                        alt="NextUI hero Image"
                        src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
                     />
                     <p>Dynamics midterm 2/2565</p>
                  </div>
               </TableCell>
               <TableCell className="">
                  <div className="flex gap-2  items-center">
                     <p className="text-sm">12</p>
                     <Button onClick={onViewStock} isIconOnly color="secondary">
                        <LuClipboardList size={24} />
                     </Button>
                  </div>
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
         </TableBody>
      </Table>
   );
};

export default TableDocument;
