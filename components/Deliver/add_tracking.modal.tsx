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
} from "@nextui-org/react";
import { Danger } from "iconsax-react";
import {
   LuArrowRightLeft,
   LuExternalLink,
   LuPackageCheck,
   LuScrollText,
   LuSearch,
   LuX,
} from "react-icons/lu";
import { useState } from "react";
import CustomInput from "../CustomInput";
import {
   Controller,
   useForm,
   UseFormProps,
   UseFormReturn,
} from "react-hook-form";
import {
   addTrackingProps,
   deliverProps,
   deliveryTypeProps,
   modalProps,
} from "@/@type";
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

const AddTracking = ({
   onClose,
   refetch,
   dialogState,
   onChangeTypeSuccess,
}: {
   onChangeTypeSuccess: (type: deliveryTypeProps) => void;
   dialogState: modalProps<deliverProps> & { type?: deliveryTypeProps };
   refetch: () => void;
   onClose: () => void;
}) => {
   const { open, data, type } = dialogState;
   const [isError, setIsError] = useState(false);
   const onError = (e: Error) => {
      console.error(e);
      setIsError(true);
   };
   const [changeType, setChangeType] = useState<
      modalProps<{ detail: deliverProps; type: deliveryTypeProps }>
   >({
      open: false,
      data: undefined,
   });
   const mutationChangeType = useChangeType({
      onSuccess: () => {
         // onClose();
         onCloseChangeType();
         onChangeTypeSuccess(changeType.data?.type!);
      },
      // onError
   });

   const onChangeType = (data: {
      detail: deliverProps;
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
         refetch();
         onClose();
      },
   });
   const updatePickup = useUpdatePickup({
      onError: onError,
      onSuccess: () => {
         alert("Update Pickup Success");
         refetch();
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

export const MuitiTracking = ({ onClose }: { onClose: () => void }) => {
   return (
      <div className="flex flex-col">
         <div className=" flex flex-col md:rounded-none   bg-white flex-1 px-4 space-y-2">
            <div className="flex gap-1 justify-center my-3  ">
               <p className="text-3xl font-semibold">เพิ่มเลข Tracking</p>
               <Button
                  variant="flat"
                  isIconOnly
                  className="bg-transparent text-black absolute right-1 top-1"
                  onClick={onClose}
               >
                  <LuX size={24} />
               </Button>
            </div>
            {/* {isError && <Alert />} */}

            <Select
               // onChange={(e) => {
               //    console.log(e.target.value);
               //    // form.setValue("delivery", e);
               //    // setValue(e)
               // }}
               // {...register("delivery", { required: true })}
               // onSelectionChange={setValue}
               // isInvalid={true}
               // color={errors.delivery && "danger"}
               placeholder="ขนส่ง"
               // startContent={
               //    form.watch("delivery") &&
               //    deliveryType[form.watch("delivery")].logo
               // }
               // defaultSelectedKeys={["flash"]}
            >
               <SelectItem
                  classNames={{
                     base: cn("flex gap-1"),
                  }}
                  startContent={deliveryType["flash"].logo}
                  key={"flash"}
               >
                  Flash
               </SelectItem>
               <SelectItem
                  classNames={{
                     base: cn("flex gap-1"),
                  }}
                  startContent={deliveryType["kerry"].logo}
                  key={"kerry"}
               >
                  Kerry
               </SelectItem>
               <SelectItem
                  classNames={{
                     base: cn("flex gap-1"),
                  }}
                  startContent={deliveryType["j&t"].logo}
                  key={"j&t"}
               >
                  J&T
               </SelectItem>
               <SelectItem
                  classNames={{
                     base: cn("flex gap-1"),
                  }}
                  startContent={deliveryType["thaipost"].logo}
                  key={"thaipost"}
               >
                  ไปรษณีย์ไทย
               </SelectItem>
            </Select>
            <CustomInput
               startContent={<LuSearch />}
               placeholder="ชื่อผู้เรียน"
            />

            <div className="grid grid-cols-2 gap-1 py-2 ">
               <Popover
                  // offset={1}
                  crossOffset={248}
                  classNames={{
                     base: cn("w-1/2 "),
                  }}
                  placement="bottom"
                  showArrow
               >
                  <PopoverTrigger>
                     <div className="flex gap-1 items-center">
                        <p className="text-sm">1.</p>
                        <p>ธีร์ธนรัชต์ นิ่มทวัฒน์</p>
                     </div>
                  </PopoverTrigger>
                  <PopoverContent>
                     <p>
                        582/47 ซอยรัชดา 3 (แยก10) ถนนอโศก-ดินแดง แขวงดินแดง
                        เขตดินแดง กทม.10400 เบอร์โทร 0956628171
                     </p>
                  </PopoverContent>
               </Popover>

               <div>
                  <Button fullWidth color="secondary">
                     TH38015VCMPJ6A0
                  </Button>
               </div>
            </div>
         </div>
         <div className="py-2 px-3 grid grid-cols-3 gap-2">
            <Button fullWidth color="primary" className="col-span-3">
               บันทึก
            </Button>
         </div>
      </div>
   );
};
