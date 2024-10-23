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
import { deliveryTypeProps, modalProps } from "@/@type";
import { useChangeType } from "@/lib/query/delivery";
import { data } from "framer-motion/client";
import { deliveryPrismaProps } from "@/lib/actions/deliver.actions";

const txtType = {
   pickup: "รับที่สถาบัน",
   ship: "จัดส่ง",
};

const ChangeReceiveType = ({
   dialog,
   onClose,
   mutation,
}: {
   mutation: ReturnType<typeof useChangeType>;
   onClose: () => void;
   dialog: modalProps<{ detail: deliveryPrismaProps; type: deliveryTypeProps }>;
}) => {
   const {
      open,
      data: { type, detail } = { type: undefined, detail: undefined },
   } = dialog;

   return (
      <Modal
         //  size={"full"}
         // className=" bg-white"
         isOpen={open}
         classNames={{
            base: "top-0 absolute md:relative w-screen md:w-[428px] bg-white m-0 ",
            body: "p-0",
            backdrop: `bg-backdrop`,
         }}
         // backdrop="blur"
         onClose={onClose}
         scrollBehavior={"inside"}
         closeButton={<></>}
      >
         <ModalContent>
            <ModalBody className={cn("px-4")}>
               <div className="flex flex-col">
                  <div className=" flex flex-col rounded-t-xl md:rounded-none   bg-white flex-1 space-y-2">
                     <div className="flex gap-1 justify-start my-4  ">
                        <p className="text-3xl font-semibold">
                           เปลี่ยนเป็น{txtType[type!]}
                        </p>
                        <Button
                           variant="flat"
                           isIconOnly
                           className="bg-transparent text-default-foreground absolute right-1 top-4"
                           onClick={onClose}
                        >
                           <LuX size={24} />
                        </Button>
                     </div>
                     {mutation.isError && (
                        <Alert label="เปลี่ยนไม่สำเร็จ ดูเพิ่มเติมใน Console" />
                     )}

                     <p>
                        คุณแน่ใจหรือไม่ที่เปลี่ยนคำสั่งซื้อ{" "}
                        <span className="font-bold">
                           {detail?.id} {detail?.member}
                        </span>{" "}
                        เป็น <span className="font-bold">{txtType[type!]}</span>
                     </p>
                     <div className="py-2 grid grid-cols-2 gap-2">
                        <Button
                           fullWidth
                           onClick={onClose}
                           className={cn(
                              "font-medium bg-default-100 font-IBM-Thai",
                              {}
                           )}
                        >
                           ยกเลิก
                        </Button>
                        <Button
                           fullWidth
                           className="font-IBM-Thai bg-default-foreground text-primary-foreground"
                           onClick={() => {
                              mutation.mutate({
                                 type: type!,
                                 id: detail?.id!,
                                 // courseId: detail?.courses.map((d) =>
                                 //    d.id.toString()
                                 // )!,
                              });
                           }}
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

export default ChangeReceiveType;
