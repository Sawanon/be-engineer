import {
   addTrackingProps,
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
import { deliveryPrismaProps } from "@/lib/actions/deliver.actions";
import { useSession } from "next-auth/react";
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
   data?: deliveryPrismaProps;
   onChangeType: (data: {
      detail: deliveryPrismaProps;
      type: deliveryTypeProps;
   }) => void;
   onClose: () => void;
}) => {
   const auth = useSession();

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
         id: data?.id!,
         service: props.delivery,
         webappAdminId: auth.data?.user.id,
         webappAdminUsername: auth.data?.user.username!,
         // courseId  : data?.courses.map(d=> d.id.toString())!
      });
   };
   return (
      <div className="flex flex-col ">
         <div className=" flex flex-col md:rounded-none   bg-white flex-1 px-4 space-y-2">
            <div className="flex gap-1 justify-center my-3  ">
               <p className="text-3xl font-semibold font-sans">
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
                  color={errors.delivery ?"danger" : "primary"}
                  placeholder="ขนส่ง"
                  isInvalid={errors.delivery && true}
                  startContent={
                     form.watch("delivery") &&
                     deliveryType[form.watch("delivery")].logo
                  }
                  renderValue={()=> deliveryType[form.watch("delivery")].txt}
                  // value={form.watch("delivery")}
                  // defaultSelectedKeys={["flash"]}
               >
                  <SelectItem
                     classNames={{
                        base: cn("flex gap-1"),
                     }}
                     startContent={deliveryType["flash"].logo}
                     key={"flash"}
                  >
                     <p className="font-serif">Flash</p>
                  </SelectItem>
                  <SelectItem
                     classNames={{
                        base: cn("flex gap-1"),
                     }}
                     startContent={deliveryType["kerry"].logo}
                     key={"kerry"}
                  >
                     <p className="font-serif"> Kerry</p>
                  </SelectItem>
                  <SelectItem
                     classNames={{
                        base: cn("flex gap-1"),
                     }}
                     startContent={deliveryType["j&t"].logo}
                     key={"j&t"}
                  >
                     <p className="font-serif">J&T</p>
                  </SelectItem>
                  <SelectItem
                     classNames={{
                        base: cn("flex gap-1"),
                     }}
                     startContent={deliveryType["thaipost"].logo}
                     key={"thaipost"}
                  >
                     <p className="font-serif">ไปรษณีย์ไทย</p>
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
               <div className="py-2 flex flex-col-reverse md:flex-row gap-0 md:gap-2">
                  <Button
                     onClick={() =>
                        onChangeType({ detail: data!, type: "pickup" })
                     }
                     color="default"
                     variant="light"
                     className="text-base px-4 min-w-max font-medium font-sans flex gap-3"
                     startContent={
                        <LuArrowRightLeft
                           size={24}
                           className="min-w-6 min-h-6"
                        />
                     }
                  >
                     รับที่สถาบัน
                  </Button>
                  <Button
                     isLoading={addTracking.isPending}
                     type="submit"
                     fullWidth
                     color="primary"
                     variant="solid"
                     className="font-sans text-base font-medium"
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
