import { deliveryTypeProps, modalProps, QueryProps, stateProps } from "@/@type";
import { DeliverRes, deliveryPrismaProps } from "@/lib/actions/deliver.actions";
import {
  useDeliver,
  useDeliverByFilter,
  useInfinityDeliver,
} from "@/lib/query/delivery";
import { tableClassnames } from "@/lib/res/const";
import { isErrorMessageProps } from "@/lib/typeGuard";
import {
  Button,
  Chip,
  Pagination,
  Selection,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import dayjs from "dayjs";
import _ from "lodash";
import { useMemo, useRef, useState } from "react";
import { HiOutlineTruck } from "react-icons/hi";
import {
  LuBookCopy,
  LuFileSignature,
  LuPackage,
  LuPrinter,
} from "react-icons/lu";
import { DeliverFilter } from "./form";
import { checkStatus, rowsPerPage } from "@/lib/util";
type dataItem = {
  data: DeliverRes["data"];
  disable: Record<string, DeliverRes["data"][0]>;
  allData: Record<string, DeliverRes["data"][0]>;
};
const TableDeliver = ({
  data,
  isLoading,
  // query,
  state,
  onOpenEditTracking,
  onAddTrackings,
  onEditAddress,
  tableSelect,
  searchState,
  onPrintTrackings,
  onChangePage,
  page,
}: {
  isLoading: boolean;
  page: number;
  onChangePage: (newPage: number) => void;
  onPrintTrackings: (data: DeliverRes["data"]) => void;
  searchState: stateProps<DeliverFilter>;
  data: DeliverRes;
  tableSelect: stateProps<{
    key: Set<number>;
    data?: Record<string, deliveryPrismaProps>;
  }>;
  // query: ReturnType<typeof useDeliverByFilter>;
  state: stateProps<modalProps>;
  onOpenEditTracking: (data: DeliverRes["data"][0], id?: string) => void;
  onAddTrackings: (
    data: DeliverRes["data"][0],
    type: deliveryTypeProps
  ) => void;
  onEditAddress: (data: DeliverRes["data"][0] | undefined) => void;
}) => {
  const [deliverItem, setDeliverItem] = useState<dataItem>({
    data: [],
    disable: {},
    allData: {},
  });

  const [search, setSearch] = searchState;

  const [selectState] = state;
  const [selectKeys, setSelectKeys] = tableSelect;
  // const [loaderRef, scrollerRef] = useInfiniteScroll({
  //    hasMore: query.hasNextPage,
  //    onLoadMore: query.fetchNextPage,
  // });

  const onSelectRow = (key: Selection) => {
    let data: Record<string, DeliverRes["data"][0]> = {};
    if (key === "all") {
      data = _.omit(deliverItem.allData, Object.keys(deliverItem.disable));
    } else {
      Array.from(key).forEach((id) => {
        const delivery = deliverItem.allData[id];
        data[id.toString()] = delivery;
      });
    }
    console.log("data", data);
    setSelectKeys({ key, data });
  };

  useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage + 1;
    const disabledKeys: Record<string, DeliverRes["data"][0]> = {};
    const deliverMap: Record<string, DeliverRes["data"][0]> = {};
    // if (
    //   !_.isEmpty(search.endDate) ||
    //   !_.isEmpty(search.input) ||
    //   !_.isEmpty(search.startDate) ||
    //   (!_.isEmpty(search.status) && search.status !== "") ||
    //   !_.isEmpty(search.university)
    // ) {
    //   const statusSearch = search.status
    //     ? (search.status.split(",") as (keyof typeof checkStatus)[])
    //     : [];
    //   const ArrData: DeliverRes["data"] = [];
    data.data.forEach((deliver) => {
      const checkType = deliver?.type;
      if (checkType === "pickup" || deliver?.status === "success") {
        disabledKeys[deliver.id.toString()] = deliver;
      }
      deliverMap[deliver.id.toString()] = deliver;
    });
    //     const inputSearch = search.input ?? "";

    //     const checkInput =
    //       _.isEmpty(search.input) ||
    //       deliver.member?.toLowerCase().includes(inputSearch) ||
    //       deliver.webappOrderId
    //         ?.toString()
    //         .toLowerCase()
    //         .includes(inputSearch) ||
    //       deliver.Delivery_WebappCourse?.some((course) =>
    //         course.WebappCourse?.name
    //           ?.toLowerCase()
    //           .includes(inputSearch.toLowerCase())
    //       );

    //     const checkStatusSearch =
    //       _.isEmpty(search.status) ||
    //       statusSearch.some((status) => {
    //         return (
    //           checkStatus[status]?.status === deliver.status &&
    //           checkStatus[status]?.type === deliver.type
    //         );
    //       });
    //     const checkStartDate =
    //       _.isEmpty(search.startDate) ||
    //       dayjs(search.startDate)
    //         .startOf("date")
    //         .isSameOrBefore(dayjs(deliver.approved));

    //     const checkEndDate =
    //       _.isEmpty(search.endDate) ||
    //       dayjs(search.endDate)
    //         .endOf("date")
    //         .isSameOrAfter(dayjs(deliver.approved));
    //     const checkUniversity =
    //       _.isEmpty(search.university) ||
    //       deliver.branch?.toLowerCase().includes(search?.university!);

    //     if (deliver.id === 2560) {
    //       console.table({
    //         startDate: search.startDate,
    //         endDate: search.endDate,
    //         checkStartDate,
    //         checkEndDate,
    //       });
    //     }
    //     if (
    //       checkInput &&
    //       checkStatusSearch &&
    //       checkUniversity &&
    //       checkStartDate &&
    //       checkEndDate
    //     ) {
    //       ArrData.push(deliver);
    //     }
    //   });

    //   setAllPage(Math.ceil(ArrData.length / rowsPerPage));
    //   setDeliverItem({
    //     data: ArrData.slice(startIndex, endIndex),
    //     disable: disabledKeys,
    //     allData: deliverMap,
    //   });
    // } else {

    // const currentData = data.data?.slice(startIndex, endIndex);

    // const keys = Object.keys(deliverMap).slice(startIndex, endIndex);
    // const slicedObject = _.pick(deliverMap, keys);
    setDeliverItem({
      data: data.data.slice(startIndex, endIndex),
      disable: disabledKeys,
      allData: deliverMap,
    });
    // }
  }, [data, search]);

  // useMemo(() => {
  //   setPage(1);
  // }, [allPage]);
  return (
    <>
      <Table
        // color={"secondary"}
        disabledKeys={selectState.open ? Object.keys(deliverItem.disable) : ""}
        // layout="fixed"
        isStriped
        isHeaderSticky
        // color={"primary"}
        selectionMode={selectState.open ? "multiple" : "none"}
        classNames={{
          ...tableClassnames,
          emptyWrapper: "font-serif",
          base: "flex-1  mb-4  ",
          // tbody : "overflow-scroll scrollbar-hide",
          table: " flex-1 ",
          th: [
            "font-serif",
            "bg-default-100",
            "border-b-1",
            "first:rounded-none",
            "last:rounded-none",
          ],
          td: [
            "first:before:rounded-l-none",
            "rtl:first:before:rounded-r-none",
            "last:before:rounded-r-none",
            "rtl:last:before:rounded-l-none",
          ],
        }}
        aria-label="deliver-table"
        selectedKeys={selectKeys.key}
        onSelectionChange={onSelectRow}
        //  defaultSelectedKeys={["2", "3"]}
        //  aria-label="Example static collection table"
        // TODO: pagination
        // baseRef={scrollerRef}
        // bottomContent={
        //    query.hasNextPage ? (
        //       <div className="flex w-full justify-center">
        //          <Spinner ref={loaderRef} color="success" />
        //       </div>
        //    ) : null
        // }
      >
        <TableHeader>
          <TableColumn className="font-sans">ลำดับ</TableColumn>
          <TableColumn className="font-sans">ผู้เรียน</TableColumn>
          <TableColumn className="font-sans">คอร์สเรียน</TableColumn>
          <TableColumn className="font-sans">จัดส่ง</TableColumn>
          <TableColumn className="font-sans">อนุมัติ</TableColumn>
          <TableColumn className="font-sans">สถานะ</TableColumn>
        </TableHeader>

        <TableBody
          emptyContent={"ไม่มีคำสั่งซื่อในวันนี้"}
          // items={deliverItem.data}
          items={data.data}
          isLoading={isLoading}
          loadingContent={<Spinner />}
          className=""
        >
          {(deliver) => {
            const status = deliver?.status ?? "waiting";
            return (
              <TableRow key={deliver?.id}>
                <TableCell>
                  <div className="font-serif">
                    <p className="font-serif">{deliver?.webappOrderId}</p>
                    {deliver.branch === "KMITL" && (
                      <p className="rounded-sm p-1 bg-default-50">KMITL</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <pre className="font-serif whitespace-nowrap">
                    {`${deliver.member}`}
                  </pre>
                </TableCell>
                <TableCell>
                  <div>
                    {deliver.Delivery_WebappCourse.map(
                      (Delivery_WebappCourse) => {
                        const course = Delivery_WebappCourse.WebappCourse;
                        return (
                          // <div
                          //   className="font-serif text-base font-medium "
                          //   key={course?.id}
                          // >
                          //   <div className="flex gap-1">
                          //     <div className="w-2 h-2 rounded-full bg-black mt-[6px]" />
                          //     {course?.name}{" "}
                          //     {deliver.branch === "KMITL" &&
                          //       `${deliver.branch}`}
                          //   </div>

                          //   <p className="ml-3 whitespace-nowrap text-sm font-normal">
                          //     {course?.term}
                          //   </p>

                          // </div>

                          <div key={course?.id}>
                            <div className="font-serif text-base">
                              <div className="flex gap-1 leading-5">
                                <div className="w-1 h-1 rounded-full bg-black mt-2 flex-shrink-0"></div>
                                {course?.name}{" "}
                                {deliver.branch === "KMITL" &&
                                  `${deliver.branch}`}
                              </div>
                              <p className="ml-2 whitespace-nowrap text-sm font-normal text-default-400">
                                {course?.term}
                              </p>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() => {
                    if (status === "success" || deliver.type === "pickup")
                      return;
                    onEditAddress(deliver);
                  }}
                >
                  <button className="text-left ">
                    <p className="w-[300px] font-serif">
                      {deliver.updatedAddress}
                    </p>
                  </button>
                </TableCell>
                <TableCell className={`font-serif`}>
                  {dayjs(deliver.approved).format("MMM-DD HH:mm")}
                </TableCell>
                <TableCell className=" ">
                  {status === "success" ? (
                    <TrackingDetail
                      onOpenEditTracking={onOpenEditTracking}
                      checkType={deliver.type as deliveryTypeProps}
                      tracking={deliver}
                    />
                  ) : (
                    <AddTrackDetail
                      deliveryType={deliver.type as deliveryTypeProps}
                      deliver={deliver}
                      onAddTrackings={onAddTrackings}
                      onPrint={onPrintTrackings}
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </>
  );
};

export default TableDeliver;

const TrackingDetail = ({
  tracking,
  checkType,
  onOpenEditTracking,
}: {
  onOpenEditTracking: (d: DeliverRes["data"][0], id?: string) => void;
  checkType: deliveryTypeProps;
  tracking?: DeliverRes["data"][0];
}) => {
  return (
    <>
      {checkType === "ship" && (
        <div className="leading-3">
          <p className="text-secondary-fade text-xs font-serif">
            ส่งวันที่ {dayjs(tracking?.updatedAt).format("DD MMM YYYY")}
          </p>

          <div className="flex flex-col text-secondary-default text-base font-semibold font-serif">
            <p>{tracking?.trackingCode}</p>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  window.open(
                    `${tracking?.DeliverShipService?.trackingUrl}${tracking?.trackingCode}`
                  );
                }}
                isIconOnly
                className="bg-default-100"
              >
                <HiOutlineTruck className="" size={24} />
              </Button>
              <Button
                onClick={() => {
                  onOpenEditTracking(tracking!, tracking?.id.toString());
                }}
                isIconOnly
                className="bg-default-100"
              >
                <LuBookCopy className="" size={24} />
              </Button>
            </div>
          </div>
          <p className="px-1 mt-1 py-[2px] bg-warning-50 w-fit text-warning font-serif">
            {tracking?.note}
          </p>
        </div>
      )}
      {checkType === "pickup" && (
        <>
          <p className="text-secondary-fade text-xs font-serif">
            {dayjs(tracking?.updatedAt).format("HH:mm น.")} โดย{" "}
            {tracking?.webappAdminUsername}
          </p>
          <p className="text-secondary-default font-semibold font-serif text-base">
            รับวันที่ {dayjs(tracking?.updatedAt).format("DD MMM YYYY")}
          </p>
          <Button
            onClick={() => {
              onOpenEditTracking(tracking!, tracking?.id.toString());
            }}
            isIconOnly
            className="bg-default-100"
          >
            <LuBookCopy className="" size={24} />
          </Button>
          <p className="px-1 py-[2px] bg-warning-50 w-fit text-warning font-serif text-base">
            {tracking?.note}
          </p>
        </>
      )}
    </>
  );
};

const AddTrackDetail = ({
  onAddTrackings,
  deliver,
  onPrint,
  deliveryType,
}: {
  deliveryType: deliveryTypeProps;
  onAddTrackings: (
    data: DeliverRes["data"][0],
    type: deliveryTypeProps
  ) => void;
  deliver: DeliverRes["data"][0];
  onPrint: (data: DeliverRes["data"]) => void;
}) => {
  return (
    <div className="space-y-2">
      {deliveryType === "ship" && (
        <div className="flex flex-col gap-1">
          <Button
            color="default"
            variant="flat"
            className="flex-shrink-0 text-base font-medium font-sans bg-default-100"
            size="sm"
            startContent={<LuPackage size={20} />}
            onClick={() => onAddTrackings(deliver, deliveryType)}
          >
            เพิ่ม Track no.
          </Button>
          <Button
            color="default"
            variant="flat"
            className="flex-shrink-0  text-base font-medium font-sans bg-default-100"
            size="sm"
            startContent={<LuPrinter size={20} />}
            onClick={() => {
              onPrint([deliver]);
            }}
          >
            พิมพ์ใบปะหน้า
          </Button>
        </div>
      )}
      {deliveryType === "pickup" && (
        <>
          <Button
            color="default"
            variant="flat"
            className="flex-shrink-0 font-sans text-base font-medium bg-default-100"
            size="sm"
            startContent={<LuFileSignature size={20} />}
            onClick={() => onAddTrackings(deliver, deliveryType)}
          >
            รับที่สถาบัน
          </Button>
        </>
      )}
    </div>
  );
};
