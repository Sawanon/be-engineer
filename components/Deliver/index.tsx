"use client";

import { deliveryTypeProps, modalProps } from "@/@type";
import FormDeliver, { DeliverFilter } from "./form";
import PrintModal from "./printing.modal";
import TableDeliver from "./table";
import { useEffect, useMemo, useState } from "react";
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
   testAddBook,
   updateAddress,
} from "@/lib/actions/deliver.actions";
import { revalidatePath } from "next/cache";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import _ from "lodash";
import { Button } from "@nextui-org/react";
import { Refresh } from "iconsax-react";
import { LuX } from "react-icons/lu";
import EditTracking from "./edit_tracking.modal";
import { X } from "lucide-react";

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
   const searchParams = useSearchParams();

   const router = useRouter();
   const pathname = usePathname();
   const [newData, setNewData] = useState(isNewData);
   useEffect(() => {
      setNewData(isNewData);
   }, [isNewData]);
   const [searchData, setSearchData] = useState<DeliverFilter>({
      status: "pickup,ship",
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
      modalProps<DeliverRes["data"][0]> & { type?: deliveryTypeProps }
   >({ open: false, data: undefined, type: undefined });

   const [isEditTracking, setIsEditTracking] = useState<
      modalProps<DeliverRes["data"][0]>
   >({ open: false, data: undefined });

   const handleOpenMultiTracking = () => {
      setMultiTrackingState((prev) => ({ ...prev, open: true }));
   };

   const handleOpenPrintTracking = (data: DeliverRes["data"]) => {
      setPrintModalState((prev) => ({ open: true, data: data }));
   };
   const onOpenEditTracking = (data: DeliverRes["data"][0]) => {
      setIsEditTracking((prev) => ({ open: true, data: data }));
   };
   const onCloseEditTracking = () => {
      setIsEditTracking((prev) => ({ open: false }));
   };

   const onEditAddress = (
      data: DeliverRes["data"][0] | undefined,
      refetch?: () => void
   ) => {
      if (data) {
         const newPath = `${pathname}?editAddress=${data.id}`;
         window.history.replaceState(null, "", newPath);
         setIsEditAddress({ open: true, data: data, refetch: refetch });
      } else {
         replacePath();
         setIsEditAddress({ open: false });
      }
   };

   const replacePath = () => {
      const newPath = `/deliver`;
      window.history.replaceState(null, "", newPath);
   };

   useMemo(() => {
      const id = searchParams.get("editAddress");
      if (id && !isEditAddress.open) {
         const findDataByID = delivery.data.find((d) => d.id === parseInt(id));
         setIsEditAddress({ open: true, data: findDataByID });
      }
   }, [searchParams.get("editAddress")]);

   useMemo(() => {
      const id = searchParams.get("addTracking");
      if (id) {
         const findDataByID = delivery.data.find((d) => d.id === parseInt(id));
         setIsAddTracking({
            open: true,
            data: findDataByID,
            type: findDataByID?.type as deliveryTypeProps,
         });
      }
   }, [searchParams.get("addTracking")]);

   const onOpenAddTrack = (
      data: DeliverRes["data"][0],
      type: deliveryTypeProps
   ) => {
      const newPath = `${pathname}?addTracking=${data.id}`;
      window.history.replaceState(null, "", newPath);
      setIsAddTracking({ open: true, data, type });
   };
   const onChangeTypeSuccess = (type: deliveryTypeProps) => {
      // alert("Change Type Success");
      if (type === "ship") {
         onCloseAddTrack();
         onEditAddress(isAddTracking.data!);
      } else {
         onOpenAddTrack(isAddTracking.data!, type);
         // setIsAddTracking((prev) => {
         //    return { open: true, data: prev.data, type: type };
         // });
      }
   };

   const onCloseAddTrack = () => {
      replacePath();
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
         if (findUpdateData > -1) {
            cloneData[findUpdateData]["updatedAddress"] = data?.updatedAddress!;
         }
         return { ...prev, data: cloneData };
      });
   };
   return (
      <div className="flex flex-col pt-0 md:pt-6 px-app  bg-background relative overflow-y-hidden md:h-screenDevice h-[calc(100dvh-64px)] bg-default-50 ">
         {/* <button
            onClick={async () => {
               await testAddBook();
            }}
         >
            test
         </button> */}

         {newData && (
            <div className={`flex justify-center md:justify-end absolute right-4 bottom-4 z-50 w-full`}>
               <NotifyModal
                  onRefresh={() => {
                     // refetchData();
                     router.refresh();
                  }}
                  onClose={() => setNewData(false)}
               />
            </div>
         )}
         {/*  <div className="flex flex-col relative flex-1 font-IBM-Thai-Looped px-[14px] overflow-y-hidden  bg-default-50 h-screenDevice bg-green-500   "> */}
         <h1 className="hidden md:block font-sans text-[30px] text-default-foreground font-bold leading-9 py-2 ">
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
         <EditTracking
            dialogState={isEditTracking}
            // refetch={refetch}
            onClose={onCloseEditTracking}
         />

         <AddMultiTracking
            dialogState={multiTrackingState}
            refetch={refetch}
            onClose={onCloseSelect}
         />
{/* max-w-[960px]  */}
         <div className=" flex flex-col mb-4  overflow-hidden  ">
            <FormDeliver
               onCloseSelect={onCloseSelect}
               searchState={[searchData, setSearchData]}
               state={[selectState, setSelectState]}
               onAddTrackings={handleOpenMultiTracking}
               onPrintTrackings={handleOpenPrintTracking}
               selectData={multiTrackingState}
            />
            <TableDeliver
               onOpenEditTracking={onOpenEditTracking}
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
      <div className="backdrop-blur-md shadow-nextui-md bg-black/70 rounded-lg font-serif flex items-center gap-2 py-2 md:py-app px-4">
         <p className="text-default-100">มีคำสั่งซื้อใหม่เข้ามา</p>
         <Button
            onClick={onRefresh}
            endContent={<Refresh strokeWidth={1.5} size={20} className="text-default-foreground" />}
            className="bg-default-100 text-default-foreground text-base font-medium"
         >
            Refresh
         </Button>
         <Button
            onClick={onClose}
            isIconOnly
            className="bg-transparent text-default-foreground min-w-0 w-6 h-6 p-1"
         >
            <X size={16} className="text-default-100 " />
         </Button>
      </div>
   );
};

export default DeliverComp;
