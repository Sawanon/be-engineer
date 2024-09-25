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
} from "@nextui-org/react";
import { Danger } from "iconsax-react";
import {
   LuArrowRightLeft,
   LuExternalLink,
   LuImage,
   LuPackageCheck,
   LuScrollText,
   LuSearch,
   LuX,
} from "react-icons/lu";

import thaipost from "../../assets/thaipost.png";
import Image from "next/image";

const AddBook = () => {
   return (
      <Modal
         //  size={"full"}
         // className=" bg-white"
         isOpen={!true}
         classNames={{
            base: "top-0 absolute md:relative w-screen   md:w-[428px] bg-white sm:m-0  max-w-full ",
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
                        <p className="text-3xl font-semibold">หนังสือ</p>
                        <Button
                           variant="flat"
                           isIconOnly
                           className="bg-transparent text-black absolute right-1 top-1"
                        >
                           <LuX size={24} />
                        </Button>
                     </div>
                     <Alert />
                     <Input placeholder="ชื่อวิชา" />
                     <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-lg flex items-center justify-center h-full bg-[#F4F4F5]">
                           <LuImage className="text-[#A1A1AA] h-24 w-24" />
                        </div>
                        <div className="col-span-2 flex flex-col gap-2">
                           <Input placeholder="ชื่อวิชา" />
                           <Input placeholder="ชื่อวิชา" />{" "}
                           <Input placeholder="ชื่อวิชา" />
                        </div>
                     </div>
                     <div className="py-2 flex gap-2">
                        <Button
                           color="secondary"
                           className="text-[#F31260] "
                        >
                           ลบ
                        </Button>
                        <Button
                           fullWidth
                           color="primary"
                        >
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

export default AddBook;

const SingleTrack = () => {
   return (
      <div className="flex flex-col">
         <div className=" flex flex-col rounded-t-xl md:rounded-none   bg-white flex-1 px-4 space-y-2">
            <div className="flex gap-1 justify-center my-3  ">
               <p className="text-3xl font-semibold">ธีร์ธนรัชต์ นื่มทวัฒน์</p>
               <Button
                  variant="flat"
                  isIconOnly
                  className="bg-transparent text-black absolute right-1 top-1"
               >
                  <LuX size={24} />
               </Button>
            </div>
            <Alert />
            <Alert label="กรุณากรอกข้อมูลให้ครบ" />
            <Input
               isInvalid={true}
               color={"danger"}
               placeholder="เลข Tracking"
            />
            <Select
               isInvalid={true}
               color={"danger"}
               placeholder="ขนส่ง"
               startContent={
                  <Image src={thaipost} alt="Picture of the author" />
               }
               defaultSelectedKeys={["flash"]}
            >
               <SelectItem
                  classNames={{
                     base: cn("flex gap-1"),
                  }}
                  startContent={<LuPackageCheck />}
                  key={"flash"}
               >
                  Flash
               </SelectItem>
               <SelectItem
                  classNames={{
                     base: cn("flex gap-1"),
                  }}
                  startContent={<LuPackageCheck />}
                  key={"kerry"}
               >
                  Kerry
               </SelectItem>
               <SelectItem
                  classNames={{
                     base: cn("flex gap-1"),
                  }}
                  startContent={<LuPackageCheck />}
                  key={"j&t"}
               >
                  J&T
               </SelectItem>
               <SelectItem
                  classNames={{
                     base: cn("flex gap-1"),
                  }}
                  startContent={
                     <Image src={thaipost} alt="Picture of the author" />
                  }
                  key={"thaipost"}
               >
                  ไปรษณีย์ไทย
               </SelectItem>
            </Select>
            <div id="textarea-wrapper">
               <Textarea
                  placeholder="หมายเหตุ(ถ้ามี)"
                  //    rows={4}
                  //    minRows={4}
                  defaultValue="ได้ Calculus ไปแล้ว ขาด Physics กัับ Chemistry จะส่งให้วันพฤหัสที่ 8 ธ.ค. นะครับ
         "
               />
            </div>
            <div className="py-2 grid grid-cols-3 gap-2">
               <Button
                  fullWidth
                  color="secondary"
                  className="flex gap-3 bg-white md:order-2 md:col-span-3"
               >
                  <LuArrowRightLeft /> รับที่สถาบัน
               </Button>
               <Button
                  fullWidth
                  color="primary"
                  className="col-span-2 md:col-span-3 md:order-1"
               >
                  บันทึก
               </Button>
            </div>
         </div>
      </div>
   );
};

const muitiTracking = () => {
   return (
      <div className="flex flex-col">
         <div className=" flex flex-col rounded-t-xl md:rounded-none   bg-white flex-1 px-4 space-y-2">
            <div className="flex gap-1 justify-center my-3  ">
               <p className="text-3xl font-semibold">เพิ่มเลข Tracking</p>
               <Button
                  variant="flat"
                  isIconOnly
                  className="bg-transparent text-black absolute right-1 top-1"
               >
                  <LuX size={24} />
               </Button>
            </div>
            <Alert />

            <Select
               isInvalid={true}
               color={"danger"}
               placeholder="ขนส่ง"
               startContent={
                  <Image src={thaipost} alt="Picture of the author" />
               }
               defaultSelectedKeys={["flash"]}
            >
               <SelectItem
                  classNames={{
                     base: cn("flex gap-1"),
                  }}
                  startContent={<LuPackageCheck />}
                  key={"flash"}
               >
                  Flash
               </SelectItem>
               <SelectItem
                  classNames={{
                     base: cn("flex gap-1"),
                  }}
                  startContent={<LuPackageCheck />}
                  key={"kerry"}
               >
                  Kerry
               </SelectItem>
               <SelectItem
                  classNames={{
                     base: cn("flex gap-1"),
                  }}
                  startContent={<LuPackageCheck />}
                  key={"j&t"}
               >
                  J&T
               </SelectItem>
               <SelectItem
                  classNames={{
                     base: cn("flex gap-1"),
                  }}
                  startContent={
                     <Image src={thaipost} alt="Picture of the author" />
                  }
                  key={"thaipost"}
               >
                  ไปรษณีย์ไทย
               </SelectItem>
            </Select>
            <Input startContent={<LuSearch />} placeholder="ชื่อผู้เรียน" />

            <div className="grid grid-cols-2 gap-1 py-2 ">
               <Popover
                  // offset={1}
                  crossOffset={248}
                  classNames={{
                     base: cn("w-1/2 "),
                  }}
                  placement="bottom"
                  showArrow
               >
                  <PopoverTrigger>
                     <div className="flex gap-1 items-center">
                        <p className="text-sm">1.</p>
                        <p>ธีร์ธนรัชต์ นิ่มทวัฒน์</p>
                     </div>
                  </PopoverTrigger>
                  <PopoverContent>
                     <p>
                        582/47 ซอยรัชดา 3 (แยก10) ถนนอโศก-ดินแดง แขวงดินแดง
                        เขตดินแดง กทม.10400 เบอร์โทร 0956628171
                     </p>
                  </PopoverContent>
               </Popover>

               <div>
                  <Button fullWidth color="secondary">
                     TH38015VCMPJ6A0
                  </Button>
               </div>
            </div>
         </div>
         <div className="py-2 px-3 grid grid-cols-3 gap-2">
            <Button fullWidth color="primary" className="col-span-3">
               บันทึก
            </Button>
         </div>
      </div>
   );
};
