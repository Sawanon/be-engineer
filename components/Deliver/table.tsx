import {
   deliverProps,
   deliveryTypeProps,
   modalProps,
   QueryProps,
   stateProps,
} from "@/@type";
import { deliveryPrismaProps } from "@/lib/actions/deliver.actions";
import { useInfinityDeliver } from "@/lib/query/delivery";
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
import { LuFileSignature, LuPackage, LuPrinter } from "react-icons/lu";

const TableDeliver = ({
   query,
   state,
   onPrint,
   onAddTrackings,
   onEditAddress,
   tableSelect,
}: {
   tableSelect: stateProps<{
      key: Set<number>;
      data?: Record<string, deliverProps>;
   }>;
   query: ReturnType<typeof useInfinityDeliver>;
   state: stateProps<modalProps>;
   onPrint: () => void;
   onAddTrackings: (data: deliverProps, type: deliveryTypeProps) => void;
   onEditAddress: (data: deliverProps | undefined) => void;
}) => {
   const [deliverItem, setDeliverItem] = useState<{
      data: Record<string, deliverProps>;
      pickup: Record<string, deliverProps>;
   }>({
      data: {},
      pickup: {},
   });
   const [selectState, setSelectState] = state;
   const [selectKeys, setSelectKeys] = tableSelect;
   const [page, setPage] = useState(1);
   const [pageSize, setPageSize] = useState(10);
   const [allPage, setAllPage] = useState(10);
   const [currentPage, setCurrentPage] = useState(1);
   if (isErrorMessageProps(query.data)) {
      return <p>Error: {query.data.message}</p>;
   }
   const [loaderRef, scrollerRef] = useInfiniteScroll({
      hasMore: query.hasNextPage,
      onLoadMore: query.fetchNextPage,
   });

   const onSelectRow = (key: Selection) => {
      const data: Record<string, deliverProps> = {};
      Array.from(key).forEach((id) => {
         const delivery = deliverItem.data[id];
         data[id] = delivery;
      });
      setSelectKeys({ key, data });
   };

   useMemo(() => {
      // const cloneData = _.cloneDeep(deliverItem);
      // const data: deliverProps[] = [];
      const deliverMap: Record<string, deliverProps> = {};
      const disabledKeys: Record<string, deliverProps> = {};
      // let maxPage = _.clone(currentPage);
      if (query.data?.pages) {
         for (let index = 0; index < query.data?.pages?.length; index++) {
            const page = query.data.pages[index];
            // const currentPage = index + 1;
            // console.table({
            //    maxPage,
            //    nextPage: page.nextPage,
            //    length: query.data?.pages?.length,
            // });
            // if (maxPage > page.nextPage - 1) {
            //    console.log("no do");
            //    maxPage = currentPage + 1;
            //    continue;
            // } else {
            //    console.log("do");
            //    maxPage = currentPage + 1;

            Object.values(page.data).forEach((deliver) => {
               // cloneData.push(deliver);
               // data.push(deliver);
               const checkType =
                  deliver.tracking?.type === "pickup" ||
                  (deliver.tracking === undefined &&
                     deliver.note.includes("รับที่สถาบัน"))
                     ? "pickup"
                     : "ship";
               if (
                  checkType === "pickup" ||
                  deliver.tracking?.status === "success"
               ) {
                  disabledKeys[deliver.id] = deliver;
               }
               deliverMap[deliver.id] = deliver;
            });
            // }
         }
      }
      // console.log("data.length", data.length);
      // setCurrentPage(maxPage);
      setDeliverItem({ data: deliverMap, pickup: disabledKeys });
   }, [query.data?.pages]);
   return (
      <>
         <div className="py-2 flex flex-col flex-1  overflow-y-hidden">
            <Table
               disabledKeys={
                  selectState.open ? Object.keys(deliverItem.pickup) : ""
               }
               // layout="fixed"
               isStriped
               isHeaderSticky
               // color={"primary"}
               selectionMode={selectState.open ? "multiple" : "none"}
               classNames={{
                  ...tableClassnames,
                  base: "flex-1  overflow-y-hidden",
                  // tbody : "overflow-scroll scrollbar-hide",
                  table: "min-h-[800px] ",
               }}
               aria-label="deliver-table"
               selectedKeys={selectKeys.key}
               onSelectionChange={onSelectRow}
               //  defaultSelectedKeys={["2", "3"]}
               //  aria-label="Example static collection table"
               baseRef={scrollerRef}
               bottomContent={
                  query.hasNextPage ? (
                     <div className="flex w-full justify-center">
                        <Spinner ref={loaderRef} color="success" />
                     </div>
                  ) : null
               }
            >
               <TableHeader>
                  <TableColumn>ลำดับ</TableColumn>
                  <TableColumn>ผู้เรียน</TableColumn>
                  <TableColumn>คอร์สเรียน</TableColumn>
                  <TableColumn className={""}>จัดส่ง</TableColumn>
                  <TableColumn>อนุมัติ</TableColumn>
                  <TableColumn>สถานะ</TableColumn>
               </TableHeader>

               <TableBody
                  emptyContent={"No rows to display."}
                  items={Object.values(deliverItem.data)}
                  isLoading={query.isFetching}
                  loadingContent={<div>loading...</div>}
                  className=""
               >
                  {(deliver) => {
                     const courses = deliver.courses;
                     const tracking = deliver.tracking;
                     const newAddress = _.isEmpty(tracking?.updatedAddress)
                        ? deliver.note
                        : tracking?.updatedAddress;
                     const checkType =
                        tracking?.type === "pickup" ||
                        (tracking === undefined &&
                           deliver.note.includes("รับที่สถาบัน"))
                           ? "pickup"
                           : "ship";

                     const status = tracking?.status ?? "waiting";
                     // console.log(courses);
                     return (
                        <TableRow key={deliver.id}>
                           <TableCell>
                              <p>{deliver.id}</p>
                           </TableCell>
                           <TableCell>
                              <p className="whitespace-nowrap">
                                 {deliver.member}
                              </p>
                           </TableCell>
                           <TableCell>
                              {courses.map((course) => {
                                 return (
                                    <div key={course.id}>
                                       <p>
                                          - {course.course} ({deliver.branch})
                                       </p>
                                       <p className="whitespace-nowrap">
                                          {/* midterm(midterm-b 1/2567) */}
                                          {course.term}
                                       </p>
                                    </div>
                                 );
                              })}
                           </TableCell>
                           <TableCell>
                              <button
                                 className="text-left"
                                 onClick={() => {
                                    if (
                                       status === "success" ||
                                       checkType === "pickup"
                                    )
                                       return;
                                    onEditAddress(deliver);
                                 }}
                              >
                                 <p className="w-[300px]">{newAddress}</p>
                              </button>
                           </TableCell>
                           <TableCell>
                              {dayjs(deliver.last_updated).format(
                                 "MMM-DD HH:mm"
                              )}
                              {checkType}
                           </TableCell>
                           <TableCell className=" ">
                              {status === "success" ? (
                                 <TrackingDetail
                                    checkType={checkType}
                                    tracking={tracking}
                                 />
                              ) : (
                                 <AddTrackDetail
                                    deliveryType={checkType}
                                    deliver={deliver}
                                    onAddTrackings={onAddTrackings}
                                    onPrint={onPrint}
                                 />
                              )}
                           </TableCell>
                        </TableRow>
                     );
                  }}
               </TableBody>
            </Table>
         </div>
         {/* <div className="py-2 flex justify-center">
            <Pagination
               total={allPage}
               initialPage={page}
               className="p-0 m-0"
               classNames={{
                  cursor: "bg-default-foreground",
               }}
               onChange={(page) => setPage(page)}
            />
         </div>{" "} */}
      </>
   );
};

