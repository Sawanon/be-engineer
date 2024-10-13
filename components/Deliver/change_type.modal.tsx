import { cn } from "@/lib/util";
import Alert from "@/ui/alert";
import {
   Button,
   Input,
   Modal,
   ModalBody,
   ModalContent,
   Select,
   SelectItem,
   Textarea,
} from "@nextui-org/react";
import { Danger } from "iconsax-react";
import { LuArrowRightLeft, LuPackageCheck, LuX } from "react-icons/lu";

import thaipost from "../../assets/thaipost.png";
import Image from "next/image";

const txtType = {
   receive: "รับที่สถาบัน",
   delivery: "จัดส่ง",
};
type TxtTypeKey = keyof typeof txtType;
const ChangeReceiveType = ({ type = "receive" }: { type?: TxtTypeKey }) => {
   return (
      <Modal
         //  size={"full"}
         // className=" bg-white"
         isOpen={!true}
         classNames={{
            base: "top-0 absolute md:relative w-screen md:w-[428px] bg-white m-0 ",
            body: "p-0",
            backdrop: `bg-backdrop`,

         }}
         // backdrop="blur"
         onClose={() => {}}
         scrollBehavior={"inside"}
         closeButton={<></>}
      >
         <ModalContent>
            <ModalBody className={cn("px-4")}>
               <div className="flex flex-col">
                  <div className=" flex flex-col rounded-t-xl md:rounded-none   bg-white flex-1 space-y-2">
                     <div className="flex gap-1 justify-start my-4  ">
                        <p className="text-3xl font-semibold">
                           เปลี่ยนเป็นรับที่สถาบัน
                        </p>
                        <Button
                           variant="flat"
                           isIconOnly
                           className="bg-transparent text-black absolute right-1 top-4"
                        >
                           <LuX size={24} />
                        </Button>
                     </div>
                     <Alert label="เปลี่ยนไม่สำเร็จ ดูเพิ่มเติมใน Console" />

                     <p>
                        คุณแน่ใจหรือไม่ที่เปลี่ยนคำสั่งซื้อ{" "}
                        <span className="font-bold">
                           24323 ธีร์ธนรัชต์ นื่มทวัฒน์
                        </span>{" "}
                        เป็น <span className="font-bold">{txtType[type]}</span>
                     </p>
                     <div className="py-2 grid grid-cols-2 gap-2">
                        <Button fullWidth color="secondary" className="">
                           ยกเลิก
                        </Button>
                        <Button fullWidth color="primary" className="">
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

export default ChangeReceiveType;
