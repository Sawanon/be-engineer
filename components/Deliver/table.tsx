import { deliveryTypeProps, modalProps, QueryProps, stateProps } from "@/@type";
import { DeliverRes, deliveryPrismaProps } from "@/lib/actions/deliver.actions";
import { useDeliver, useInfinityDeliver } from "@/lib/query/delivery";
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
type dataItem = {
   data: DeliverRes["data"];
   disable: Record<string, DeliverRes["data"][0]>;
   allData: Record<string, DeliverRes["data"][0]>;
};
const TableDeliver = ({
   data,
   // query,
   state,
   onOpenEditTracking,
   onAddTrackings,
   onEditAddress,
   tableSelect,
   searchState,
   onPrintTrackings,
}: {
   onPrintTrackings: (data: DeliverRes["data"]) => void;

   searchState: stateProps<DeliverFilter>;

   data: DeliverRes;
   tableSelect: stateProps<{
      key: Set<number>;
      data?: Record<string, deliveryPrismaProps>;
   }>;
   // query: ReturnType<typeof useDeliver>;
   state: stateProps<modalProps>;
   onOpenEditTracking: (data: DeliverRes["data"][0]) => void;
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
   const [page, setPage] = useState(1);
   const [allPage, setAllPage] = useState(10);
   const [currentPage, setCurrentPage] = useState(1);
   const [rowsPerPage, setRowsPerPage] = useState(100);

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
      setSelectKeys({ key, data });
   };
   // useMemo(() => {
   //    const deliverMap: Record<string, NonNullable<deliveryPrismaProps>> = {};
   //    const disabledKeys: Record<string, NonNullable<deliveryPrismaProps>> = {};

   //    if (query.data?.pages) {
   //       for (let index = 0; index < query.data?.pages?.length; index++) {
   //          const page = query.data.pages[index];
   //          page.dataArr?.forEach((deliver) => {
   //             const checkType = deliver?.type;
   //             if (checkType === "pickup" || deliver?.status === "success") {
   //                disabledKeys[deliver.id.toString()] = deliver;
   //             }
   //             deliverMap[deliver.id.toString()] = deliver;
   //          });
   //          // }
   //       }
   //    }
   //    setDeliverItem({ data: deliverMap, pickup: disabledKeys });
   // }, [query.data?.]);
   useMemo(() => {
      const startIndex = (page - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage + 1;
      const disabledKeys: Record<string, DeliverRes["data"][0]> = {};
      const deliverMap: Record<string, DeliverRes["data"][0]> = {};

      // console.table({
      //    endDate: !_.isEmpty(search.endDate),
      //    input: !_.isEmpty(search.input),
      //    startDate: !_.isEmpty(search.startDate),
      //    status: !_.isEmpty(search.status) && search.status !== "",
      //    uni: !_.isEmpty(search.university),
      // });
      if (
         !_.isEmpty(search.endDate) ||
         !_.isEmpty(search.input) ||
         !_.isEmpty(search.startDate) ||
         (!_.isEmpty(search.status) && search.status !== "") ||
         !_.isEmpty(search.university)
      ) {
         const statusSearch = search.status
            ? (search.status.split(",") as (keyof typeof checkStatus)[])
            : [];
         const ArrData: DeliverRes["data"] = [];
         data.data.forEach((deliver) => {
            const checkType = deliver?.type;
            if (checkType === "pickup" || deliver?.status === "success") {
               disabledKeys[deliver.id.toString()] = deliver;
            }
            deliverMap[deliver.id.toString()] = deliver;
            const inputSearch = search.input ?? "";

            const checkInput =
               _.isEmpty(search.input) ||
               deliver.member?.toLowerCase().includes(inputSearch) ||
               deliver.webappOrderId
                  ?.toString()
                  .toLowerCase()
                  .includes(inputSearch) ||
               deliver.Delivery_WebappCourse?.some((course) =>
                  course.WebappCourse?.name
                     ?.toLowerCase()
                     .includes(inputSearch.toLowerCase())
               );

            const checkStatusSearch =
               _.isEmpty(search.status) ||
               statusSearch.some((status) => {
                  return (
                     checkStatus[status]?.status === deliver.status &&
                     checkStatus[status]?.type === deliver.type
                  );
               });
            const checkStartDate =
               _.isEmpty(search.startDate) ||
               dayjs(search.startDate)
                  .startOf("date")
                  .isSameOrBefore(dayjs(deliver.approved));

            const checkEndDate =
               _.isEmpty(search.endDate) ||
               dayjs(search.endDate)
                  .endOf("date")
                  .isSameOrAfter(dayjs(deliver.approved));
            const checkUniversity =
               _.isEmpty(search.university) ||
               deliver.branch?.toLowerCase().includes(search?.university!);

            if (deliver.id === 2560) {
               console.table({
                  startDate: search.startDate,
                  endDate: search.endDate,
                  checkStartDate,
                  checkEndDate,
               });
            }
            if (
               checkInput &&
               checkStatusSearch &&
               checkUniversity &&
               checkStartDate &&
               checkEndDate
            ) {
               ArrData.push(deliver);
            }
         });

         setAllPage(Math.ceil(ArrData.length / rowsPerPage));
         setDeliverItem({
            data: ArrData.slice(startIndex, endIndex),
            disable: disabledKeys,
            allData: deliverMap,
         });
      } else {
         if (!_.isEmpty(deliverItem.allData)) {
            setDeliverItem((prev: dataItem) => {
               return {
                  ...prev,
                  data: data.data.slice(startIndex, endIndex),
               };
            });
            setAllPage(Math.ceil(data.data.length / rowsPerPage));
         } else {
            // const currentData = data.data?.slice(startIndex, endIndex);
            data.data?.forEach((deliver) => {
               const checkType = deliver?.type;
               if (checkType === "pickup" || deliver?.status === "success") {
                  disabledKeys[deliver.id.toString()] = deliver;
               }
               deliverMap[deliver.id.toString()] = deliver;
            });
            if (data.data) {
               setAllPage(Math.ceil(data.data.length / rowsPerPage));
            }
            // const keys = Object.keys(deliverMap).slice(startIndex, endIndex);
            // const slicedObject = _.pick(deliverMap, keys);
            setDeliverItem({
               data: data.data.slice(startIndex, endIndex),
               disable: disabledKeys,
               allData: deliverMap,
            });
         }
      }
   }, [page, data, search]);

   useMemo(() => {
      setPage(1);
   }, [allPage]);
   return (
      <>
         <div className="py-2 flex flex-col flex-1  overflow-y-hidden">
            <Table
               color={"secondary"}
               disabledKeys={
                  selectState.open ? Object.keys(deliverItem.disable) : ""
               }
               // layout="fixed"
               isStriped
               isHeaderSticky
               // color={"primary"}
               selectionMode={selectState.open ? "multiple" : "none"}
               classNames={{
                  ...tableClassnames,
                  base: "flex-1 min-h-[600px] mb-4  overflow-y-auto",
                  // tbody : "overflow-scroll scrollbar-hide",
                  table: " flex-1 ",
                  th: "font-serif",
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
                  <TableColumn>ผู้เรียน</TableColumn>
                  <TableColumn>คอร์สเรียน</TableColumn>
                  <TableColumn className={""}>จัดส่ง</TableColumn>
                  <TableColumn>อนุมัติ</TableColumn>
                  <TableColumn>สถานะ</TableColumn>
               </TableHeader>

               <TableBody
                  emptyContent={"No rows to display."}
                  // items={_.orderBy(
                  //    Object.values(deliverItem.data),
                  //    ["id"],
                  //    ["desc"]
                  // )}
                  items={deliverItem.data}
                  // isLoading={query.isFetching}
                  loadingContent={<div>loading...</div>}
                  className=""
               >
                  {(deliver) => {
                     // const courses = deliver?.courses;
                     const status = deliver?.status ?? "waiting";
                     // console.log(courses);
                     return (
                        <TableRow key={deliver?.id}>
                           <TableCell>
                              <p className="font-serif">
                                 {deliver?.webappOrderId}
                              </p>
                              {/* ({deliver.id}) */}
                           </TableCell>
                           <TableCell>
                              <p className="font-serif whitespace-nowrap">
                                 {deliver.member}
                              </p>
                           </TableCell>
                           <TableCell>
                              <div className="list-disc list-outside">
                                 {deliver.Delivery_WebappCourse.map(
                                    (Delivery_WebappCourse) => {
                                       const course =
                                          Delivery_WebappCourse.WebappCourse;
                                       // console.log("course", course);
                                       return (
                                          <li
                                             className="font-serif text-base font-medium "
                                             key={course?.id}
                                          >
                                             {course?.name} ({deliver.branch}
                                             <p className="ml-5 whitespace-nowrap text-sm font-normal">
                                                {course?.term}
                                             </p>
                                          </li>
                                       );
                                    }
                                 )}
                              </div>
                           </TableCell>
                           <TableCell>
                              <button
                                 className="text-left"
                                 onClick={() => {
                                    if (
                                       status === "success" ||
                                       deliver.type === "pickup"
                                    )
                                       return;
                                    onEditAddress(deliver);
                                 }}
                              >
                                 <p className="w-[300px]">
                                    {deliver.updatedAddress}
                                 </p>
                              </button>
                           </TableCell>
                           <TableCell>
                              {dayjs(deliver.approved).format("MMM-DD HH:mm")}
                           </TableCell>
                           <TableCell className=" ">
                              {status === "success" ? (
                                 <TrackingDetail
                                    onOpenEditTracking={onOpenEditTracking}
                                    checkType={
                                       deliver.type as deliveryTypeProps
                                    }
                                    tracking={deliver}
                                 />
                              ) : (
                                 <AddTrackDetail
                                    deliveryType={
                                       deliver.type as deliveryTypeProps
                                    }
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
         </div>
         <div className="py-2 flex justify-center">
            <Pagination
               total={allPage}
               page={page}
               className="p-0 m-0"
               classNames={{
                  cursor: "bg-default-foreground",
               }}
               onChange={(page) => setPage(page)}
            />
         </div>{" "}
      </>
   );
};

export default TableDeliver;

const TrackingDetail = ({
   tracking,
   checkType,
   onOpenEditTracking,
}: {
   onOpenEditTracking: (d: DeliverRes["data"][0]) => void;
   checkType: deliveryTypeProps;
   tracking?: DeliverRes["data"][0];
}) => {
   return (
      <>
         {checkType === "ship" && (
            <div className="leading-3">
               <p className="text-secondary-fade text-xs">
                  ส่งวันที่ {dayjs(tracking?.createdAt).format("DD MMM YYYY")}
               </p>

               <div className="flex gap-2 items-center text-secondary font-semibold">
                  <p>{tracking?.trackingCode}</p>

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
                        onOpenEditTracking(tracking!);
                     }}
                     isIconOnly
                     className="bg-default-100"
                  >
                     <LuBookCopy className="" size={24} />
                  </Button>
               </div>
               <p className="px-1 py-[2px] bg-warning-50 w-fit text-warning ">
                  {tracking?.note}
               </p>
            </div>
         )}
         {checkType === "pickup" && (
            <>
               <p className="text-secondary-fade text-xs">
                  {dayjs(tracking?.createdAt).format("HH:mm น.")} โดย{" "}
                  {tracking?.webappAdminUsername}
               </p>
               <p className="text-secondary font-semibold ">
                  รับวันที่ {dayjs(tracking?.createdAt).format("DD MMM YYYY")}
               </p>
               <Button
                  onClick={() => {
                     onOpenEditTracking(tracking!);
                  }}
                  isIconOnly
                  className="bg-default-100"
               >
                  <LuBookCopy className="" size={24} />
               </Button>
               <p className="px-1 py-[2px] bg-warning-50 w-fit text-warning ">
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
            <>
               <Button
                  color="default"
                  variant="flat"
                  className="flex-shrink-0  text-base font-medium"
                  size="sm"
                  startContent={<LuPackage size={20} />}
                  onClick={() => onAddTrackings(deliver, deliveryType)}
               >
                  เพิ่ม Track no.
               </Button>
               <Button
                  color="default"
                  variant="flat"
                  className="flex-shrink-0  text-base font-medium"
                  size="sm"
                  startContent={<LuPrinter size={20} />}
                  onClick={() => onPrint([deliver])}
               >
                  พิมพ์ใบปะหน้า
               </Button>
            </>
         )}
         {deliveryType === "pickup" && (
            <>
               <Button
                  color="default"
                  variant="flat"
                  className="flex-shrink-0  text-base font-medium"
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

const checkStatus = {
   received: {
      status: "success",
      type: "pickup",
   },
   pickup: {
      status: "waiting",
      type: "pickup",
   },
   shipped: {
      status: "success",
      type: "ship",
   },
   ship: {
      status: "waiting",
      type: "ship",
   },
};
