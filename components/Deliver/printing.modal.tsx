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
} from "@nextui-org/react";
import { useRef } from "react";
import { LuArrowLeft, LuPenSquare, LuPrinter } from "react-icons/lu";

const DeliverModal = ({
   open,
   onEdit,
   onClose,
}: {
   open: boolean;
   onEdit: () => void;
   onClose: () => void;
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
            <ModalBody className={cn("p-0")}>
               <div className="flex overflow-y-hidden">
                  <div className="hidden md:block flex-1"></div>
                  <div className=" flex flex-col   bg-gradient-to-b from-[#838388] to-[#9B9BA5] px-4 py-2">
                     <div className="flex gap-1 justify-between ">
                        <Button
                           className="bg-default-100 text-default-foreground"
                           isIconOnly
                           onClick={onClose}
                        >
                           <LuArrowLeft size={24} />
                        </Button>
                        <Button className="bg-default-foreground text-primary-foreground">
                           Print <LuPrinter size={24} />
                        </Button>
                     </div>
                     <div className="space-y-2  flex-1 mt-2  overflow-y-auto">
                        <CardDeliver onEdit={onEdit} />
                        <CardDeliver onEdit={onEdit} />
                        <CardDeliver onEdit={onEdit} />
                        <CardDeliver onEdit={onEdit} />
                        <CardDeliver onEdit={onEdit} />
                        <CardDeliver onEdit={onEdit} />
                     </div>
                  </div>
               </div>
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

export default DeliverModal;

const CardDeliver = ({ onEdit }: { onEdit: () => void }) => {
   const myRef = useRef<HTMLDivElement>(null);

   const handleMouseOver = () => {
      if (myRef.current) {
         myRef.current.className = "block";
      }
   };

   const handleMouseOut = () => {
      if (myRef.current) {
         myRef.current.className = "hidden";
      }
   };
   return (
      <Card
         className="rounded-none md:w-[440px] hover:bg-black hover:bg-opacity-15  shadow-md  "
         onMouseOver={handleMouseOver}
         onMouseOut={handleMouseOut}
      >
         <CardBody>
            <p className=" text-[10px] md:text-[10px]">24323</p>
            <p className="px-2 mt-1 leading-[17.4px] text-[14px] md:text-[16px]">
               ธีร์ธนรัชต์ นื่มทวัฒน์ <br />
               582/47 ซอยรัชดา 3 (แยก 10) ถนนอโศก-ดินแดง แขวงดินแดง เขตดินแดง
               กทม. 10400 <br />
               เบอร์โทร 0956628171
            </p>
            <Divider className="my-2 bg-[#A1A1AA]" />
            <div className="flex gap-2">
               <p className=" text-[8px] md:text-[10px] text-[#A1A1AA]">
                  หนังสือ
               </p>
               <div className="space-y-1">
                  <div className="list-disc list-outside text-[10px] md:text-[12px]">
                     <li>Dynamics midterm 2/2565</li>
                     <li>StaticsME module1 vol.1 2/2565</li>
                  </div>
                  <div className="flex gap-1 ">
                     <Image
                        width={24}
                        height={34}
                        alt="NextUI hero Image"
                        src="https://app.odm-engineer.com/media/images/course/course_1726923815_ea6cb7ae-1c1e-43a5-93e7-4bfb6d9ff7fa.jpg"
                     />
                     <Image
                        width={24}
                        height={34}
                        alt="NextUI hero Image"
                        src="https://app.odm-engineer.com/media/images/course/course_1726923815_ea6cb7ae-1c1e-43a5-93e7-4bfb6d9ff7fa.jpg"
                     />
                  </div>
               </div>
            </div>
            <div className="flex gap-2 mt-1">
               <p className=" text-[8px] md:text-[10px] text-[#A1A1AA]">
                  เอกสาร
               </p>
               <div className="space-y-1">
                  <div className="list-disc list-outside text-[10px] md:text-[12px]">
                     <li>Dynamics - 5. Plane Motion of Rigid Body</li>
                     <li>Dynamics - 6. Plane Force And Acceleration</li>
                  </div>
               </div>
            </div>
            <div className="h-7 flex justify-center mt-3">
               <div ref={myRef} className={cn("hidden", {})}>
                  {/* Your component here */}
                  <Button
                     onClick={onEdit}
                     size="sm"
                     endContent={<LuPenSquare size={20} />}
                  >
                     แก้ไขที่อยู่
                  </Button>
               </div>
            </div>
         </CardBody>
      </Card>
   );
};
