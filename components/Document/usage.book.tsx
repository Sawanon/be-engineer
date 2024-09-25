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
   Image,
} from "@nextui-org/react";
import { Danger } from "iconsax-react";
import {
   LuArrowRightLeft,
   LuArrowUpRight,
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
import BulletPoint from "@/ui/bullet_point";

const BookUsage = () => {
   return (
      <Modal
         //  size={"full"}
         // className=" bg-white"
         isOpen={true}
         classNames={{
            base: "top-0 p-0 m-0 absolute md:relative w-screen   md:w-[428px] bg-white sm:m-0  max-w-full ",
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
                     <div className="flex gap-1  my-3  ">
                        <div className="flex  gap-2 w-4/5">
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
                              <div className="flex-1 whitespace-nowrap "></div>
                           </div>
                        </div>

                        <Button
                           variant="flat"
                           isIconOnly
                           className="bg-transparent text-black absolute right-1 top-1"
                        >
                           <LuX size={24} />
                        </Button>
                     </div>

                     <div className="col-span-2 flex flex-col gap-2">
                        <p className="text-[#71717A] font-bold text-lg">
                           รายการคอร์สที่ใช้งาน
                        </p>
                        <div className="ml-4   ">
                           <div className="flex items-center">
                              <BulletPoint />
                              <p> Dynamics midterm 2/2565</p>
                              <LuArrowUpRight className="self-start" />
                           </div>
                           <div className="flex items-center">
                              <BulletPoint />
                              <p> Dynamics (CU) midterm</p>
                              <LuArrowUpRight className="self-start" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

export default BookUsage;
