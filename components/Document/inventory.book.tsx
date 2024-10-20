import { listBookTransactionByBookId } from "@/lib/actions/bookTransactions";
import { tableClassnames } from "@/lib/res/const";
import { cn } from "@/lib/util";
import {
   Modal,
   ModalContent,
   ModalHeader,
   ModalBody,
   ModalFooter,
   Button,
   Card,
   CardBody,
   Divider,
   Image,
   Pagination,
   Table,
   TableBody,
   TableCell,
   TableColumn,
   TableHeader,
   TableRow,
} from "@nextui-org/react";
import { DocumentBook } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRef } from "react";
import {
   LuArrowLeft,
   LuClipboardList,
   LuListTree,
   LuPenSquare,
   LuPlus,
   LuPrinter,
} from "react-icons/lu";

const BookInventory = ({
   open,
   onClose,
   onEditStock,
   book,
}: {
   open: boolean;
   onClose: () => void;
   onEditStock: () => void;
   book?: DocumentBook
}) => {

   const {data: bookTransactionsList} =  useQuery({
      queryKey: ["listBookTransactionByBookId", book?.id],
      queryFn: () => listBookTransactionByBookId(book!.id),
      enabled: book !== undefined
   })

   const renderStartEndDate = (startDate: Date, endDate: Date) => {
      const startDayjs = dayjs(startDate)
      const endDayjs = dayjs(endDate)
      if(startDayjs.isSame(endDayjs, 'date')){
         return `${startDayjs.date()} ${startDayjs.format('MMM')} ${startDayjs.year()}`
      }else if(startDayjs.isSame(endDayjs, 'month')){
         return `${startDayjs.date()} - ${endDayjs.date()} ${startDayjs.format('MMM')} ${startDayjs.year()}`
      }else{
         return `${startDayjs.date()} ${startDayjs.format('MMM')} ${startDayjs.year()} - ${endDayjs.date()} ${endDayjs.format('MMM')} ${endDayjs.year()}`
      }
   }

   const renderQty = () => {
      if(!bookTransactionsList) return `-`
      let totalQty = 0
      bookTransactionsList.forEach(bookTransaction => {
         totalQty += bookTransaction.qty
      })
      return `${totalQty}`
   }

   return (
      <Modal
         size={"full"}
         className="rounded-none bg-transparent"
         classNames={{
            backdrop: 'bg-backdrop',
         }}
         closeButton={<></>}
         isOpen={open}
         backdrop="blur"
         onClose={() => {}}
         scrollBehavior={"inside"}
      >
         <ModalContent>
            <ModalBody className={cn("p-0 flex flex-col  ")}>
               <div className="flex flex-1 md:flex-row-reverse overflow-y-hidden">
                  {/* <div className="hidden md:block flex-1"></div> */}
                  <div className="shadow-nextui-large flex flex-col h-full  w-full md:w-[480px] gap-2  bg-white px-4 py-2">
                     <div className="flex gap-2 items-center  ">
                        <Button
                           className="bg-default-100  text-default-foreground"
                           isIconOnly
                           onClick={onClose}
                        >
                           <LuArrowLeft size={24} />
                        </Button>
                        <div className="flex flex-1 gap-2">
                           <Image
                              className="object-cover rounded-small"
                              width={36}
                              height={52}
                              alt="NextUI hero Image"
                              // src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
                              src={`${book?.image}`}
                           />
                           <div className="flex flex-1 justify-between items-center">
                              <div className="text-lg font-semibold font-IBM-Thai">
                                 {/* หนังสือ Dynamics midterm vol.1 - 2/2566{" "} */}
                                 {book?.name}
                              </div>
                              <div className="whitespace-nowrap ">
                                 <p className="text-[#393E44] font-IBM-Thai-Looped text-xs">
                                    คงเหลือ{" "}
                                 </p>
                                 <p className="text-[#393E44]">
                                    <span className={`text-lg font-semibold font-IBM-Thai`}>
                                       {/* {book?.inStock}{" "} */}
                                       {renderQty()}{" "}
                                    </span>
                                    <span className={`text-xs font-IBM-Thai-Looped`}>ชุด</span>
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                     <Button
                        onClick={onEditStock}
                        className="bg-default-foreground text-primary-foreground font-IBM-Thai font-medium"
                     >
                        <LuPlus size={24} />
                        <div className={`mt-[3px]`}>
                           เพิ่ม/ลด รายการ
                        </div>
                     </Button>
                     <div className="flex flex-col justify-between  flex-1 py-2  ">
                        <Table color={"primary"} classNames={{
                           ...tableClassnames,
                           th: [
                              ...tableClassnames.th,
                              "first:rounded-l-lg",
                              "last:rounded-r-lg",
                           ],
                           table: 'rounded-none',
                           wrapper: ["p-0", "shadow-none", "rounded-none"],
                        }}>
                           <TableHeader>
                              <TableColumn>วันที่</TableColumn>
                              <TableColumn width={227} className="text-start">รายการ</TableColumn>
                              <TableColumn className="text-end">จำนวน</TableColumn>
                           </TableHeader>
                           <TableBody>
                              {bookTransactionsList
                              ?
                              bookTransactionsList!.map((bookTransaction, index) => (
                                 <TableRow key={`bookTransactionRow${index}`}>
                                    <TableCell>
                                       <div className="flex gap-2 items-center">
                                          <p>{renderStartEndDate(bookTransaction.startDate, bookTransaction.endDate)}</p>
                                       </div>
                                    </TableCell>
                                    <TableCell width={227} className="">
                                       <div className="flex gap-2  items-center">
                                          <p className="">{bookTransaction.detail}</p>
                                       </div>
                                    </TableCell>
                                    <TableCell>
                                       <div className="flex gap-2  justify-end items-center">
                                          <p className="">{bookTransaction.qty}</p>
                                       </div>{" "}
                                    </TableCell>
                                 </TableRow>
                              ))
                              :
                              <TableRow key="1">
                                 <TableCell>
                                    <div className="flex gap-2 items-center">
                                       <p>-</p>
                                    </div>
                                 </TableCell>
                                 <TableCell width={227} className="">
                                    <div className="flex gap-2  items-center">
                                       <p className="">-</p>
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                    <div className="flex gap-2  justify-end items-center">
                                       <p className="">-</p>
                                    </div>{" "}
                                 </TableCell>
                              </TableRow>
                              }
                           </TableBody>
                        </Table>
                        <div className="flex w-full justify-center">
                           <Pagination
                              classNames={{
                                 cursor: "bg-default-foreground",
                              }}
                              showShadow
                              color="primary"
                              page={1}
                              total={10}
                              // onChange={(page) => setPage(page)}
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

export default BookInventory;
