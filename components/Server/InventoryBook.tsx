"use client"
import { getBookById } from "@/lib/actions/book.actions";
import { listBookTransactionByBookId, listBookTransactionByBookIdGroupByYearMonth } from "@/lib/actions/bookTransactions";
import { tableClassnames } from "@/lib/res/const";
import { cn, renderBookName } from "@/lib/util";
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
import { useMemo, useRef, useState } from "react";
import {
   LuArrowLeft,
   LuClipboardList,
   LuListTree,
   LuPenSquare,
   LuPlus,
   LuPrinter,
} from "react-icons/lu";
import EditInventory from "../Document/inventory.book.edit";
import { useRouter } from "next/navigation";

const BookInventory = ({
   book,
   bookTransactionsList,
}: {
   book: Awaited<ReturnType<typeof getBookById>>,
   bookTransactionsList: Awaited<ReturnType<typeof listBookTransactionByBookIdGroupByYearMonth>>
}) => {

   const route = useRouter()
   const rowPerPage = 20
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(50)
   const [isEditStock, setIsEditStock] = useState(false)

   const booTransactionItems = useMemo(() => {
      const startIndex = (page - 1) * rowPerPage;
      const endIndex = startIndex + rowPerPage;
      if(bookTransactionsList){
         setPageSize(Math.ceil(bookTransactionsList.length / rowPerPage))
      }
      console.log("bookTransactionsList", bookTransactionsList);
      return bookTransactionsList?.slice(startIndex, endIndex).sort((a, b) => {
         const prevEndDate = dayjs(a.endDate)
         const nextEndDate = dayjs(b.endDate)
         if(prevEndDate.isSame(nextEndDate, 'date')){
            return -1
         }
         if(prevEndDate.isBefore(nextEndDate)){
            return 1
         }else if(prevEndDate.isAfter(nextEndDate)){
            return -1
         }
         return 0
      });
   }, [bookTransactionsList, page])

   const renderStartEndDate = (startDate: Date, endDate: Date) => {
      dayjs.tz.setDefault('Asia/Bangkok')
      const startDayjs = dayjs(startDate)
      const endDayjs = dayjs(endDate)
      
      if(startDayjs.isSame(endDayjs, 'date')){
         return `${startDayjs.format('DD')} ${startDayjs.format('MMM')} ${startDayjs.year()}`
      }else if(startDayjs.isSame(endDayjs, 'month')){
         return `${startDayjs.format('DD')} - ${endDayjs.format('DD')} ${startDayjs.format('MMM')} ${startDayjs.year()}`
      }else{
         return `${startDayjs.format('DD')} ${startDayjs.format('MMM')} ${startDayjs.year()} - ${endDayjs.format('DD')} ${endDayjs.format('MMM')} ${endDayjs.year()}`
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

   const renderDetail = (detail: string) => {
      if(detail.includes(`ship`)){
         const arrShipDetail = detail.split(`:`)
         const [type, label, date] = arrShipDetail
         const shipText = `คำสั่งซื้อ`
         const restoreFromChangeWebapp = {
            value: `restore from change web app`,
            text: `เปลี่ยนหนังสือในคอร์ส`,
         }
         const dateStr = date ? dayjs(date).format(`DD MMM YYYY`) : ''
         if(arrShipDetail.length > 1){
            if(label === restoreFromChangeWebapp.value){
               return `${restoreFromChangeWebapp.text} ${dateStr}`
            }
            return `-`
         }
         return `${shipText}`
      }else if(detail.includes(`pickup`)){
         const shipText = `คำสั่งซื้อ (รับที่สถานบัน)`
         return shipText
      }
      return detail
   }

   const handleOnClose = () => {
    route.back()
   }

   const handleOnEditStock = () => {
    setIsEditStock(true)
   }

   return (
      <Modal
         size={"full"}
         className="rounded-none bg-transparent"
         classNames={{
            backdrop: 'bg-backdrop',
         }}
         closeButton={<></>}
         isOpen={true}
         backdrop="blur"
         onClose={() => {}}
         scrollBehavior={"inside"}
         motionProps={{
            variants: {
              enter: {
                x: 0,
                opacity: 1,
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              },
              exit: {
                x: 50,
                opacity: 0,
                transition: {
                  duration: 0.2,
                  ease: "easeIn",
                },
              },
            }
         }}
      >
         <ModalContent>
            <ModalBody className={cn("p-0 flex flex-col  ")}>
              <EditInventory
                  open={isEditStock}
                  onClose={() => setIsEditStock(false)}
                  book={book}
              />
               <div className="flex flex-1 md:flex-row-reverse ">
                  {/* <div className="hidden md:block flex-1"></div> */}
                  <div className="shadow-nextui-large flex flex-col h-full  w-full md:w-[480px] gap-2  bg-white px-4 py-2">
                     <div className="flex gap-2 items-center  ">
                        <Button
                           className="bg-default-100  text-default-foreground"
                           isIconOnly
                           onClick={handleOnClose}
                        >
                           <LuArrowLeft size={24} />
                        </Button>
                        <div className="flex flex-1 gap-2">
                           <Image
                              className="object-cover rounded-small"
                              width={36}
                              height={52}
                              alt="NextUI hero Image"
                              src={`${book?.image}`}
                           />
                           <div className="flex flex-1 justify-between items-center">
                              <div className="text-lg font-semibold font-IBM-Thai">
                                 {/* หนังสือ Dynamics midterm vol.1 - 2/2566{" "} */}
                                 {book ? renderBookName(book) : "-"}
                              </div>
                              <div className="whitespace-nowrap ">
                                 <p className="text-[#393E44] font-IBM-Thai-Looped text-xs">
                                    คงเหลือ
                                 </p>
                                 <p className="text-[#393E44]">
                                    <span className={`text-lg font-semibold font-IBM-Thai`}>
                                       {book?.inStock}{" "}
                                       {/* {renderQty()}{" "} */}
                                    </span>
                                    <span className={`text-xs font-IBM-Thai-Looped`}>ชุด</span>
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                     <Button
                        onClick={handleOnEditStock}
                        className="bg-default-foreground text-primary-foreground font-IBM-Thai font-medium"
                     >
                        <LuPlus size={24} />
                        <div className={`mt-[3px]`}>
                           เพิ่ม/ลด รายการ
                        </div>
                     </Button>
                     <div className="flex flex-col justify-between  flex-1 py-2  ">
                        <Table
                           isStriped
                           color={"primary"}
                           classNames={{
                              ...tableClassnames,
                              th: [
                                 ...tableClassnames.th,
                                 "first:rounded-l-lg",
                                 "last:rounded-r-lg",
                              ],
                              table: 'rounded-none',
                              wrapper: ["p-0", "shadow-none", "rounded-none"],
                           }}
                        >
                           <TableHeader>
                              <TableColumn className={`font-sans`}>วันที่</TableColumn>
                              <TableColumn width={227} className="text-start font-sans">รายการ</TableColumn>
                              <TableColumn className="text-end font-sans">จำนวน</TableColumn>
                           </TableHeader>
                           <TableBody>
                              {booTransactionItems
                              ?
                              booTransactionItems!.map((bookTransaction, index) => (
                                 <TableRow key={`bookTransactionRow${index}`} className={`font-serif`}>
                                    <TableCell>
                                       <div className="flex gap-2 items-center">
                                          <p>{renderStartEndDate(bookTransaction.startDate, bookTransaction.endDate)}</p>
                                       </div>
                                    </TableCell>
                                    <TableCell width={227} className="">
                                       <div className="flex gap-2  items-center">
                                          <p className="">{renderDetail(bookTransaction.detail)}</p>
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
                              className={`font-serif`}
                              classNames={{
                                 cursor: "bg-default-foreground",
                              }}
                              page={page}
                              total={pageSize}
                              onChange={(page) => setPage(page)}
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
