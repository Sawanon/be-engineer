import { cn } from "@/lib/util";
import Alert from "@/ui/alert";
import {
   Button,
   Input,
   Modal,
   ModalBody,
   ModalContent,
   Select,
   SelectItem,
   Textarea,
   Image as NextUiImage,
   Image,
   Spinner,
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
import { useMemo, useState } from "react";
import CustomInput from "../CustomInput";
import {
   Controller,
   useForm,
   UseFormProps,
   UseFormReturn,
} from "react-hook-form";
import {
   addTrackingProps,
   deliverShipServiceKey,
   deliveryTypeProps,
   modalProps,
} from "@/@type";
import { register } from "module";
import _ from "lodash";
import {
   formatRecord,
   useAddTracking,
   useChangeType,
   useDeliverByIds,
   useUpdatePickup,
   useUpdateTracking,
} from "@/lib/query/delivery";
import { deliveryType } from "@/lib/res/const";
import SingleTrack from "./singleTrack";
import { addDeliverShipService } from "@/lib/actions/delivery_ship.actions";
import ChangeReceiveType from "./change_type.modal";
import ReceiveOrder from "./receive_order";
import { deliveryPrismaProps } from "@/lib/actions/deliver.actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
type createProp = {
   trackingNumber?: string;
   delivery?: deliverShipServiceKey;
   note?: string;
};
const EditTracking = ({
   onClose,
   // refetch,
   dialogState,
}: {
   dialogState: modalProps<deliveryPrismaProps> & { type?: deliveryTypeProps };
   // refetch: () => void;
   onClose: () => void;
}) => {
   const router = useRouter();
   const { open, data } = dialogState;
   const [isError, setIsError] = useState(false);
   const onError = (e: Error) => {
      console.error(e);
      setIsError(true);
   };

   const auth = useSession();

   const form = useForm<createProp>({
      defaultValues: {
         trackingNumber: "",
         // delivery: "",
      },
   });
   const {
      setValue,
      register,
      watch,
      formState: { errors },
   } = form;

   const queryData = useDeliverByIds(data ? [data.id] : undefined);
   const checkCourse = useMemo(() => {
      if (queryData.data?.[0]) {
         const data = queryData.data[0];
         if (data.type === "pickup") {
            setValue("note", data.note!);
         } else if (data.type === "ship") {
            setValue("trackingNumber", data.trackingCode!);
            setValue("note", data.note!);
            setValue(
               "delivery",
               data.DeliverShipService?.name as deliverShipServiceKey
            );
         }

         return formatRecord(queryData.data[0]);
      }
      return undefined;
   }, [queryData.data]);
   const mutation = useUpdateTracking({
      onError: onError,
      onSuccess: () => {
         alert("Update Success");
         queryData.refetch();
         router.refresh();
         handleClose();
      },
   });

   const onSubmit = (props: createProp) => {
      mutation.mutate({
         ...props,
         id: data?.id!,
         webappAdminUsername: auth.data?.user.username!,
         webappAdminId: auth.data?.user.id,
      });
   };

   const handleClose = () => {
      onClose();
      form.setValue("delivery", undefined);
      form.setValue("note", "");
      form.setValue("trackingNumber", "");
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
         // scrollBehavior={"inside"}
         closeButton={<></>}
      >
         <ModalContent>
            <ModalBody className={cn("p-0 flex-1 font-serif rounded-[14px]")}>
               <div className="flex flex-col p-4 ">
                  <div className=" flex flex-col md:rounded-none   bg-white flex-1 px-4 space-y-2">
                     <div className="flex gap-1 justify-center my-3  ">
                        <p className="text-3xl font-semibold font-IBM-Thai">
                           {data?.member}
                        </p>
                        <Button
                           variant="flat"
                           isIconOnly
                           className="bg-transparent text-black absolute right-1 top-1 "
                           onClick={handleClose}
                        >
                           <LuX size={24} />
                        </Button>
                     </div>
                     {isError && <Alert />}
                  </div>
                  {queryData.isPending ? (
                     <div className="flex flex-1 h-full items-center justify-center">
                        <Spinner
                           className="w-[60px] h-[60px]"
                           color="default"
                        />
                     </div>
                  ) : (
                     <>
                        {checkCourse && checkCourse.bookRecord.length > 0 && (
                           <div className="gap-2">
                              <p className=" text-[14px] text-[#A1A1AA]">
                                 หนังสือ
                              </p>
                              <div className="space-y-1">
                                    {checkCourse.bookRecord.map((d) => {
                                       return d.DocumentBook?.image ? (
                                          <div
                                             className="flex gap-2 items-center"
                                             key={d.DocumentBook.id}
                                          >
                                             <Image
                                                className="rounded-sm"
                                                width={24}
                                                height={34}
                                                alt="NextUI hero Image"
                                                src={d.DocumentBook.image}
                                             />
                                             <p key={d.DocumentBook?.id}>
                                                {d.DocumentBook?.name}
                                             </p>
                                          </div>
                                       ) : (
                                          <></>
                                       );
                                    })}
                              </div>
                           </div>
                        )}
                        {checkCourse && checkCourse.sheetRecord.length > 0 && (
                           <div className="">
                              <p className=" text-[14px] text-[#A1A1AA]">
                                 เอกสาร
                              </p>
                              <div className="space-y-1">
                                 <div className="text-[14px] md:text-[12px]">
                                    {checkCourse.sheetRecord.map((d) => {
                                       return (
                                          <div
                                             className=" flex gap-2 items-center"
                                             key={d.DocumentSheet?.id}
                                          >
                                             <LuScrollText size={24} />
                                             <div className="flex items-center gap-2">
                                                <p>{d.DocumentSheet?.name} </p>
                                                <Button
                                                   variant={`flat`}
                                                   isIconOnly={true}
                                                >
                                                   <LuExternalLink size={24} />
                                                </Button>
                                             </div>
                                          </div>
                                       );
                                    })}
                                 </div>
                              </div>
                           </div>
                        )}
                        <div className="pt-3.5"></div>
                        {isError && <Alert />}

                        <div>
                           {!_.isEmpty(errors) && (
                              <Alert label="กรุณากรอกข้อมูลให้ครบ" />
                           )}

                           <form
                              onSubmit={form.handleSubmit(onSubmit)}
                              className="space-y-2"
                           >
                              {data?.type === "ship" && (
                                 <div className="space-y-2">
                                    <Controller
                                       name="trackingNumber"
                                       control={form.control}
                                       defaultValue=""
                                       // rules={{ required: true }}
                                       render={(e) => {
                                          // console.log("e", e);
                                          return (
                                             <CustomInput
                                                isInvalid={
                                                   errors.trackingNumber && true
                                                }
                                                color={
                                                   errors.trackingNumber &&
                                                   "danger"
                                                }
                                                {...e.field}
                                                placeholder="เลข Tracking"
                                                // defaultValue="TH212318237"
                                             />
                                          );
                                       }}
                                    />

                                    <Select
                                       {...register("delivery", {
                                          // required: true,
                                       })}
                                       color={errors.delivery && "danger"}
                                       placeholder="ขนส่ง"
                                       isInvalid={errors.delivery && true}
                                       startContent={
                                          form.watch("delivery") &&
                                          deliveryType[form.watch("delivery")!]
                                             .logo
                                       }
                                       // defaultSelectedKeys={["flash"]}
                                    >
                                       <SelectItem
                                          classNames={{
                                             base: cn("flex gap-1"),
                                          }}
                                          startContent={
                                             deliveryType["flash"].logo
                                          }
                                          key={"flash"}
                                       >
                                          Flash
                                       </SelectItem>
                                       <SelectItem
                                          classNames={{
                                             base: cn("flex gap-1"),
                                          }}
                                          startContent={
                                             deliveryType["kerry"].logo
                                          }
                                          key={"kerry"}
                                       >
                                          Kerry
                                       </SelectItem>
                                       <SelectItem
                                          classNames={{
                                             base: cn("flex gap-1"),
                                          }}
                                          startContent={
                                             deliveryType["j&t"].logo
                                          }
                                          key={"j&t"}
                                       >
                                          J&T
                                       </SelectItem>
                                       <SelectItem
                                          classNames={{
                                             base: cn("flex gap-1"),
                                          }}
                                          startContent={
                                             deliveryType["thaipost"].logo
                                          }
                                          key={"thaipost"}
                                       >
                                          ไปรษณีย์ไทย
                                       </SelectItem>
                                    </Select>
                                 </div>
                              )}
                              <div id="textarea-wrapper">
                                 <Textarea
                                    {...register("note")}
                                    classNames={{
                                       input: "text-[1em]",
                                    }}
                                    placeholder="หมายเหตุ(ถ้ามี)"
                                    minRows={1}
                                    // defaultValue="ได้ Calculus ไปแล้ว ขาด Physics กัับ Chemistry จะส่งให้วันพฤหัสที่ 8 ธ.ค. นะครับ"
                                 />
                              </div>
                              <div className="py-2 grid grid-cols-3 gap-2">
                                 <Button
                                    isLoading={
                                       mutation.isPending || queryData.isPending
                                    }
                                    type="submit"
                                    fullWidth
                                    color="primary"
                                    variant="solid"
                                    className="flex-shrink-0 font-sans  text-base font-medium  col-span-3 "
                                 >
                                    บันทึก
                                 </Button>
                              </div>
                           </form>
                        </div>
                     </>
                  )}
               </div>
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

export default EditTracking;
