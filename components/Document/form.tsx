import {
   Button,
   DateInput,
   DateRangePicker,
   Input,
   Select,
   SelectItem,
   SelectItemProps,
   SharedSelection,
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
import { Book, FileSignature, ScrollText } from "lucide-react";
import { DocumentMode } from ".";
const FormDocument = ({
   onAddDocument,
   onChangeMode,
}:{
   onAddDocument: () => void,
   onChangeMode: (mode: DocumentMode) => void,
}) => {
   return (
      <section className="py-2 px-2 grid grid-cols-12  gap-2  items-center">
         <Input
            type="text"
            // label="Email"
            placeholder="ชื่อผู้เรียน คอร์สเรียน หรือ ลำดับชื่อหนังสือ midterm/final เทอม ปีการศึกษา"
            // labelPlacement="outside"
            startContent={
               <CiSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            aria-label={`search document`}
            className="col-span-12 md:col-span-8 order-1"
         />

         <div className="flex gap-2 flex-1 order-2 md:col-span-4 col-span-12">
            <StatusSelect
               onChange={(mode) => {
                  onChangeMode(mode.currentKey as DocumentMode)
               }}
            />
            <Button
               onClick={onAddDocument}
               className="max-w-max flex-1 bg-default-foreground text-primary-foreground"
               endContent={<LuPlus size={20} />}
            >
               เพิ่ม
            </Button>
         </div>
      </section>
   );
};

export default FormDocument;

const StatusSelect = ({
   onChange,
}:{
   onChange: (mode: SharedSelection) => void
}) => {
   return (
      <Select
         placeholder="หนังสือ"
         className={`max-w-[116px]`}
         aria-label={`document`}
         classNames={{
            value: "text-black",
            trigger: cn("flex items-center justify-center  "),
            base: cn("flex-1 "),
            popoverContent: [`w-max right-0 absolute`],
         }}
         selectionMode={"single"}
         onSelectionChange={onChange}
      >
         <SelectItem
            classNames={{
               base: cn("flex gap-1"),
            }}
            aria-label={`หนังสือ`}
            startContent={<Book size={16} />}
            key={"book"}
         >
            หนังสือ
         </SelectItem>
         <SelectItem
            classNames={{
               base: cn("flex gap-1"),
            }}
            aria-label={`เอกสาร`}
            startContent={<ScrollText size={16} />}
            key={"sheet"}
         >
            เอกสาร
         </SelectItem>
         <SelectItem
            classNames={{
               base: cn("flex gap-1"),
            }}
            aria-label={`pre-exam`}
            startContent={<FileSignature size={16} />}
            key={"pre-exam"}
         >
            Pre-exam
         </SelectItem>
      </Select>
   );
};
