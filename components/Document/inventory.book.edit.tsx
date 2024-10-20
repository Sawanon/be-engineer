import { cn } from "@/lib/util";
import Alert from "@/ui/alert";
import {
   Button,
   Input,
   Modal,
   ModalBody,
   ModalContent,
   Popover,
   PopoverContent,
   PopoverTrigger,
   Select,
   SelectItem,
   Textarea,
   Image as NextUiImage,
   Tab,
   Tabs,
   Card,
   CardBody,
   DateRangePicker,
   CalendarDate,
   RangeValue,
   DateValue,
} from "@nextui-org/react";
import { Danger } from "iconsax-react";
import {
   LuArrowRightLeft,
   LuExternalLink,
   LuImage,
   LuMinus,
   LuPackageCheck,
   LuPlus,
   LuScrollText,
   LuSearch,
   LuX,
} from "react-icons/lu";

import thaipost from "../../assets/thaipost.png";
import Image from "next/image";
import CustomInput from "../CustomInput";
import { DocumentBook } from "@prisma/client";
import { useState } from "react";
import dayjs from "dayjs";
import { addBookTransactionAction, listBookTransactionByBookId } from "@/lib/actions/bookTransactions";
import { useQuery } from "@tanstack/react-query";
import { listBooksAction } from "@/lib/actions/book.actions";

const EditInventory = ({
   open,
   onClose,
   book,
}: {
   open: boolean;
   onClose: () => void;
   book?: DocumentBook
}) => {
   const {refetch: refetchBookTransaction} =  useQuery({
      queryKey: ["listBookTransactionByBookId", book?.id],
      queryFn: () => listBookTransactionByBookId(book!.id),
      enabled: book !== undefined
   })
   const {refetch: refetchBookList} = useQuery({
      queryKey: ["listBooksAction"],
      queryFn: () => listBooksAction(),
   })
   const [date, setDate] = useState<{startDate:DateValue | undefined, endDate: DateValue | undefined}>()
   const [detail, setDetail] = useState<string>("")
   const [qty, setQty] = useState<number | undefined>()
   const [direction, setDirection] = useState<"+" | "-">("+")
   const [error, setError] = useState({
      isError: false,
      message: ``
   })

   const handleOnChangeDate = (date: RangeValue<DateValue>) => {
      setDate({
         startDate: date.start,
         endDate: date.end,
      })
   }

   const validForm = () => {
      if(!date || !qty || qty === 0 || detail === "") {
         setError({
            isError: true,
            message: `กรุณากรอกข้อมูบให้ครบ`,
         })
         return false
      }
      return true
   }

   const submitAddBookTransaction = async () => {
      if(!validForm()){
         return
      }
      const startDate = dayjs(`${date?.startDate?.year}-${date?.startDate?.month}-${date?.startDate?.day}`)
      const endDate = dayjs(`${date?.endDate?.year}-${date?.endDate?.month}-${date?.endDate?.day}`)
      const volume = direction === "-" ? qty! * -1 : qty!
      const response = await addBookTransactionAction({
         bookId: book!.id,
         detail: detail,
         startDate: startDate.toDate(),
         endDate: endDate.toDate(),
         qty: volume,
      })
      if(!response){
         setError({
            isError: true,
            message: `เกิดข้อผิดพลาดบางอย่าง ดูเพิ่มเติมใน Console`,
         })
         return
      }
      handleOnClose()
      refetchBookTransaction()
      refetchBookList()
   }

   const handleOnClose = () => {
      onClose()
      setDate(undefined)
      setDetail("")
      setQty(undefined)
      setError({
         isError: false,
         message: ``,
      })
   }

   return (
      <Modal
         //  size={"full"}
         // className=" bg-white"
         isOpen={open}
         classNames={{
            base: "top-0 p-0 m-0 absolute md:relative w-screen   md:w-[428px] bg-white m-0  max-w-full ",
         }}
         backdrop="blur"
         onClose={() => {}}
         scrollBehavior={"inside"}
         closeButton={<></>}
      >
         <ModalContent>
            <ModalBody className={cn("p-0 flex-1 ")}>
               <div className="flex flex-col pb-4 ">
                  <div className=" flex flex-col rounded-xl    bg-white flex-1 px-4 space-y-2">
                     <div className="flex gap-1 justify-center my-3  ">
                        <Tabs
                           onSelectionChange={(e) => {
                              setDirection(e === "add" ? "+" : "-")
                           }}
                        >
                           <Tab
                              key="add"
                              title={
                                 <div className="flex items-center space-x-2">
                                    <LuPlus />
                                    <span>เพิ่ม</span>
                                 </div>
                              }
                           />
                           <Tab
                              key="delete"
                              title={
                                 <div className="flex items-center space-x-2">
                                    <LuMinus />
                                    <span>ลด</span>
                                 </div>
                              }
                           />
                        </Tabs>

                        <Button
                           variant="flat"
                           isIconOnly
                           className="bg-transparent text-black absolute right-1 top-1"
                           onClick={handleOnClose}
                        >
                           <LuX size={24} />
                        </Button>
                     </div>
                     {error.isError &&
                        <Alert />
                     }

                     <div className="col-span-2 flex flex-col gap-2">
                        {/* <CustomInput placeholder="วันที่" /> */}
                        <DateRangePicker
                           label={`วันที่`}
                           onChange={handleOnChangeDate}
                        />
                        <CustomInput onChange={(e) => setDetail(e.target.value)} placeholder="รายการ" />{" "}
                        <CustomInput
                           type="number"
                           onChange={(e) => setQty(parseInt(e.target.value))}
                           endContent="ชุด"
                           placeholder="จำนวน"
                        />
                     </div>
                     <div className="py-2 flex gap-2">
                        <Button onClick={submitAddBookTransaction} fullWidth className={`bg-default-foreground text-primary-foreground font-IBM-Thai font-medium`}>
                           บันทึก
                        </Button>
                     </div>
                  </div>
               </div>
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

export default EditInventory;
