import {
   addTrackingProps,
   deliverProps,
   deliverShipServiceKey,
   deliveryTypeProps,
} from "@/@type";
import { useAddTracking } from "@/lib/query/delivery";
import { deliveryType } from "@/lib/res/const";
import Alert from "@/ui/alert";
import { Button, cn, Select, SelectItem, Textarea } from "@nextui-org/react";
import _ from "lodash";
import { useForm, Controller } from "react-hook-form";
import { LuArrowRightLeft, LuX } from "react-icons/lu";
import CustomInput from "../CustomInput";
type createProp = {
   trackingNumber: string;
   delivery: deliverShipServiceKey;
   note?: string;
};
const SingleTrack = ({
   onChangeType,
   onClose,
   data,
   addTracking,
   handleAddTrack,
   isError,
}: {
   isError: boolean;
   handleAddTrack: (data: addTrackingProps) => void;
   addTracking: ReturnType<typeof useAddTracking>;
   data?: deliverProps;
   onChangeType: (data: {
      detail: deliverProps;
      type: deliveryTypeProps;
   }) => void;
   onClose: () => void;
}) => {
   const form = useForm<createProp>({
      defaultValues: {
         trackingNumber: "",
         // delivery: "",
      },
   });
   const {
      register,
      formState: { errors },
   } = form;
   const onSubmit = (props: createProp) => {
      handleAddTrack({
         note: props.note,
         trackingCode: props.trackingNumber,
         webappOrderId: data?.id!,
         service: props.delivery,
         courseId  : data?.courses.map(d=> d.id.toString())!
      });
   };

   return (
      <div className="flex flex-col ">
         <div className=" flex flex-col md:rounded-none   bg-white flex-1 px-4 space-y-2">
            <div className="flex gap-1 justify-center my-3  ">
               <p className="text-3xl font-semibold font-IBM-Thai">
                  {data?.member}
               </p>
               <Button
                  variant="flat"
                  isIconOnly
                  className="bg-transparent text-black absolute right-1 top-1 "
                  onClick={onClose}
               >
                  <LuX size={24} />
               </Button>
            </div>
            {isError && <Alert />}
            {!_.isEmpty(errors) && <Alert label="กรุณากรอกข้อมูลให้ครบ" />}
            {/* <Input
                // color={"danger"}
                placeholder="เลข Tracking"
                {...register("trackingNumber", { required: true })}
             /> */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
               <Controller
                  name="trackingNumber"
                  control={form.control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={(e) => {
                     // console.log("e", e);
                     return (
                        <CustomInput
                           isInvalid={errors.trackingNumber && true}
                           color={errors.trackingNumber && "danger"}
                           {...e.field}
                           placeholder="เลข Tracking"
                           // defaultValue="TH212318237"
                        />
                     );
                  }}
               />

               <Select
                  {...register("delivery", { required: true })}
                  color={errors.delivery && "danger"}
                  placeholder="ขนส่ง"
                  isInvalid={errors.delivery && true}
                  startContent={
                     form.watch("delivery") &&
                     deliveryType[form.watch("delivery")].logo
                  }
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
                     fullWidth
                     className="bg-transparent flex gap-3 bg-white order-2 md:order-1 md:col-span-1 col-span-3 font-IBM-Thai"
                     onClick={() =>
                        onChangeType({ detail: data!, type: "pickup" })
                     }
                  >
                     <LuArrowRightLeft /> รับที่สถาบัน
                  </Button>
                  <Button
                     type="submit"
                     fullWidth
                     color="primary"
                     className="font-IBM-Thai md:col-span-2 col-span-3 order-1 md:order-2 bg-default-foreground text-primary-foreground"
                  >
                     บันทึก
                  </Button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default SingleTrack;
