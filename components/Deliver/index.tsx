"use client";

import { deliverProps, deliveryTypeProps, modalProps } from "@/@type";
import FormDeliver, { DeliverFilter } from "./form";
import DeliverModal from "./printing.modal";
import TableDeliver from "./table";
import { useState } from "react";
import EditAddress from "./edit_address.modal";
import AddTracking, { MuitiTracking } from "./add_tracking.modal";
import { cn } from "@/lib/util";
import { useDeliver, useInfinityDeliver } from "@/lib/query/delivery";
import AddMultiTracking from "./add_multi_tracking.modal";

export type multiTrackDialog = {
   key: Set<number>;
   data?: Record<string, deliverProps>;
   open?: boolean;
};

const DeliverComp = () => {
   const [searchData, setSearchData] = useState<DeliverFilter>();
   const [multiTrackingState, setMultiTrackingState] =
      useState<multiTrackDialog>({
         key: new Set([]),
         open: false,
      });
   const [selectState, setSelectState] = useState<modalProps>({
      open: false,
      data: undefined,
   });
   // console.log(selectState);
   const [isEditAddress, setIsEditAddress] = useState<modalProps<deliverProps>>(
      { open: false, data: undefined }
   );
   const [isPrint, setIsPrint] = useState(false);
   const [isAddTracking, setIsAddTracking] = useState<
      modalProps<deliverProps> & { type?: deliveryTypeProps }
   >({ open: false, data: undefined, type: undefined });

   const handleOpenMultiTracking = () => {
      setMultiTrackingState((prev) => ({ ...prev, open: true }));
   };

   const onEditAddress = (data: deliverProps | undefined) => {
      if (data) {
         setIsEditAddress({ open: true, data: data });
      } else {
         setIsEditAddress({ open: false });
      }
   };

   const onOpenAddTrack = (data: deliverProps, type: deliveryTypeProps) => {
      setIsAddTracking({ open: true, data, type });
   };
   const onChangeTypeSuccess = (type: deliveryTypeProps) => {
      alert("Change Type Success");
      setIsAddTracking((prev) => {
         console.log("prev", type, prev);
         return { open: true, data: prev.data, type: type };
      });
      refetch();
   };

   const onCloseAddTrack = () => {
      setIsAddTracking({ open: false });
   };

   const deliverQuery = useInfinityDeliver({});
   const refetch = () => {
      deliverQuery.refetch();
   };
   const onCloseSelect = () => {
      setSelectState({ open: false });
      setMultiTrackingState({
         key: new Set([]),
         data: undefined,
      });
   };

   return (
      <div className="flex flex-col pt-6 px-app bg-background relative h-screenDevice bg-default-50">
         {/*  <div className="flex flex-col relative flex-1 font-IBM-Thai-Looped px-[14px] overflow-y-hidden  bg-default-50 h-screenDevice bg-green-500   "> */}
         <h1 className="hidden md:block font-IBM-Thai text-[30px] text-default-foreground font-bold leading-9 py-2 ">
            การจัดส่ง
         </h1>
         <DeliverModal
            open={isPrint}
            onEditAddress={onEditAddress}
            onClose={() => setIsPrint(false)}
         />
         <EditAddress
            refetch={refetch}
            open={isEditAddress.open}
            data={isEditAddress.data}
            onEditAddress={onEditAddress}
         />
         <AddTracking
            onChangeTypeSuccess={onChangeTypeSuccess}
            dialogState={isAddTracking}
            refetch={refetch}
            onClose={onCloseAddTrack}
         />
         <AddMultiTracking
            dialogState={multiTrackingState}
            refetch={refetch}
            onClose={onCloseSelect}
         />

         {/* <ChangeReceiveType /> */}
         <div className=" flex flex-col mb-4  overflow-hidden mx-2 max-w-[960px] ">
            <FormDeliver
               onCloseSelect={onCloseSelect}
               searchState={[searchData, setSearchData]}
               state={[selectState, setSelectState]}
               onAddTrackings={handleOpenMultiTracking}
               onPrint={() => setIsPrint(true)}
            />
            {/* <div className=" flex flex-col flex-1"> */}
            <TableDeliver
               tableSelect={[multiTrackingState, setMultiTrackingState]}
               query={deliverQuery}
               onEditAddress={onEditAddress}
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
