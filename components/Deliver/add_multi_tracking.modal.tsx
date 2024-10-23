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
   addMultiTrackingProps,
   addTrackingProps,
   deliverShipServiceKey,
   deliveryTypeProps,
   modalProps,
} from "@/@type";
import { register } from "module";
import _ from "lodash";
import {
   useAddMultiTracking,
   useAddTracking,
   useChangeType,
   useUpdatePickup,
} from "@/lib/query/delivery";
import { deliveryType } from "@/lib/res/const";
import SingleTrack from "./singleTrack";
import { addDeliverShipService } from "@/lib/actions/delivery_ship.actions";
import ChangeReceiveType from "./change_type.modal";
import ReceiveOrder from "./receive_order";
import { multiTrackDialog } from ".";
import { useRouter } from "next/navigation";
type formDetail = Record<string, any> & {
   delivery: deliverShipServiceKey;
};
const AddMultiTracking = ({
   onClose,
   refetch,
   dialogState,
}: {
   dialogState: multiTrackDialog;
   refetch: () => void;
   onClose: () => void;
}) => {
   const router = useRouter();
   const { open, data } = dialogState;
   const handleClose = () => {
      form.reset();
      const valueForm = form.watch();
      Object.keys(valueForm).forEach((key) => {
         form.unregister(key);
      });
      onClose();
   };
   const [search, setSearch] = useState<string>("");
   const form = useForm<formDetail>();
   const {
      register,
      formState: { errors },
   } = form;

   const addTrack = useAddMultiTracking({
      onError: (errors) => {
         console.error("Error", errors);
      },
      onSuccess: () => {
         alert("Add multi track Success");
         router.refresh();
         // refetch();
         handleClose();
      },
   });

   const handleAddTrack = (data: addMultiTrackingProps) => {
      addTrack.mutateAsync(data);
   };

   const onSubmit = (formData: formDetail) => {
      const cloneData: Partial<formDetail> = _.cloneDeep(formData);
      const deliveryService = formData.delivery;
      delete cloneData.delivery;
      const webappOrderIds: number[] = [];
      const courseId: number[] = [];

      const formatData: Pick<addTrackingProps, "trackingCode" | "id">[] = [];
      Object.keys(cloneData).forEach((key) => {
         const trackingNumber: string = formData[key];
         const deliverData = data?.[key];
         webappOrderIds.push(deliverData?.id!);
         // const deliverCourse = deliverData?.courses.map((d) => {
         //    courseId.push(d.id);
         //    return d.id;
         // });
         if (cloneData[key] !== "") {
            formatData.push({
               trackingCode: trackingNumber,
               id: deliverData?.id!,
               // service: deliveryService,
               // courseId: deliverCourse ?? [],
            });
         }
      });
      handleAddTrack({
         deliveryData: formatData,
         service: deliveryService,
         ids: webappOrderIds,
         courseIds: courseId,
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
               <div className="flex flex-col">
                  <form
                     className="flex flex-col gap-2"
                     onSubmit={form.handleSubmit(onSubmit)}
                  >
                     <div className="  md:rounded-none   bg-white flex-1 px-4 space-y-2">
                        <div className="flex gap-1 justify-center my-3  ">
                           <p className="text-3xl font-semibold">
                              เพิ่มเลข Tracking
                           </p>
                           <Button
                              variant="flat"
                              isIconOnly
                              className="bg-transparent text-black absolute right-1 top-1"
                              onClick={handleClose}
                           >
                              <LuX size={24} />
                           </Button>
                        </div>
                        {/* {isError && <Alert />} */}

                        <Select
                           {...form.register("delivery", { required: true })}
                           isInvalid={errors.delivery && true}
                           color={errors.delivery && "danger"}
                           startContent={
                              form.watch("delivery") &&
                              deliveryType[form.watch("delivery")].logo
                           }
                           placeholder="ขนส่ง"
                           // onChange={(e) => {
                           //    console.log(e.target.value);
                           //    // form.setValue("delivery", e);
                           //    // setValue(e)
                           // }}
                           // {...register("delivery", { required: true })}
                           // onSelectionChange={setValue}
                           // isInvalid={true}
                           // color={errors.delivery && "danger"}
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
                           onChange={(e) => setSearch(e.target.value)}
                           startContent={<LuSearch />}
                           placeholder="ชื่อผู้เรียน"
                        />

                        {data &&
                           Object.values(data)
                              .filter((d) => {
                                 if (search !== "")
                                    return d.member
                                       ?.toLowerCase()
                                       .includes(search.toLowerCase());

                                 return true;
                              })
                              .map((delivery, index) => {
                                 return (
                                    <div
                                       key={delivery?.id}
                                       className="grid grid-cols-2 gap-1 py-2 "
                                    >
                                       <Popover
                                          // offset={2}
                                          crossOffset={1400}
                                          classNames={{
                                             base: cn("w-1/2 "),
                                          }}
                                          placement="bottom"
                                          showArrow
                                       >
                                          <PopoverTrigger>
                                             <div className="flex gap-1 items-center">
                                                <p className="text-sm text-default-500">
                                                   {index + 1}.
                                                </p>
                                                <p>{delivery?.member}</p>
                                             </div>
                                          </PopoverTrigger>
                                          <PopoverContent >
                                             <p>{delivery?.updatedAddress}</p>
                                          </PopoverContent>
                                       </Popover>

                                       <div>
                                          <Controller
                                             name={delivery?.id.toString()}
                                             control={form.control}
                                             defaultValue=""
                                             rules={{ required: true }}
                                             render={(e) => {
                                                // console.log("e", e);
                                                return (
                                                   <CustomInput
                                                      isInvalid={
                                                         form.formState
                                                            .errors?.[
                                                            delivery.id
                                                         ] && true
                                                      }
                                                      color={
                                                         form.formState
                                                            .errors?.[
                                                            delivery.id
                                                         ] && "danger"
                                                      }
                                                      {...e.field}
                                                      placeholder="เลข Tracking"
                                                      // defaultValue="TH212318237"
                                                   />
                                                );
                                             }}
                                          />
                                       </div>
                                    </div>
                                 );
                              })}
                     </div>
                     <div className="py-2 px-3 grid grid-cols-3 gap-2">
                        <Button
                           type="submit"
                           fullWidth
                           className="col-span-3 bg-default-foreground  text-primary-foreground"
                        >
                           บันทึก
                        </Button>
                     </div>
                  </form>
               </div>
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

export default AddMultiTracking;
