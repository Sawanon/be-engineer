import { deliveryTypeProps } from "@/@type";
import { deliveryPrismaProps } from "@/lib/actions/deliver.actions";
import { useUpdatePickup } from "@/lib/query/delivery";
import { Button, Image as NextUiImage, Textarea } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import {
   LuArrowRightLeft,
   LuExternalLink,
   LuScrollText,
   LuX,
} from "react-icons/lu";
const ReceiveOrder = ({
   onChangeType,
   onClose,
   mutation,
   data,
}: {
   data: deliveryPrismaProps;
   mutation: ReturnType<typeof useUpdatePickup>;
   onChangeType: (data: {
      detail: deliveryPrismaProps;
      type: deliveryTypeProps;
   }) => void;
   onClose: () => void;
}) => {
   const form = useForm<{ note: string }>();
   const auth = useSession();

   const onSubmit = ({ note }: { note: string }) => {
      mutation.mutate({
         id: data?.id!,
         note: note,
         webappAdminId: auth.data?.user.id,
         webappAdminUsername: auth.data?.user.username!,

         // courseId: data?.course.map((d) => d.id.toString()),
      });
   };

   return (
      <div className="flex flex-col ">
         <div className=" flex flex-col rounded-xl md:rounded-none   bg-white flex-1 px-4 space-y-2">
            <div className="flex gap-1 justify-center my-3  ">
               <p className="text-3xl font-semibold">ธีร์ธนรัชต์ นื่มทวัฒน์</p>
               <Button
                  variant="flat"
                  isIconOnly
                  className="bg-transparent text-black absolute right-1 top-1"
                  onClick={onClose}
               >
                  <LuX size={24} />
               </Button>
            </div>
            <p className="font-bold text-sm text-[#A1A1AA]">หนังสือ</p>
            <div className="flex gap-2">
               <NextUiImage
                  width={24}
                  height={34}
                  alt="NextUI hero Image"
                  src="https://app.odm-engineer.com/media/images/course/course_1726923815_ea6cb7ae-1c1e-43a5-93e7-4bfb6d9ff7fa.jpg"
               />
               <path>Dynamics midterm 2/2565</path>
            </div>
            <p className="font-bold text-sm text-[#A1A1AA] ">เอกสาร</p>
            <div className="flex gap-2 items-center ">
               <LuScrollText size={20} />
               <p className="flex items-center gap-2">
                  Dynamics - 5. Plane Motion of Rigid Body
                  <Button isIconOnly color="secondary">
                     <LuExternalLink size={32} />
                  </Button>
               </p>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
               <div id="textarea-wrapper">
                  <Textarea
                     {...form.register("note")}
                     placeholder="หมายเหตุ(ถ้ามี)"
                     minRows={1}
                  />
               </div>
               <div className="py-2 grid grid-cols-3 gap-2">
                  <Button
                     fullWidth
                     className="flex gap-3 bg-white text-default-foreground md:order-1 order-2  col-span-3 md:col-span-1"
                     onClick={() =>
                        onChangeType({ detail: data!, type: "ship" })
                     }
                  >
                     <LuArrowRightLeft /> จัดส่ง
                  </Button>
                  <Button
                     isLoading={mutation.isPending}
                     type="submit"
                     fullWidth
                     className="md:col-span-2 col-span-3 order-1 bg-default-foreground text-primary-foreground"
                  >
                     รับหนังสือ
                  </Button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default ReceiveOrder;
