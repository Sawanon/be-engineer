"use client";

import { deliverProps, modalProps } from "@/@type";
import FormDeliver from "./form";
import DeliverModal from "./printing.modal";
import TableDeliver from "./table";
import { useState } from "react";
import EditAddress from "./edit_address.modal";
import AddTracking, { MuitiTracking } from "./add_tracking.modal";
import ChangeReceiveType from "./change_type.modal";
import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { cn } from "@/lib/util";
import { useDeliver } from "@/lib/query/deliver";

const DeliverComp = () => {
   const [selectState, setSelectState] = useState<modalProps>({
      open: false,
      data: undefined,
   });
   // console.log(selectState);
   const [isEditAddress, setIsEditAddress] = useState(false);
   const [isPrint, setIsPrint] = useState(false);
   const [isMultiTracking, setIsMultiTracking] = useState(false);
   const [isAddTracking, setIsAddTracking] = useState<modalProps<deliverProps>>(
      { open: false, data: undefined }
   );
   const handleOnCloseEditAddress = () => {
      setIsEditAddress((prev) => !prev);
   };

   const onOpenAddTrack = (data: deliverProps) => {
      setIsAddTracking({ open: true, data });
   };
   const onCloseAddTrack = () => {
      setIsAddTracking({ open: false });
   };

   const deliverQuery = useDeliver();
   return (
      <div className="flex flex-col pt-6 px-app bg-background relative h-screenDevice bg-default-50">
         {/*  <div className="flex flex-col relative flex-1 font-IBM-Thai-Looped px-[14px] overflow-y-hidden  bg-default-50 h-screenDevice bg-green-500   "> */}
         <h1 className="hidden md:block font-IBM-Thai text-[30px] text-default-foreground font-bold leading-9 py-2 ">
            การจัดส่ง
         </h1>
         <DeliverModal
            open={isPrint}
            onEdit={handleOnCloseEditAddress}
            onClose={() => setIsPrint(false)}
         />
         <EditAddress open={isEditAddress} onClose={handleOnCloseEditAddress} />
         <AddTracking
            data={isAddTracking.data}
            open={isAddTracking.open}
            onClose={onCloseAddTrack}
         />
         <Modal
            //  size={"full"}
            // className=" bg-white"
            isOpen={isMultiTracking}
            classNames={{
               base: "top-0 absolute md:relative w-screen   md:w-[428px] bg-white m-0  max-w-full ",
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
         <div className=" flex flex-col mb-4  overflow-hidden mx-2 max-w-[960px] ">
            <FormDeliver
               state={[selectState, setSelectState]}
               onAddTrackings={() => setIsMultiTracking(true)}
               onPrint={() => setIsPrint(true)}
            />
            {/* <div className=" flex flex-col flex-1"> */}
            <TableDeliver
               query={deliverQuery}
               handleOnCloseEditAddress={handleOnCloseEditAddress}
               state={[selectState, setSelectState]}
               onPrint={() => setIsPrint(true)}
               onAddTrackings={onOpenAddTrack}
            />

            {/* </div> */}
         </div>
      </div>
   );
};

export default DeliverComp;
