import { cn } from "@/lib/util";
import {
   Modal,
   ModalContent,
   ModalHeader,
   ModalBody,
   ModalFooter,
   Button,
   Card,
   CardBody,
   Divider,
   Image,
   Pagination,
   Table,
   TableBody,
   TableCell,
   TableColumn,
   TableHeader,
   TableRow,
} from "@nextui-org/react";
import { useRef } from "react";
import {
   LuArrowLeft,
   LuClipboardList,
   LuListTree,
   LuPenSquare,
   LuPlus,
   LuPrinter,
} from "react-icons/lu";

const BookInventory = ({
   open,
   onClose,
   onEditStock,
}: {
   open: boolean;
   onClose: () => void;
   onEditStock: () => void;
}) => {
   return (
      <Modal
         size={"full"}
         className="rounded-none bg-transparent"
         closeButton={<></>}
         isOpen={open}
         backdrop="blur"
         onClose={() => {}}
         scrollBehavior={"inside"}
      >
         <ModalContent>
            <ModalBody className={cn("p-0 flex flex-col  ")}>
               <div className="flex flex-1 md:flex-row-reverse overflow-y-hidden">
                  {/* <div className="hidden md:block flex-1"></div> */}
                  <div className=" flex flex-col h-full  w-full md:w-[480px] gap-2  bg-white px-4 py-2">
                     <div className="flex gap-2 items-center  ">
                        <Button
                           className="bg-default-100  text-default-foreground"
                           isIconOnly
                           onClick={onClose}
                        >
                           <LuArrowLeft size={24} />
                        </Button>
                        <div className="flex flex-1 gap-2">
                           <Image
                              className="object-cover rounded-small"
                              width={36}
                              height={52}
                              alt="NextUI hero Image"
                              src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
                           />
                           <div className="flex flex-1 items-center">
                              <p className="text-lg font-semibold">
                                 หนังสือ Dynamics midterm vol.1 - 2/2566{" "}
                              </p>
                              <div className="flex-1 whitespace-nowrap ">
                                 <p className="text-[#393E44]  text-xs">
                                    คงเหลือ{" "}
                                 </p>
                                 <p className="text-lg font-semibold">
                                    12{" "}
                                    <span className="text-[#393E44]">ชุด</span>
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                     <Button
                        onClick={onEditStock}
                        className="bg-default-foreground text-primary-foreground"
                     >
                        <LuPlus size={24} /> เพิ่ม/ลด รายการ
                     </Button>
                     <div className="flex flex-col justify-between  flex-1 py-2  ">
                        <Table color={"primary"}>
                           <TableHeader>
                              <TableColumn>วันที่</TableColumn>
                              <TableColumn width={227} className="text-start">รายการ</TableColumn>
                              <TableColumn className="text-end">จำนวน</TableColumn>
                           </TableHeader>
                           <TableBody>
                              <TableRow key="1">
                                 <TableCell>
                                    <div className="flex gap-2 items-center">
                                       <p>1-30 เม.ย. 67</p>
                                    </div>
                                 </TableCell>
                                 <TableCell width={227} className="">
                                    <div className="flex gap-2  items-center">
                                       <p className="">คำสั่งซื้อ</p>
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                    <div className="flex gap-2  justify-end items-center">
                                       <p className="">-2</p>
                                    </div>{" "}
                                 </TableCell>
                              </TableRow>
                           </TableBody>
                        </Table>
                        <div className="flex w-full justify-center">
                           <Pagination
                              classNames={{
                                 cursor: "bg-default-foreground",
                              }}
                              showShadow
                              color="primary"
                              page={1}
                              total={10}
                              // onChange={(page) => setPage(page)}
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

export default BookInventory;
