import {
   Button,
   DateInput,
   DateRangePicker,
   Input,
   RangeValue,
   Select,
   SelectItem,
   SelectItemProps,
} from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import {
   parseZonedDateTime,
   parseDate,
   CalendarDate,
   getLocalTimeZone,
} from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { CgClose } from "react-icons/cg";
import { cloneElement, forwardRef, useRef, useState } from "react";
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
import { multiTrackDialog } from ".";
import { DeliverRes, deliveryPrismaProps } from "@/lib/actions/deliver.actions";
export type DeliverFilter = {
   input?: string | undefined;
   status?: string | undefined;
   university?: string | undefined;
   startDate?: string;
   endDate?: string;
};
const FormDeliver = ({
   state,
   onAddTrackings,
   searchState,
   onCloseSelect,
   onPrintTrackings,
   selectData,
}: {
   selectData: multiTrackDialog;
   searchState: stateProps<DeliverFilter>;
   state: stateProps<modalProps>;
   onAddTrackings: () => void;
   onPrintTrackings: (data: DeliverRes["data"]) => void;
   onCloseSelect: () => void;
}) => {
   const [search, setSearch] = searchState;
   const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
   const [selectState, setSelectState] = state;
   const onOpenSelect = () => {
      setSelectState({
         open: true,
         data: undefined,
      });
   };

   const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      clearTimeout(timeoutRef.current);
      if (value && value?.length >= 1) {
         timeoutRef.current = setTimeout(() => {
            setSearch((prev: DeliverFilter) => ({
               ...prev,
               input: value,
            }));
         }, 500);
      } else {
         setSearch((prev: DeliverFilter) => ({
            ...prev,
            input: undefined,
         }));
      }
   };

   const onClickButtonCalendar = (subDate: number) => {
      setSearch((prev: DeliverFilter) => ({
         ...prev,
         startDate: dayjs().format("YYYY-MM-DD"),
         endDate: dayjs().subtract(subDate).format("YYYY-MM-DD"),
      }));
   };

   const onChangeDate = (data: RangeValue<CalendarDate>) => {
      if (data.start) {
         setSearch((prev: DeliverFilter) => ({
            ...prev,
            startDate: dayjs(data?.start.toDate(getLocalTimeZone())).format(
               "YYYY-MM-DD"
            ),
            endDate: dayjs(data?.end.toDate(getLocalTimeZone())).format(
               "YYYY-MM-DD"
            ),
         }));
      } else {
         setSearch((prev: DeliverFilter) => ({
            ...prev,
            startDate: undefined,
            endDate: undefined,
         }));
      }
   };

   const onChangeSearch = (key: keyof DeliverFilter, value: string) => {
      setSearch((prev: DeliverFilter) => ({ ...prev, [key]: value }));
   };

   return (
      <section className=" py-2  grid grid-cols-12  gap-2  items-center">
         <div className="col-span-12 md:col-span-8 order-1">
            <CustomInput
               classNames={{
                  input: "bg-default-foreground rounded-[12px] ",
                  // base: "",
               }}
               onChange={handleChangeSearch}
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
                  onChange={onChangeDate}
                  classNames={{
                     calendarContent: cn("w-[280px]  "),
                     calendar: cn("w-[280px] "),
                     input: cn("text-black"),
                  }}
                  value={
                     search.startDate && search.endDate
                        ? {
                             start: parseDate(search.startDate),

                             end: parseDate(search.endDate),
                          }
                        : null
                  }
                  calendarProps={{
                     classNames: {
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
                        ],
                     },
                  }}
                  CalendarBottomContent={
                     <div className=" text-center flex gap-2 py-2 justify-center font-medium">
                        <Button
                           onClick={() => {
                              onClickButtonCalendar(0);
                           }}
                           size="sm"
                           className="bg-default-100"
                        >
                           Today
                        </Button>
                        <Button
                           onClick={() => {
                              onClickButtonCalendar(2);
                           }}
                           size="sm"
                           className="bg-default-100"
                        >
                           2 days
                        </Button>
                        <Button
                           onClick={() => {
                              onClickButtonCalendar(30);
                           }}
                           size="sm"
                           className="bg-default-100"
                        >
                           30 days
                        </Button>
                     </div>
                  }
               />
            </I18nProvider>
            <Button
               onClick={() => {
                  setSearch((prev: DeliverFilter) => ({
                     ...prev,
                     startDate: undefined,
                     endDate: undefined,
                  }));
               }}
               className="bg-default-100"
               isIconOnly
            >
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
                  className={cn(
                     "font-medium flex-1 bg-default-100 font-IBM-Thai",
                     {}
                  )}
                  onClick={onAddTrackings}
               >
                  <LuTruck size={24} />
                  <p className="">ใส่เลข Track</p>
               </Button>
               <Button
                  // color={"primary"}
                  className={cn(
                     "font-medium flex-1 bg-default-foreground text-primary-foreground font-IBM-Thai",
                     {}
                  )}
                  onClick={() => {
                     onPrintTrackings(
                        selectData.data ? Object.values(selectData.data) : []
                     );
                  }}
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
               <StatusSelect value={search.status} onChange={onChangeSearch} />
               <StatusInstitution onChange={onChangeSearch} />
            </div>
         </div>
      </section>
   );
};

export default FormDeliver;

const StatusSelect = ({
   onChange,
   value,
}: {
   value?: string;
   onChange: (key: keyof DeliverFilter, value: string) => void;
}) => {
   return (
      <Select
         placeholder="สถานะ"
         // className="w-[18dvh]"
         classNames={{
            value: "text-black font-IBM-Thai",
            trigger: cn("flex items-center justify-center    "),
            base: cn("flex-1  rounded-[12px]"),
         }}
         onChange={(e) => {
            onChange("status", e.target.value);
         }}
         selectedKeys={value?.split(",")}
         renderValue={(items) => <div>สถานะ</div>}
         selectionMode={"multiple"}
      >
         <SelectItem
            classNames={{
               base: cn("flex gap-1"),
            }}
            startContent={<LuTruck />}
            key={"ship"}
         >
            จัดส่ง
         </SelectItem>
         <SelectItem
            classNames={{
               base: cn("flex gap-1"),
            }}
            startContent={<LuPackageCheck />}
            key={"shipped"}
         >
            จัดส่งแล้ว
         </SelectItem>
         <SelectItem
            classNames={{
               base: cn("flex gap-1"),
            }}
            startContent={<LuHelpingHand />}
            key={"pickup"}
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

const StatusInstitution = ({
   onChange,
}: {
   onChange: (key: keyof DeliverFilter, value: string) => void;
}) => {
   return (
      <Select
         onChange={(e) => {
            onChange("university", e.target.value);
         }}
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
            key={"kmitl"}
         >
            Kmitl
         </SelectItem>

         <SelectItem
            classNames={{
               base: cn("flex gap-1"),
            }}
            key={"odm"}
         >
            Odm
         </SelectItem>
      </Select>
   );
};
