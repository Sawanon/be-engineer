"use client";

import { deliveryTypeProps, modalProps } from "@/@type";
import FormDeliver, { DeliverFilter } from "./form";
import PrintModal from "./printing.modal";
import TableDeliver from "./table";
import { useEffect, useState } from "react";
import EditAddress from "./edit_address.modal";
import AddTracking from "./add_tracking.modal";
import { cn } from "@/lib/util";
import { useDeliver, useInfinityDeliver } from "@/lib/query/delivery";
import AddMultiTracking from "./add_multi_tracking.modal";
import {
   DeliverRes,
   deliveryPrismaProps,
   getDeliver,
   refetchData,
   updateAddress,
} from "@/lib/actions/deliver.actions";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import _ from "lodash";
import { Button } from "@nextui-org/react";
import { Refresh } from "iconsax-react";
import { LuX } from "react-icons/lu";

export type multiTrackDialog = {
   key: Set<number>;
   data?: Record<string, DeliverRes["data"][0]>;
   open?: boolean;
};
const DeliverComp = ({
   isNewData,
   delivery,
}: {
   isNewData: boolean;
   delivery: DeliverRes;
}) => {
   const router = useRouter();
   const [newData, setNewData] = useState(isNewData);
   useEffect(() => {
      setNewData(isNewData);
   }, [isNewData]);
   const [searchData, setSearchData] = useState<DeliverFilter>({
      status : "pickup,ship"
   });
   const [multiTrackingState, setMultiTrackingState] =
      useState<multiTrackDialog>({
         key: new Set([]),
         open: false,
      });

   const [printModalState, setPrintModalState] = useState<
      modalProps<DeliverRes["data"]>
   >({
      open: false,
   });

   const [selectState, setSelectState] = useState<modalProps>({
      open: false,
      data: undefined,
   });
   const [isEditAddress, setIsEditAddress] = useState<
      modalProps<DeliverRes["data"][0]> & { refetch?: () => void }
   >({ open: false, data: undefined });
   const [isAddTracking, setIsAddTracking] = useState<
      modalProps<deliveryPrismaProps> & { type?: deliveryTypeProps }
   >({ open: false, data: undefined, type: undefined });

   const handleOpenMultiTracking = () => {
      setMultiTrackingState((prev) => ({ ...prev, open: true }));
   };

   const handleOpenPrintTracking = (data: DeliverRes["data"]) => {
      setPrintModalState((prev) => ({ open: true, data: data }));
   };

   const onEditAddress = (
      data: DeliverRes["data"][0] | undefined,
      refetch?: () => void
   ) => {
      if (data) {
         setIsEditAddress({ open: true, data: data, refetch: refetch });
      } else {
         setIsEditAddress({ open: false });
      }
   };

   const onOpenAddTrack = (
      data: deliveryPrismaProps,
      type: deliveryTypeProps
   ) => {
      setIsAddTracking({ open: true, data, type });
   };
   const onChangeTypeSuccess = (type: deliveryTypeProps) => {
      alert("Change Type Success");
      setIsAddTracking((prev) => {
         return { open: true, data: prev.data, type: type };
      });
   };

   const onCloseAddTrack = () => {
      setIsAddTracking({ open: false });
   };

   // const deliverQuery = useDeliver();
   const refetch = () => {
      // deliverQuery.refetch();
   };

   const onCloseSelect = () => {
      setSelectState({ open: false });
      setMultiTrackingState({
         key: new Set([]),
         data: undefined,
      });
   };

   const handleClosePrint = () => {
      setPrintModalState({ open: false });
   };

   const updatePrintModal = (
      data: Awaited<ReturnType<typeof updateAddress>>
   ) => {
      setPrintModalState((prev: modalProps<DeliverRes["data"]>) => {
         const cloneData = _.cloneDeep(prev.data)!;
         const findUpdateData = _.findIndex(
            cloneData,
            (deliver) => deliver.id === data?.id
         );
         cloneData[findUpdateData]["updatedAddress"] = data?.updatedAddress!;
         return { ...prev, data: cloneData };
      });
   };
   console.log("isEditAddress", isEditAddress);
   return (
      <div className="flex flex-col pt-0 md:pt-6 px-app  bg-background relative overflow-y-hidden md:h-screenDevice h-[calc(100dvh-64px)] bg-default-50 ">
         {newData && (
            <NotifyModal
               onRefresh={() => {
                  // refetchData();
                  router.refresh();
               }}
               onClose={() => setNewData(false)}
            />
         )}
         {/*  <div className="flex flex-col relative flex-1 font-IBM-Thai-Looped px-[14px] overflow-y-hidden  bg-default-50 h-screenDevice bg-green-500   "> */}
         <h1 className="hidden md:block font-IBM-Thai text-[30px] text-default-foreground font-bold leading-9 py-2 ">
            การจัดส่ง
         </h1>
         <PrintModal
            dialogState={[printModalState, setPrintModalState]}
            onEditAddress={onEditAddress}
            onClose={handleClosePrint}
         />
         <EditAddress
            refetch={isEditAddress.refetch}
            dialogState={[isEditAddress, setIsEditAddress]}
            updatePrintModal={updatePrintModal}
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

         <div className=" flex flex-col mb-4  overflow-hidden  max-w-[960px] ">
            <FormDeliver
               onCloseSelect={onCloseSelect}
               searchState={[searchData, setSearchData]}
               state={[selectState, setSelectState]}
               onAddTrackings={handleOpenMultiTracking}
               onPrintTrackings={handleOpenPrintTracking}
               selectData={multiTrackingState}
            />
            <TableDeliver
               onPrintTrackings={handleOpenPrintTracking}
               searchState={[searchData, setSearchData]}
               tableSelect={[multiTrackingState, setMultiTrackingState]}
               // query={deliverQuery}
               data={delivery}
               onEditAddress={onEditAddress}
               state={[selectState, setSelectState]}
               // onPrint={handleClosePrint}
               onAddTrackings={onOpenAddTrack}
            />
         </div>
      </div>
   );
};

const NotifyModal = ({
   onClose,
   onRefresh,
}: {
   onRefresh: () => void;
   onClose: () => void;
}) => {
   return (
      <div className="rounded-lg font-IBM-Thai-Looped bg-black opacity-70 flex items-center gap-2 py-2 md:py-3 px-4 absolute right-4 bottom-4 z-50">
         <p className="text-default-100">มีคำสั่งซื้อใหม่เข้ามา</p>
         <Button
            onClick={onRefresh}
            endContent={<Refresh className="text-default-foreground" />}
            className="bg-default-100 text-default-foreground"
         >
            Refresh
         </Button>
         <Button
            onClick={onClose}
            isIconOnly
            className="bg-transparent text-default-foreground"
         >
            <LuX className="text-default-100" />
         </Button>
      </div>
   );
};

export default DeliverComp;
