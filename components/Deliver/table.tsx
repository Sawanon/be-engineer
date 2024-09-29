import { modalProps, stateProps } from "@/@type";
import {
   Button,
   Chip,
   Table,
   TableBody,
   TableCell,
   TableColumn,
   TableHeader,
   TableRow,
} from "@nextui-org/react";
import { HiOutlineTruck } from "react-icons/hi";
import { LuFileSignature, LuPackage, LuPrinter } from "react-icons/lu";

const TableDeliver = ({ state, onPrint, onAddTrackings }: { state: stateProps<modalProps>, onPrint: () => void, onAddTrackings: () => void }) => {
   const [selectState, setSelectState] = state;
   const tableClassnames = {
      wrapper: ["p-0", "shadow-none", "border-1", "rounded-xl"],
      th: [
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
   };
   return (
      <Table
         color={"primary"}
         selectionMode={selectState.open ? "multiple" : "none"}
         classNames={tableClassnames}
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
         <TableBody>
            <TableRow key="1">
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
                  <p className="w-[300px]">
                     582/47 ซอยรัชดา 3 (แยก 10) ถนนอโศก-ดินแดง แขวงดินแดง
                     เขตดินแดง กทม. 10400 เบอร์โทร 0956628171
                  </p>
               </TableCell>
               <TableCell>
                  <p>AUG-28 10:35</p>
               </TableCell>
               <TableCell className="space-y-2 md:space-x-2 flex items-center">
                  <Button
                     color="secondary"
                     startContent={<LuPackage size={20} />}
                     onClick={onAddTrackings}
                  >
                     เพิ่ม Track no.
                  </Button>
                  <Button
                     color="secondary"
                     startContent={<LuPrinter size={20} />}
                     onClick={onPrint}
                  >
                     พิมพ์ใบปะหน้า
                  </Button>
               </TableCell>
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
                  <p className="w-[300px]">
                     582/47 ซอยรัชดา 3 (แยก 10) ถนนอโศก-ดินแดง แขวงดินแดง
                     เขตดินแดง กทม. 10400 เบอร์โทร 0956628171
                  </p>
               </TableCell>
               <TableCell>
                  <p>AUG-28 10:35</p>
               </TableCell>
               <TableCell className="">
                  <p className="text-[#9098A2] text-xs">
                     ส่งวันที่ 10 ก.ค. 2567
                  </p>
                  <div className="flex gap-2 items-center font-semibold">
                     <p>TH38015VCMPJ6A0</p>

                     <Button isIconOnly className="bg-[#F4F4F5]">
                        <HiOutlineTruck size={24} />
                     </Button>
                  </div>
                  <p className="px-1 py-[2px] bg-[#FEFCE8] w-fit text-[#F5A524] ">
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
                  <p className="w-[300px]">
                     582/47 ซอยรัชดา 3 (แยก 10) ถนนอโศก-ดินแดง แขวงดินแดง
                     เขตดินแดง กทม. 10400 เบอร์โทร 0956628171
                  </p>
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
            </TableRow>
         </TableBody>
      </Table>
   );
};

export default TableDeliver;
