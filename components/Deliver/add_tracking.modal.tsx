import { cn } from "@/lib/util";
import Alert from "@/ui/alert";
import {

   Modal,
   ModalBody,
   ModalContent,

   Image as NextUiImage,
} from "@nextui-org/react";


import { useState } from "react";
import CustomInput from "../CustomInput";
import {
   Controller,
   useForm,
   UseFormProps,
   UseFormReturn,
} from "react-hook-form";
import { addTrackingProps, deliveryTypeProps, modalProps } from "@/@type";
import { register } from "module";
import _ from "lodash";
import {
   useAddTracking,
   useChangeType,
   useUpdatePickup,
} from "@/lib/query/delivery";
import { deliveryType } from "@/lib/res/const";
import SingleTrack from "./singleTrack";
import { addDeliverShipService } from "@/lib/actions/delivery_ship.actions";
import ChangeReceiveType from "./change_type.modal";
import ReceiveOrder from "./receive_order";
import { deliveryPrismaProps } from "@/lib/actions/deliver.actions";
import { useRouter } from "next/navigation";

const AddTracking = ({
   onClose,
   refetch,
   dialogState,
   onChangeTypeSuccess,
}: {
   onChangeTypeSuccess: (type: deliveryTypeProps) => void;
   dialogState: modalProps<deliveryPrismaProps> & { type?: deliveryTypeProps };
   refetch: () => void;
   onClose: () => void;
}) => {
   const router = useRouter();
   const { open, data, type } = dialogState;
   const [isError, setIsError] = useState(false);
   const onError = (e: Error) => {
      console.error(e);
      setIsError(true);
   };
   const [changeType, setChangeType] = useState<
      modalProps<{ detail: deliveryPrismaProps; type: deliveryTypeProps }>
   >({
      open: false,
      data: undefined,
   });
   const mutationChangeType = useChangeType({
      onSuccess: () => {
         // onClose();
         onCloseChangeType();
         onChangeTypeSuccess(changeType.data?.type!);
         router.refresh()
      },
      // onError
   });

   const onChangeType = (data: {
      detail: deliveryPrismaProps;
      type: deliveryTypeProps;
   }) => {
      setChangeType({
         data,
         open: true,
      });
   };
   const addSingleTrack = useAddTracking({
      onError: onError,
      onSuccess: () => {
         alert("Add track Success");
         router.refresh();
         // refetch();
         onClose();
      },
   });
   const updatePickup = useUpdatePickup({
      onError: onError,
      onSuccess: () => {
         alert("Update Pickup Success");
         router.refresh();
         // refetch();
         onClose();
      },
   });

   // console.log(addSingleTrack);
   const handleAddTrack = (data: addTrackingProps) => {
      addSingleTrack.mutate(data);
   };

   const onCloseChangeType = () => {
      setChangeType({
         open: false,
      });
   };

   return (
      <Modal
         //  size={"full"}
         // className=" bg-white"
         isOpen={open}
         classNames={{
            backdrop: `bg-backdrop`,
            base: "top-0 absolute md:relative w-screen bg-white  md:w-[428px]  m-0  max-w-full ",
         }}
         // backdrop="blur"
         onClose={() => {}}
         scrollBehavior={"inside"}
         closeButton={<></>}
      >
         <ModalContent>
            <ModalBody
               className={cn("p-0 flex-1 font-IBM-Thai-Looped rounded-[14px]")}
            >
               <ChangeReceiveType
                  mutation={mutationChangeType}
                  onClose={onCloseChangeType}
                  dialog={changeType}
               />
               {type === "ship" && (
                  <SingleTrack
                     // onChangeTypeSuccess={onChangeTypeSuccess}
                     isError={isError}
                     handleAddTrack={handleAddTrack}
                     addTracking={addSingleTrack}
                     data={data}
                     onChangeType={onChangeType}
                     onClose={onClose}
                  />
               )}
               {type === "pickup" && (
                  <ReceiveOrder
                     data={data!}
                     mutation={updatePickup}
                     onChangeType={onChangeType}
                     onClose={onClose}

                     // onChangeTypeSuccess={onChangeTypeSuccess}
                     // isError={isError}
                     // handleAddTrack={handleAddTrack}
                  />
               )}
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

export default AddTracking;
