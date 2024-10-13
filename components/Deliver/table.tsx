import { deliverProps, modalProps, QueryProps, stateProps } from "@/@type";
import { tableClassnames } from "@/lib/res/const";
import { isErrorMessageProps } from "@/lib/typeGuard";
import {
   Button,
   Chip,
   Pagination,
   Table,
   TableBody,
   TableCell,
   TableColumn,
   TableHeader,
   TableRow,
} from "@nextui-org/react";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { HiOutlineTruck } from "react-icons/hi";
import { LuFileSignature, LuPackage, LuPrinter } from "react-icons/lu";

const TableDeliver = ({
   query,
   state,
   onPrint,
   onAddTrackings,
   handleOnCloseEditAddress,
}: {
   query: QueryProps<deliverProps[]>;
   state: stateProps<modalProps>;
   onPrint: () => void;
   onAddTrackings: (data: deliverProps) => void;
   handleOnCloseEditAddress: () => void;
}) => {
   const [selectState, setSelectState] = state;
   const [page, setPage] = useState(1);
   const [pageSize, setPageSize] = useState(10);
   const [allPage, setAllPage] = useState(0);
   if (isErrorMessageProps(query.data)) {
      return <p>Error: {query.data.message}</p>;
   }
   // const deliveries = query.data ?? [];
   const deliverItem = useMemo(() => {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const deliveries = isErrorMessageProps(query.data)
         ? []
         : query.data ?? [];
      const currentDeliveries = deliveries?.slice(startIndex, endIndex);
      if (deliveries) {
         setAllPage(Math.ceil(deliveries.length / pageSize));
      }
      return currentDeliveries;
   }, [page, query.data, query.isLoading]);
   return (
      <>
         <div className=" flex flex-col flex-1 scrollbar-hide overflow-y-auto">
            <Table
               isStriped
               isHeaderSticky
               // color={"primary"}
               selectionMode={selectState.open ? "multiple" : "none"}
               classNames={tableClassnames}
               aria-label="deliver-table"
               //  selectedKeys={selectedKeys}
               //  onSelectionChange={setSelectedKeys}
               //  defaultSelectedKeys={["2", "3"]}
               //  aria-label="Example static collection table"
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
                  items={deliverItem}
                  isLoading={query.isLoading}
                  className=""
               >
                  {
                     (deliver) => {
                        const courses = deliver.courses;
                        console.log("course.lenght", deliver.courses.length);
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
                                             - {course.course} ({deliver.branch}
                                             )
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
                                    onClick={handleOnCloseEditAddress}
                                 >
                                    <p className="w-[300px]">{deliver.note}</p>
                                 </button>
                              </TableCell>
                              <TableCell>
                                 {dayjs(deliver.last_updated).format(
                                    "MMM-DD HH:mm"
                                 )}
                              </TableCell>
                              <TableCell className="space-y-2 md:space-x-2 flex items-center flex-col">
                                 {deliver.note.includes("รับที่สถาบัน") ? (
                                    <Button
                                       color="secondary"
                                       startContent={
                                          <LuFileSignature size={20} />
                                       }
                                    >
                                       รับที่สถาบัน
                                    </Button>
                                 ) : (
                                    <>
                                       {" "}
                                       <Button
                                          className="bg-default-100"
                                          startContent={<LuPackage size={20} />}
                                          onClick={() =>
                                             onAddTrackings(deliver)
                                          }
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
                              </TableCell>
                           </TableRow>
                        );
                     }
                     /* <TableRow key="1">
              
            </TableRow>
            <TableRow key="2" className="even:bg-[#F4F4F5]">
               <TableCell>
                  <p>24323</p>
               </TableCell>
               <TableCell>
                  <p className="whitespace-nowrap">ธีร์ธนรัชต์ นื่มทวัฒน์</p>
               </TableCell>
               <TableCell>
                  <p>- Physic 1 (CU)</p>
                  <p className="whitespace-nowrap">midterm(midterm-b 1/2567)</p>
               </TableCell>
               <TableCell>
                  <button
                     className="text-left"
                     onClick={handleOnCloseEditAddress}
                  >
                     <p className="w-[300px]">
                        582/47 ซอยรัชดา 3 (แยก 10) ถนนอโศก-ดินแดง แขวงดินแดง
                        เขตดินแดง กทม. 10400 เบอร์โทร 0956628171
                     </p>
                  </button>
               </TableCell>
               <TableCell>
                  <p>AUG-28 10:35</p>
               </TableCell>
               <TableCell className="">
                  <p className="text-secondary-fade text-xs">
                     ส่งวันที่ 10 ก.ค. 2567
                  </p>
                  <div className="flex gap-2 items-center text-secondary font-semibold">
                     <p>TH38015VCMPJ6A0</p>

                     <Button isIconOnly className="bg-default-100">
                        <HiOutlineTruck size={24} />
                     </Button>
                  </div>
                  <p className="px-1 py-[2px] bg-warning-50 w-fit text-warning ">
                     หมายเหตุ (ถ้ามี)
                  </p>
               </TableCell>
            </TableRow>
            <TableRow key="3" className="even:bg-[#F4F4F5]">
               <TableCell>
                  <p>24323</p>
               </TableCell>
               <TableCell>
                  <p className="whitespace-nowrap">ธีร์ธนรัชต์ นื่มทวัฒน์</p>
               </TableCell>
               <TableCell>
                  <p>- Physic 1 (CU)</p>
                  <p className="whitespace-nowrap">midterm(midterm-b 1/2567)</p>
               </TableCell>
               <TableCell>
                  <button
                     className="text-left"
                     onClick={handleOnCloseEditAddress}
                  >
                     <p className="w-[300px]">
                        582/47 ซอยรัชดา 3 (แยก 10) ถนนอโศก-ดินแดง แขวงดินแดง
                        เขตดินแดง กทม. 10400 เบอร์โทร 0956628171
                     </p>
                  </button>
               </TableCell>
               <TableCell>
                  <p>AUG-28 10:35</p>
               </TableCell>
               <TableCell className="">
                  <Button
                     color="secondary"
                     startContent={<LuFileSignature size={20} />}
                  >
                     รับที่สถาบัน
                  </Button>
               </TableCell>
            </TableRow> */
                  }
               </TableBody>
            </Table>
         </div>
         <div className="py-2 flex justify-center">
            <Pagination
               total={allPage}
               initialPage={page}
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
