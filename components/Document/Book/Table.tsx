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
import { DocumentBook, DocumentSheet } from "@prisma/client";
import { ClipboardList, ExternalLink, ScrollText } from "lucide-react";
import { HiOutlineTruck } from "react-icons/hi";
import {
   LuClipboard,
   LuClipboardList,
   LuFileSignature,
   LuListTree,
   LuPackage,
   LuPrinter,
} from "react-icons/lu";

const TableBooks = ({
   booksList,
   onViewStock,
   onEditBook,
   onViewUsage
}:{
   booksList? :DocumentBook[],
   onViewStock: (book: DocumentBook) => void,
   onEditBook: () => void,
   onViewUsage: (book: DocumentBook) => void,
}) => {

  const handleOnViewStock = (book: DocumentBook) => {
    onViewStock(book)
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
            <TableColumn className={`font-IBM-Thai`}>หนังสือ</TableColumn>
            <TableColumn className={`font-IBM-Thai`}>Stock</TableColumn>
            <TableColumn className={`font-IBM-Thai`}>คอร์สที่ใช้งาน</TableColumn>
         </TableHeader>
         <TableBody>
            {
               booksList ?
               booksList?.map((book, index) => {
               return (
                  <TableRow key={`documentRow${index}`}>
                     <TableCell>
                        <div onClick={onEditBook} className="flex gap-2 items-center font-IBM-Thai-Looped text-default-foreground">
                           <Image
                            className={`max-w-10 h-10 rounded`}
                            // width={40}
                            // height={40}
                            alt="NextUI hero Image"
                            src={book.image!}
                           />
                           <p>{book.name}</p>
                        </div>
                     </TableCell>
                     <TableCell className={`flex items-center gap-2`}>
                      <p className={`text-sm font-IBM-Thai-Looped`}>{book.inStock}</p>
                      <Button
                          isIconOnly
                          className={`min-w-0 max-w-8 max-h-8 rounded-lg bg-default-100 text-default-foreground`}
                          onClick={() => handleOnViewStock(book)}
                      >
                          <ClipboardList size={24} />
                      </Button>
                     </TableCell>
                     <TableCell>
                        <div className="flex gap-2  items-center">
                           <p className="text-sm">1</p>
                           <Button onClick={() => onViewUsage(book)} isIconOnly color="secondary">
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

export default TableBooks;
