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
   LuPackageCheck,
   LuScrollText,
   LuSearch,
   LuX,
} from "react-icons/lu";

import thaipost from "../../assets/thaipost.png";
import Image from "next/image";
import { useState } from "react";

const AddTracking = ({
   open,
   onClose,
}:{
   open: boolean,
   onClose: () => void,
}) => {
   const [isAddTracking, setIsAddTracking] = useState(true)
   return (
      <Modal
         //  size={"full"}
         // className=" bg-white"
         isOpen={open}
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
               {isAddTracking
                  ?
                  <SingleTrack
                     onChangeType={() => setIsAddTracking(false)}
                     onClose={onClose}
                  />
                  :
                  <ReceiveBook
                     onChangeType={() => setIsAddTracking(true)}
                     onClose={onClose}
                  />
               }
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

export default AddTracking;

const ReceiveBook = ({
   onChangeType,
   onClose
}:{
   onChangeType: () => void
   onClose: () => void
}) => {
   return (
      <div className="flex flex-col ">
         <div className=" flex flex-col rounded-xl md:rounded-none   bg-white flex-1 px-4 space-y-2">
            <div className="flex gap-1 justify-center my-3  ">
               <p className="text-3xl font-semibold">
                  ธีร์ธนรัชต์ นื่มทวัฒน์
               </p>
               <Button
                  variant="flat"
                  isIconOnly
                  className="bg-transparent text-black absolute right-1 top-1"
                  onClick={onClose}
               >
                  <LuX size={24} />
               </Button>
            </div>
            <p className="font-bold text-sm text-[#A1A1AA]">หนังสือ</p>
            <div className="flex gap-2">
               <NextUiImage
                  width={24}
                  height={34}
                  alt="NextUI hero Image"
                  src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
               />
               <path>Dynamics midterm 2/2565</path>
            </div>
            <p className="font-bold text-sm text-[#A1A1AA]">เอกสาร</p>
            <div className="flex gap-2 items-center ">
               <LuScrollText size={20} />
               <p className="flex items-center gap-2">
                  Dynamics - 5. Plane Motion of Rigid Body
                  <Button isIconOnly color="secondary">
                     <LuExternalLink size={32} />
                  </Button>
               </p>
            </div>
            <div id="textarea-wrapper">
               <Textarea
                  placeholder="หมายเหตุ(ถ้ามี)"
   
               />
            </div>
            <div className="py-2 grid grid-cols-3 gap-2">
               <Button
                  fullWidth
                  color="secondary"
                  className="flex gap-3 bg-white md:order-1 order-2  col-span-3 md:col-span-1"
                  onClick={onChangeType}
               >
                  <LuArrowRightLeft /> จัดส่ง
               </Button>
               <Button
                  fullWidth
                  color="primary"
                  className="md:col-span-2 col-span-3 order-1 bg-default-foreground text-primary-foreground"
               >
                  รับหนังสือ
               </Button>
            </div>
         </div>
      </div>
   )
}

const SingleTrack = ({
   onChangeType,
   onClose
}:{
   onChangeType: () => void
   onClose: () => void
}) => {
   return (
      <div className="flex flex-col font-IBM-Thai">
         <div className=" flex flex-col rounded-t-xl md:rounded-none   bg-white flex-1 px-4 space-y-2">
            <div className="flex gap-1 justify-center my-3  ">
               <p className="text-3xl font-semibold">ธีร์ธนรัชต์ นื่มทวัฒน์</p>
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
                  onClick={onChangeType}
               >
                  <LuArrowRightLeft /> รับที่สถาบัน
               </Button>
               <Button
                  fullWidth
                  color="primary"
                  className="col-span-2 md:col-span-3 md:order-1 bg-default-foreground text-primary-foreground"
               >
                  บันทึก
               </Button>
            </div>
         </div>
      </div>
   );
};

export const MuitiTracking = ({
   onClose
}:{
   onClose: () => void
}) => {
   return (
      <div className="flex flex-col">
         <div className=" flex flex-col rounded-t-xl md:rounded-none   bg-white flex-1 px-4 space-y-2">
            <div className="flex gap-1 justify-center my-3  ">
               <p className="text-3xl font-semibold">เพิ่มเลข Tracking</p>
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
