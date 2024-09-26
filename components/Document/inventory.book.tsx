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

const BookInventory = () => {
   return (
      <Modal
         size={"full"}
         className="rounded-none bg-transparent"
         closeButton={<></>}
         isOpen={!true}
         backdrop="blur"
         onClose={() => {}}
         scrollBehavior={"inside"}
      >
         <ModalContent>
            <ModalBody className={cn("p-0")}>
               <div className="flex overflow-y-hidden">
                  <div className="hidden md:block flex-1"></div>
                  <div className=" flex flex-col h-screen w-full md:w-[480px] gap-2  bg-white px-4 py-2">
                     <div className="flex gap-1 items-center  ">
                        <Button isIconOnly>
                           <LuArrowLeft size={24} />
                        </Button>
                        <div className="flex flex-1 gap-2">
                           <Image
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
                     <Button color="primary">
                        <LuPlus size={24} /> เพิ่ม/ลด รายการ
                     </Button>
                     <div className="space-y-2  flex-1 mt-2  overflow-y-auto">
                        <Table
                           bottomContent={
                              <div className="flex w-full justify-center">
                                 <Pagination
                                    showShadow
                                    color="primary"
                                    page={1}
                                    total={10}
                                    // onChange={(page) => setPage(page)}
                                 />
                              </div>
                           }
                           color={"primary"}
                        >
                           <TableHeader>
                              <TableColumn>วันที่</TableColumn>
                              <TableColumn>รายการ</TableColumn>
                              <TableColumn>จำนวน</TableColumn>
                           </TableHeader>
                           <TableBody>
                              <TableRow key="1">
                                 <TableCell>
                                    <div className="flex gap-2 items-center">
                                       <p>1-30 เม.ย. 67</p>
                                    </div>
                                 </TableCell>
                                 <TableCell className="">
                                    <div className="flex gap-2  items-center">
                                       <p className="">คำสั่งซื้อ</p>
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                    <div className="flex gap-2  items-center">
                                       <p className="">-2</p>
                                    </div>{" "}
                                 </TableCell>
                              </TableRow>
                    
                           </TableBody>
                        </Table>
                     </div>
                  </div>
               </div>
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

export default BookInventory;
