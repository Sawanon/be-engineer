import {
   Button,
   DateInput,
   DateRangePicker,
   Input,
   Select,
   SelectItem,
   SelectItemProps,
} from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import { parseZonedDateTime, parseDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { CgClose } from "react-icons/cg";
import { cloneElement, forwardRef } from "react";
import { cn } from "@/lib/util";
import { HiOutlineTruck } from "react-icons/hi";
import {
   LuBookOpenCheck,
   LuCopyCheck,
   LuHelpingHand,
   LuPackageCheck,
   LuPrinter,
   LuTruck,
   LuX,
} from "react-icons/lu";
import dayjs from "dayjs";
import { modalProps, stateProps } from "@/@type";
import CustomInput from "../CustomInput";
const FormDeliver = ({
   state,
   onAddTrackings,
   onPrint,
}: {
   state: stateProps<modalProps>;
   onAddTrackings: () => void;
   onPrint: () => void;
}) => {
   const [selectState, setSelectState] = state;
   const onOpenSelect = () => {
      setSelectState({
         open: true,
         data: undefined,
      });
   };

   const onCloseSelect = () => {
      setSelectState({ open: false });
   };

   return (
      <section className=" py-2  grid grid-cols-12  gap-2  items-center">
         <div className="col-span-12 md:col-span-8 order-1">
            <CustomInput
               classNames={{
                  input: "bg-default-foreground rounded-[12px] ",
                  // base: "",
               }}
               type="text"
               placeholder="ชื่อผู้เรียน คอร์สเรียน หรือ ลำดับ"
               startContent={
                  <CiSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
               }
            />
         </div>
         <div className="flex gap-2 order-2 col-span-12 md:order-4 md:col-span-5 ">
            <I18nProvider locale="en-GB">
               <DateRangePicker
                  classNames={{
                     calendarContent: cn("w-[280px]  "),
                     calendar: cn("w-[280px] "),
                     input: cn("text-black"),
                  }}
                  calendarProps={{
                     classNames  : {
                        cellButton: [
                           // default text color
                           // "text-red-300",
                           // selected case
                           
                           "data-[selectionStart=true]:bg-red-500",
                           // "data-[selection-end=true]:bg-red-500",
                           // "data-[selected=true]:bg-default-foreground",
                           // "data-[selected=true]:text-default-foreground",
                           // hover case
                           // "data-[hover=true]:bg-secondary-50",
                           // "data-[hover=true]:text-secondary-400",
                           // selected and hover case
                           // "data-[selected=true]:data-[hover=true]:bg-secondary",
                           // "data-[selected=true]:data-[hover=true]:text-secondary-foreground",
                         ]
                     }
                  }}
                  defaultValue={{
                     start: parseDate(dayjs().format("YYYY-MM-DD")),
                     end: parseDate(
                        dayjs().add(1, "days").format("YYYY-MM-DD")
                     ),
                  }}
                  CalendarBottomContent={
                     <div className=" text-center flex gap-2 py-2 justify-center font-medium">
                        <Button size="sm" className="bg-default-100">
                           1 day
                        </Button>
                        <Button size="sm" className="bg-default-100">
                           2 days
                        </Button>
                        <Button size="sm" className="bg-default-100">
                           30 days
                        </Button>
                     </div>
                  }
               />
            </I18nProvider>
            <Button className="bg-default-100" isIconOnly>
               <LuX className="text-[#A1A1AA] h-6 w-6" />
            </Button>
         </div>

         <div
            className={cn(
               "md:col-span-7 col-span-2  order-3 flex items-center",
               {
                  "col-span-12 flex gap-2": selectState.open,
               }
            )}
         >
            <Button
               className={cn(" w-full  md:hidden bg-default-100", {
                  hidden: selectState.open,
               })}
               isIconOnly
               onClick={onOpenSelect}
            >
               <LuCopyCheck className="text-black h-6 w-6 block md:hidden" />{" "}
            </Button>
            <Button
               className={cn("bg-default-100 hidden md:flex", {
                  "hidden md:hidden": selectState.open,
               })}
               onClick={onOpenSelect}
            >
               <p className="font-IBM-Thai font-medium">เลือก</p>
            </Button>
            <div
               className={cn("flex gap-2 flex-1 md:flex-grow-0", {
                  hidden: !selectState.open,
               })}
            >
               <Button
                  className={cn("bg-default-100 hidden font-IBM-Thai", {
                     "md:flex  ": selectState.open,
                  })}
                  onClick={onCloseSelect}
               >
                  <p className="md:block hidden">ยกเลิก</p>
               </Button>
               <Button
                  color="secondary"
                  className={cn("bg-default-100  md:hidden font-medium", {
                     "flex  ": selectState.open,
                  })}
                  isIconOnly
                  onClick={onCloseSelect}
               >
                  <LuX className="text-danger h-6 w-6 block md:hidden" />{" "}
               </Button>
               <Button
                  className={cn("font-medium flex-1 bg-default-100 font-IBM-Thai", {})}
                  onClick={onAddTrackings}
               >
                  <LuTruck size={24}/>
                  <p className="">ใส่เลข Track</p>
               </Button>
               <Button
                  // color={"primary"}
                  className={cn(
                     "font-medium flex-1 bg-default-foreground text-primary-foreground font-IBM-Thai",
                     {}
                  )}
                  onClick={onPrint}
               >
                  <LuPrinter size={24} />
                  <p className="flex  ">
                     <span className="md:block hidden">พิมพ์</span>
                     <span className="">ใบปะหน้า</span>
                  </p>
               </Button>
            </div>
         </div>

         <div
            className={cn(
               "flex gap-2 order-4 col-span-10 md:order-2 md:col-span-4",
               {
                  "hidden md:flex": selectState.open,
               }
            )}
         >
            <div className="flex  gap-2 flex-1 ">
               <StatusSelect />
               <StatusInstitution />
            </div>
         </div>
      </section>
   );
};

export default FormDeliver;

const StatusSelect = () => {
   return (
      <Select
         placeholder="สถานะ"
         // className="w-[18dvh]"
         classNames={{
            value: "text-black font-IBM-Thai",
            trigger: cn("flex items-center justify-center    "),
            base: cn("flex-1  rounded-[12px]"),
         }}
         renderValue={(items) => <div>สถานะ</div>}
         selectionMode={"multiple"}
      >
         <SelectItem
            classNames={{
               base: cn("flex gap-1"),
            }}
            startContent={<LuTruck />}
            key={"send"}
         >
            จัดส่ง
         </SelectItem>
         <SelectItem
            classNames={{
               base: cn("flex gap-1"),
            }}
            startContent={<LuPackageCheck />}
            key={"sended"}
         >
            จัดส่งแล้ว
         </SelectItem>
         <SelectItem
            classNames={{
               base: cn("flex gap-1"),
            }}
            startContent={<LuHelpingHand />}
            key={"take"}
         >
            รับที่สถาบัน
         </SelectItem>
         <SelectItem
            classNames={{
               base: cn("flex gap-1"),
            }}
            startContent={<LuBookOpenCheck />}
            key={"received"}
         >
            รับหนังสือแล้ว
         </SelectItem>
      </Select>
   );
};

const StatusInstitution = () => {
   return (
      <Select
         placeholder={`สถาบัน`}
         className="w-[18dvh] font-IBM-Thai"
         classNames={{
            value: "text-black",
            trigger: cn("flex items-center justify-center  "),
            base: cn("flex-1 rounded-[12px]"),
         }}
         // selectionMode={"multiple"}
      >
         <SelectItem
            classNames={{
               base: cn("flex gap-1"),
            }}
            key={"send"}
         >
            Kmutnb
         </SelectItem>
         <SelectItem
            classNames={{
               base: cn("flex gap-1"),
            }}
            key={"sended"}
         >
            Kmitl
         </SelectItem>
         <SelectItem
            classNames={{
               base: cn("flex gap-1"),
            }}
            key={"take"}
         >
            Odm
         </SelectItem>
      </Select>
   );
};
