"use client";

import { modalProps } from "@/@type";
import FormDeliver from "./form";
import DeliverModal from "./printing.modal";
import TableDeliver from "./table";
import { useState } from "react";
import EditAddress from "./edit_address.modal";
import AddTracking, { MuitiTracking } from "./add_tracking.modal";
import ChangeReceiveType from "./change_type.modal";
import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { cn } from "@/lib/util";

const DeliverComp = () => {
   const [selectState, setSelectState] = useState<modalProps>({
      open: false,
      data: undefined,
   });
   // console.log(selectState);
   const [isEditAddress, setIsEditAddress] = useState(false);
   const [isPrint, setIsPrint] = useState(false);
   const [isMultiTracking, setIsMultiTracking] = useState(false);
   const [isAddTracking, setIsAddTracking] = useState(false);
   
   const handleOnCloseEditAddress = () => {
      setIsEditAddress(prev => !prev)
   }
   return (
      <div className="flex flex-col relative flex-1 ">
         <DeliverModal
            open={isPrint}
            onEdit={handleOnCloseEditAddress}
            onClose={() => setIsPrint(false)}
         />
         <EditAddress
            open={isEditAddress}
            onClose={handleOnCloseEditAddress}
         />
         <AddTracking
            open={isAddTracking}
            onClose={() => setIsAddTracking(false)}
         />
         <Modal
            //  size={"full"}
            // className=" bg-white"
            isOpen={isMultiTracking}
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
                  <MuitiTracking onClose={() => setIsMultiTracking(false)} />
               </ModalBody>
            </ModalContent>
         </Modal>
         {/* <ChangeReceiveType /> */}
         <FormDeliver
            state={[selectState, setSelectState]}
            onAddTrackings={() => setIsMultiTracking(true)}
            onPrint={() => setIsPrint(true)}
         />
         <div className="flex-1 px-2">
            {`${isAddTracking}`}
            <TableDeliver
               state={[selectState, setSelectState]}
               onPrint={() => setIsPrint(true)}
               onAddTrackings={() => setIsAddTracking(true)}
            />
         </div>
      </div>
   );
};

export default DeliverComp;
