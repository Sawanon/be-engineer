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
const FormDeliver = ({ state }: { state: stateProps<modalProps> }) => {
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
      <section className="w-screen py-2 px-2 grid grid-cols-12  gap-2  items-center">
         <Input
            type="text"
            // label="Email"
            placeholder="ชื่อผู้เรียน คอร์สเรียน หรือ ลำดับ"
            // labelPlacement="outside"
            startContent={
               <CiSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            className="col-span-12 md:col-span-8 order-1"
         />
         <div className="flex gap-2 order-2 col-span-12 md:order-4 md:col-span-5 ">
            <I18nProvider locale="en-GB">
               <DateRangePicker
                  classNames={{
                     input: cn("text-black"),
                  }}
                  defaultValue={{
                     start: parseDate(dayjs().format("YYYY-MM-DD")),
                     end: parseDate(
                        dayjs().add(1, "days").format("YYYY-MM-DD")
                     ),
                  }}
                  CalendarBottomContent={
                     <div className=" text-center flex gap-2 py-2 justify-center">
                        <Button size="sm" color={"secondary"}>
                           1 day
                        </Button>
                        <Button size="sm" color={"secondary"}>
                           2 days
                        </Button>
                        <Button size="sm" color={"secondary"}>
                           30 days
                        </Button>
                     </div>
                  }
               />
            </I18nProvider>
            <Button className="bg-[#F4F4F5]" isIconOnly>
               <CgClose className="text-[#A1A1AA] h-6 w-6" />
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
            <>
               <Button
               color="secondary"
                  className={cn(" w-full  md:hidden", {
                     hidden: selectState.open,
                  })}
                  isIconOnly
                  onClick={onOpenSelect}
               >
                  <LuCopyCheck className="text-black h-6 w-6 block md:hidden" />{" "}
               </Button>
               <Button
                  className={cn("bg-[#F4F4F5] hidden md:flex", {
                     "hidden md:hidden": selectState.open,
                  })}
                  onClick={onOpenSelect}
               >
                  <p className="">เลือก</p>
               </Button>
            </>
            <div className={cn("flex gap-2 flex-1 md:flex-grow-0", { hidden: !selectState.open })}>
               <>
                  <Button
                     className={cn("bg-[#F4F4F5] hidden", {
                        "md:flex  ": selectState.open,
                     })}
                     onClick={onCloseSelect}
                  >
                     <p className="md:block hidden">ยกเลิก</p>
                  </Button>
                  <Button
                     color="secondary"
                     className={cn("bg-[#F4F4F5] md:hidden font-medium", {
                        "flex  ": selectState.open,
                     })}
                     isIconOnly
                     onClick={onCloseSelect}
                  >
                     <LuX className="text-black h-6 w-6 block md:hidden" />{" "}
                  </Button>
               </>
               <Button
                  color="secondary"
                  className={cn("font-medium w-full", {})}
                  onClick={onOpenSelect}
               >
                  <LuTruck />
                  <p className="">ใส่เลข Track</p>
               </Button>
               <Button
                  color={"primary"}
                  className={cn("font-medium w-full", {})}
                  onClick={onOpenSelect}
               >
                  <LuPrinter />
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
         className="w-[18dvh]"
         classNames={{
            value: "text-black",
            trigger: cn("flex items-center justify-center  "),
            base: cn("flex-1 "),
         }}
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
         className="w-[18dvh]"
         classNames={{
            value: "text-black",
            trigger: cn("flex items-center justify-center  "),
            base: cn("flex-1 "),
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
