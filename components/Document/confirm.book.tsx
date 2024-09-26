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
import {
   LuArrowRightLeft,
   LuPackageCheck,
   LuTrash2,
   LuX,
} from "react-icons/lu";

import thaipost from "../../assets/thaipost.png";
import Image from "next/image";

const ConfirmBook = ({
   open,
   onClose,
}:{
   open: boolean,
   onClose: () => void,
}) => {
   return (
      <Modal
         //  size={"full"}
         // className=" bg-white"
         isOpen={open}
         classNames={{
            base: "bottom-0 absolute md:relative w-screen md:w-[428px] bg-white m-0 ",
            body: "p-0",
         }}
         backdrop="blur"
         onClose={() => {}}
         scrollBehavior={"inside"}
         closeButton={<></>}
      >
         <ModalContent>
            <ModalBody className={cn("px-4")}>
               <div className="flex flex-col">
                  <div className=" flex flex-col rounded-t-xl md:rounded-none   bg-white flex-1 space-y-2">
                     <div className="flex gap-1 justify-start my-4  ">
                        <p className="text-3xl font-semibold">แน่ใจหรือไม่</p>
                        <Button
                           variant="flat"
                           isIconOnly
                           className="bg-transparent text-black absolute right-1 top-4"
                           onClick={onClose}
                        >
                           <LuX size={24} />
                        </Button>
                     </div>
                     <Alert label="ลบไม่สำเร็จ ดูเพิ่มเติมใน Console" />
                     <p>คุณแน่ใจหรือไม่ที่จะลบ</p>
                     <p className="">
                        หนังสือ Dynamics midterm 1/2567 vol.1
                     </p>{" "}
                     <div className="py-2 grid grid-cols-2 md:flex md:justify-end gap-2">
                        <Button onClick={onClose} color="secondary" className="">
                           ยกเลิก
                        </Button>
                        <Button  color="secondary" className="text-[#F31260]">
                           <LuTrash2 size={20} /> ลบ
                        </Button>
                     </div>
                  </div>
               </div>
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

export default ConfirmBook;
