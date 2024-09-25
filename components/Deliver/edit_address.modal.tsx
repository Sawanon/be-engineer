import { cn } from "@/lib/util";
import Alert from "@/ui/alert";
import {
   Button,
   Modal,
   ModalBody,
   ModalContent,
   Textarea,
} from "@nextui-org/react";
import { Danger } from "iconsax-react";
import { LuX } from "react-icons/lu";

const EditAddress = () => {
   return (
      <Modal
         //  size={"full"}
         className=" bg-transparent"
         isOpen={!true}
         classNames={{
            base: "top-0 absolute md:relative w-screen m-0 md:w-[428px]",
         }}
         backdrop="blur"
         onClose={() => {}}
         scrollBehavior={"inside"}
         closeButton={<></>}
      >
         <ModalContent>
            <ModalBody className={cn("p-0")}>
               <div className="flex flex-col">
                  <div className=" flex flex-col rounded-t-xl md:rounded-none   bg-white flex-1 px-4 space-y-2">
                     <div className="flex gap-1 justify-center my-3  ">
                        <p className="text-3xl font-semibold">ที่อยู่จัดส่ง</p>
                        <Button
                           variant="flat"
                           isIconOnly
                           className="bg-transparent text-black absolute right-1 top-1"
                        >
                           <LuX size={24} />
                        </Button>
                     </div>
                     <Alert />

                     <p className="px-4 font-semibold text-[#52525B]">
                        ธีร์ธนรัชต์ นื่มทวัฒน์ โทร : 0982855926
                     </p>

                     <div id="textarea-wrapper">
                        <Textarea
                           //    rows={4}
                           //    minRows={4}
                           defaultValue="582/47 ซอยรัชดา 3 (แยก 10) ถนนอโศก-ดินแดง แขวงดินแดง
                     เขตดินแดง กทม. 10400 เบอร์โทร 0956628171
                     "
                        />
                     </div>
                     <div className="py-3">
                        <Button fullWidth color="primary">
                           บันทึก
                        </Button>{" "}
                     </div>
                  </div>
               </div>
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

export default EditAddress;
