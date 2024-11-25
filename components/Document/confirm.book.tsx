import { cn } from "@/lib/util";
import Alert from "@/ui/alert";
import {
   Button,
   Modal,
   ModalBody,
   ModalContent,
} from "@nextui-org/react";
import { useState } from "react";
import {
   LuTrash2,
   LuX,
} from "react-icons/lu";

const ConfirmBook = ({
   open,
   onClose,
   error,
   onConfirm,
   bookName,
}:{
   open: boolean,
   onClose: () => void,
   onConfirm: () => Promise<void>,
   error: {
      isError: boolean,
      message: string,
   },
   bookName: string,
}) => {
   const [isLoading, setIsLoading] = useState(false)
   const handleOnConfirm = async () => {
      setIsLoading(true)
      await onConfirm()
      setIsLoading(false)
   }
   return (
      <Modal
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
                        <p className="text-3xl font-semibold font-sans">แน่ใจหรือไม่</p>
                        <Button
                           variant="flat"
                           isIconOnly
                           className="bg-transparent text-black absolute right-1 top-4"
                           onClick={onClose}
                        >
                           <LuX size={24} />
                        </Button>
                     </div>
                     {error.isError &&
                        <Alert label={error.message} />
                        // <Alert label="ลบไม่สำเร็จ ดูเพิ่มเติมใน Console" />
                     }
                     <div>
                        <p className={`font-serif`}>คุณแน่ใจหรือไม่ที่จะลบ</p>
                        <p className="font-serif">
                           หนังสือ {bookName}
                        </p>{" "}
                     </div>
                     <div className="py-2 grid grid-cols-2 md:flex md:justify-end gap-2">
                        <Button disabled={isLoading} onClick={onClose} className={`bg-default-100 font-sans`}>
                           ยกเลิก
                        </Button>
                        <Button
                           isLoading={isLoading}
                           onClick={handleOnConfirm} color="secondary" className="text-danger-500 bg-default-100 font-sans"
                        >
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
