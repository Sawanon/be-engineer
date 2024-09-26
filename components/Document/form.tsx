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
   LuPlus,
   LuPrinter,
   LuTruck,
   LuX,
} from "react-icons/lu";
import dayjs from "dayjs";
import { modalProps, stateProps } from "@/@type";
const FormDocument = ({
   onAddDocument,
}:{
   onAddDocument: () => void,
}) => {
   return (
      <section className="w-screen py-2 px-2 grid grid-cols-12  gap-2  items-center">
         <Input
            type="text"
            // label="Email"
            placeholder="ชื่อผู้เรียน คอร์สเรียน หรือ ลำดับชื่อหนังสือ midterm/final เทอม ปีการศึกษา"
            // labelPlacement="outside"
            startContent={
               <CiSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            className="col-span-12 md:col-span-8 order-1"
         />

         <div className="flex  gap-2 flex-1 order-2 md:col-span-4 col-span-12">
            <StatusSelect />
            <Button onClick={onAddDocument} className="flex-1 bg-default-foreground text-primary-foreground" endContent={<LuPlus size={20} />}>
               เพิ่มเอกสาร
            </Button>
         </div>
      </section>
   );
};

export default FormDocument;

const StatusSelect = () => {
   return (
      <Select
         placeholder="หนังสือ"
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
