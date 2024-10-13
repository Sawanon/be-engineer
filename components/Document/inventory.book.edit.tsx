import { cn } from "@/lib/util";
import Alert from "@/ui/alert";
import {
   Button,
   Input,
   Modal,
   ModalBody,
   ModalContent,
   Popover,
   PopoverContent,
   PopoverTrigger,
   Select,
   SelectItem,
   Textarea,
   Image as NextUiImage,
   Tab,
   Tabs,
   Card,
   CardBody,
} from "@nextui-org/react";
import { Danger } from "iconsax-react";
import {
   LuArrowRightLeft,
   LuExternalLink,
   LuImage,
   LuMinus,
   LuPackageCheck,
   LuPlus,
   LuScrollText,
   LuSearch,
   LuX,
} from "react-icons/lu";

import thaipost from "../../assets/thaipost.png";
import Image from "next/image";
import CustomInput from "../CustomInput";

const EditInventory = ({
   open,
   onClose,
}: {
   open: boolean;
   onClose: () => void;
}) => {
   return (
      <Modal
         //  size={"full"}
         // className=" bg-white"
         isOpen={open}
         classNames={{
            base: "top-0 p-0 m-0 absolute md:relative w-screen   md:w-[428px] bg-white m-0  max-w-full ",
         }}
         backdrop="blur"
         onClose={() => {}}
         scrollBehavior={"inside"}
         closeButton={<></>}
      >
         <ModalContent>
            <ModalBody className={cn("p-0 flex-1 ")}>
               <div className="flex flex-col pb-4 ">
                  <div className=" flex flex-col rounded-xl    bg-white flex-1 px-4 space-y-2">
                     <div className="flex gap-1 justify-center my-3  ">
                        <Tabs>
                           <Tab
                              key="add"
                              title={
                                 <div className="flex items-center space-x-2">
                                    <LuPlus />
                                    <span>เพิ่ม</span>
                                 </div>
                              }
                           />
                           <Tab
                              key="delete"
                              title={
                                 <div className="flex items-center space-x-2">
                                    <LuMinus />
                                    <span>ลด</span>
                                 </div>
                              }
                           />
                        </Tabs>

                        <Button
                           variant="flat"
                           isIconOnly
                           className="bg-transparent text-black absolute right-1 top-1"
                           onClick={onClose}
                        >
                           <LuX size={24} />
                        </Button>
                     </div>
                     <Alert />

                     <div className="col-span-2 flex flex-col gap-2">
                        <CustomInput placeholder="วันที่" />
                        <CustomInput placeholder="รายการ" />{" "}
                        <CustomInput
                           type="number"
                           endContent="ชุด"
                           placeholder="จำนวน"
                        />
                     </div>
                     <div className="py-2 flex gap-2">
                        <Button fullWidth color="primary">
                           บันทึก
                        </Button>
                     </div>
                  </div>
               </div>
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

export default EditInventory;