export default TableDeliver;

const TrackingDetail = ({
   tracking,
   checkType,
}: {
   checkType: deliveryTypeProps;
   tracking?: deliveryPrismaProps;
}) => {
   return (
      <>
         {checkType === "ship" && (
            <>
               <p className="text-secondary-fade text-xs">
                  ส่งวันที่ {dayjs(tracking?.createdAt).format("DD MM YYYY")}
               </p>
               <div className="flex gap-2 items-center text-secondary font-semibold">
                  <p>{tracking?.trackingCode}</p>

                  <Button isIconOnly className="bg-default-100">
                     <HiOutlineTruck size={24} />
                  </Button>
               </div>
               <p className="px-1 py-[2px] bg-warning-50 w-fit text-warning ">
                  {tracking?.note !== ""
                     ? tracking?.note
                     : "หมายเหตุ​​ (ถ้ามี)"}
               </p>
            </>
         )}
         {checkType === "pickup" && (
            <>
               <p className="text-secondary-fade text-xs">
                  {dayjs(tracking?.createdAt).format("HH:mm น.")} โดย ...
               </p>
               <p className="text-secondary font-semibold ">
                  รับวันที่ {dayjs(tracking?.createdAt).format("DD MMMM YYYY")}
               </p>

               <p className="px-1 py-[2px] bg-warning-50 w-fit text-warning ">
                  {tracking?.note !== ""
                     ? tracking?.note
                     : "หมายเหตุ​​ (ถ้ามี)"}
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
   onAddTrackings: (data: deliverProps, type: deliveryTypeProps) => void;
   deliver: deliverProps;
   onPrint: () => void;
}) => {
   return (
      <div className="space-y-2">
         {deliveryType === "ship" && (
            <>
               <Button
                  className="bg-default-100"
                  startContent={<LuPackage size={20} />}
                  onClick={() => onAddTrackings(deliver, deliveryType)}
               >
                  เพิ่ม Track no.
               </Button>
               <Button
                  className="bg-default-100"
                  startContent={<LuPrinter size={20} />}
                  onClick={onPrint}
               >
                  พิมพ์ใบปะหน้า
               </Button>
            </>
         )}
         {deliveryType === "pickup" && (
            <>
               <Button
                  className="bg-default-100"
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
