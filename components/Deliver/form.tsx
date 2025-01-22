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
import { cloneElement, forwardRef, useEffect, useRef, useState } from "react";
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
import { Calendar } from "iconsax-react";
import { ChevronDown } from "lucide-react";
import _ from "lodash";
import { useSearchParams ,useRouter} from "next/navigation";
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
  const route = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = searchState;
  const [preSearchInput, setPresearchInput] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [selectState, setSelectState] = state;
  const onOpenSelect = () => {
    setSelectState({
      open: true,
      data: undefined,
    });
  };

  const handleChangeSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if(value){
      params.set('search', value)
      params.set('page', '1')
      
    }else{
      params.delete('search')
    }
    
    route.replace(`/deliver?${params.toString()}`)
    // if (value && value?.length >= 1) {
    //   setSearch((prev: DeliverFilter) => ({
    //     // ...prev,
    //     input: value,
    //   }));
    // } else {
    //   setSearch((prev: DeliverFilter) => ({
    //     // ...prev,
    //     input: undefined,
    //   }));
    // }
  };

  const debouncedSearch = _.debounce(handleChangeSearch, 500);
  useEffect(() => {
    debouncedSearch(preSearchInput);
    return () => {
      debouncedSearch.cancel();
    };
  }, [preSearchInput]);

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
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setSearch((prev: DeliverFilter) => ({ ...prev, [key]: value }));
    }, 250);
  };

  return (
    <section className=" py-2  grid grid-cols-12  gap-2  items-center">
      <div className="col-span-12 md:col-span-8 order-1">
        <CustomInput
          defaultValue={search.input}
          classNames={{
            input: "bg-default-foreground rounded-[12px] ",
            // base: "",
          }}
          onChange={(e) => setPresearchInput(e.target.value)}
          type="text"
          placeholder="ชื่อผู้เรียน คอร์สเรียน หรือ ลำดับ"
          startContent={
            <CiSearch
              strokeWidth={1}
              className=" text-2xl text-default-400 pointer-events-none flex-shrink-0"
            />
          }
        />
      </div>
      <div className="flex gap-2 order-2 col-span-12 md:order-4 md:col-span-5 ">
        <I18nProvider locale="en-GB">
          <DateRangePicker
            color={`primary`}
            onChange={onChangeDate}
            className={`font-serif`}
            classNames={{
              calendarContent: cn("w-[280px] font-serif"),
              inputWrapper: cn("bg-default-100"),
              innerWrapper: cn("text-primary-300"),
              calendar: cn("w-[280px]"),
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
            endContent={
              <Calendar
                className={`text-default-400`}
                variant="Bold"
                size={18}
              />
            }
            calendarProps={{
              classNames: {
                cellButton: [
                  // `before:bg-primary-200`,
                  `data-[selected=true]:data-[range-selection=true]:before:bg-primary-200`,
                  // default text color
                  // "text-red-300",
                  // selected case
                  // "data-[selectionStart=true]:bg-red-500",
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
                  className="bg-default-100 text-default-foreground font-sans text-base font-medium"
                >
                  Today
                </Button>
                {/* <Button
                  onClick={() => {
                    onClickButtonCalendar(2);
                  }}
                  size="sm"
                  className="bg-default-100 text-default-foreground font-sans text-base font-medium"
                >
                  2 days
                </Button>
                <Button
                  onClick={() => {
                    onClickButtonCalendar(30);
                  }}
                  size="sm"
                  className="bg-default-100 text-default-foreground font-sans text-base font-medium"
                >
                  30 days
                </Button> */}
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
        className={cn("md:col-span-7 col-span-2  order-3 flex items-center", {
          "col-span-12 flex gap-2": selectState.open,
        })}
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
          color="default"
          variant="flat"
          className={cn("flex-shrink-0 hidden md:flex text-base font-medium", {
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
            className={cn(
              "flex-shrink-0 text-base  hidden font-medium font-sans",
              {
                "md:flex  ": selectState.open,
              }
            )}
            color="default"
            variant="flat"
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
              "flex-shrink-0 text-base  hidden font-medium font-sans",
              {
                "flex  ": selectState.open,
              }
            )}
            color="default"
            variant="flat"
            onClick={onAddTrackings}
          >
            <LuTruck size={24} />
            <p className="">ใส่เลข Track</p>
          </Button>
          <Button
            color={"primary"}
            variant="solid"
            className={cn(
              "flex-shrink-0 text-base font-medium flex-1 font-sans",
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
        <div className="flex flex-1 gap-2 ">
          <StatusSelect value={search.status} onChange={onChangeSearch} />
          <StatusInstitution
            onChange={onChangeSearch}
            value={search.university}
          />
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
  const [statusSearch, setStatusSearch] = useState<string | undefined>(value);
  return (
    <Select
      placeholder="สถานะ"
      // className="w-[18dvh]"
      classNames={{
        value: ["text-default-foreground font-medium font-sans text-base"],
        trigger: cn("flex items-center justify-center    "),
        base: cn("flex-1  rounded-xl"),
        selectorIcon: [`relative end-0 w-6 h-6`],
      }}
      selectorIcon={<ChevronDown size={24} />}
      onChange={(e) => {
        setStatusSearch(e.target.value);
        onChange("status", e.target.value);
      }}
      color="default"
      variant="flat"
      className={cn("flex-shrink-0 md:flex text-base font-sans font-medium")}
      selectedKeys={statusSearch?.split(",")}
      renderValue={(items) => <div>สถานะ</div>}
      selectionMode={"multiple"}
    >
      <SelectItem
        classNames={{
          base: cn("flex gap-1 font-serif text-base"),
        }}
        startContent={<LuTruck />}
        key={"ship"}
      >
        จัดส่ง
      </SelectItem>
      <SelectItem
        classNames={{
          base: cn("flex gap-1 font-serif text-base"),
        }}
        startContent={<LuPackageCheck />}
        key={"shipped"}
      >
        จัดส่งแล้ว
      </SelectItem>
      <SelectItem
        classNames={{
          base: cn("flex gap-1 font-serif text-base"),
        }}
        startContent={<LuHelpingHand />}
        key={"pickup"}
      >
        รับที่สถาบัน
      </SelectItem>
      <SelectItem
        classNames={{
          base: cn("flex gap-1 font-serif text-base"),
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
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (key: keyof DeliverFilter, value: string) => void;
}) => {
  return (
    <Select
      onChange={(e) => {
        console.log("e.target.value", e.target.value);
        onChange("university", e.target.value);
      }}
      placeholder={`สถาบัน`}
      selectedKeys={value ? new Set([value]) : undefined}
      // defaultSelectedKeys={value}
      classNames={{
        value: ["text-default-foreground font-medium font-sans text-base"],
        trigger: cn("flex items-center justify-center  "),
        base: cn("flex-1 rounded-[12px]"),
        selectorIcon: [`relative end-0 w-6 h-6`],
      }}
      selectorIcon={<ChevronDown size={24} />}
      color="default"
      variant="flat"
      className={cn(
        "w-[18dvh] flex-shrink-0 md:flex text-base font-sans font-medium"
      )}

      // selectionMode={"multiple"}
    >
      <SelectItem
        classNames={{
          base: cn("flex gap-1 font-serif"),
        }}
        key={"kmitl"}
      >
        Kmitl
      </SelectItem>

      <SelectItem
        classNames={{
          base: cn("flex gap-1 font-serif"),
        }}
        key={"odm"}
      >
        Odm
      </SelectItem>
    </Select>
  );
};
