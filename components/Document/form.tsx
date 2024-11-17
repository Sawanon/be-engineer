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
import { modalProps, stateProps } from "@/@type";
import { Book, ChevronDown, FileSignature, ScrollText } from "lucide-react";
import { DocumentMode } from ".";
const FormDocument = ({
   onAddDocument,
   onChangeMode,
   className,
   onChangeSearch,
}:{
   onAddDocument: () => void,
   onChangeMode: (mode: DocumentMode) => void,
   className: string,
   onChangeSearch: (value: string) => void,
}) => {
   return (
      <section className={`flex gap-2 md:flex-row flex-col items-center ${className}`}>
         <Input
            type="text"
            // label="Email"
            placeholder="ชื่อหนังสือ midterm/final เทอม ปีการศึกษา"
            // labelPlacement="outside"
            startContent={
               <CiSearch strokeWidth={1} className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            aria-label={`search document`}
            className={`font-serif`}
            classNames={{
               input: [`text-[1em]`],
            }}
            onChange={(e) => onChangeSearch(e.target.value)}
         />
         <div className="flex gap-2 flex-1 order-2 w-full md:w-auto">
            <div className={`flex-1`}>
               <StatusSelect
                  onChange={(mode) => {
                     onChangeMode(mode.currentKey as DocumentMode)
                  }}
               />
            </div>
            <div className={`flex-1`}>
               <Button
                  onClick={onAddDocument}
                  className={`md:max-w-max w-full font-sans font-medium bg-default-foreground text-primary-foreground`}
                  endContent={<LuPlus size={20} />}
                  aria-label="add document"
               >
                  <span className={`md:hidden`}>
                     เพิ่มเอกสาร
                  </span>
                  <span className={`hidden md:block`}>
                     เพิ่ม
                  </span>
               </Button>
            </div>
         </div>
      </section>
   );
};

export default FormDocument;

const StatusSelect = ({
   onChange,
}:{
   onChange: (mode: SharedSelection) => void,
}) => {
   return (
      <Select
         placeholder="หนังสือ"
         className={`font-sans md:max-w-[116px] w-full`}
         aria-label={`document`}
         classNames={{
            value: "text-default-foreground font-medium",
            trigger: cn("flex items-center justify-center  "),
            base: cn("flex-1 "),
            popoverContent: [`w-max right-0 absolute`],
            innerWrapper: [`w-max`],
            selectorIcon: [`w-6 h-6 end-0 relative`],
         }}
         selectionMode={"single"}
         selectorIcon={<ChevronDown size={24} />}
         onSelectionChange={onChange}
      >
         <SelectItem
            classNames={{
               base: cn("flex gap-1"),
            }}
            className={`font-serif`}
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
            className={`font-serif`}
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
            className={`font-serif`}
            aria-label={`pre-exam`}
            startContent={<FileSignature size={16} />}
            key={"pre-exam"}
         >
            Pre-exam
         </SelectItem>
      </Select>
   );
};
