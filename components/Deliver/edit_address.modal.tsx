import { deliverProps } from "@/@type";
import { useUpdateAddress } from "@/lib/query/delivery";
import { cn } from "@/lib/util";
import Alert from "@/ui/alert";
import {
   Button,
   Modal,
   ModalBody,
   ModalContent,
   Textarea,
} from "@nextui-org/react";
import { Danger } from "iconsax-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LuX } from "react-icons/lu";

const EditAddress = ({
   open,
   onEditAddress,
   data,
   refetch,
}: {
   refetch: () => void;
   data?: deliverProps;
   open: boolean;
   onEditAddress: (data: deliverProps | undefined) => void;
}) => {
   const onClose = () => {
      onEditAddress(undefined);
   };
   const [isError, setIsError] = useState(false);

   const onError = (error: Error) => {
      console.error(error);
      setIsError(true);
   };
   const updateAddress = useUpdateAddress({
      onError: onError,
      onSuccess: () => {
         alert("Edit Success");
         refetch();
      },
   });
   const form = useForm<{ address: string }>();

   const onSubmit = ({ address }: { address: string }) => {
      // console.log(address);
      updateAddress.mutate({
         webappOrderId: data?.id!,
         updateAddress: address,
         courseId: data?.courses.map((d) => d.id.toString())!,
      });
   };

   useEffect(() => {
      if (data) {
         form.setValue("address", data.note);
      }
   }, [data]);
   return (
      <Modal
         //  size={"full"}
         className=""
         isOpen={open}
         classNames={{
            base: "top-0 absolute md:relative w-screen m-0 md:w-[428px]",
            backdrop: " bg-white opacity-85",
         }}
         // backdrop="blur"
         onClose={() => {}}
         scrollBehavior={"inside"}
         closeButton={<></>}
      >
         <ModalContent>
            <ModalBody className={cn("p-0 flex-1 font-IBM-Thai-Looped")}>
               <div className="flex flex-col">
                  <div className=" flex flex-col rounded-xl    bg-white flex-1 px-4 space-y-2">
                     <div className="flex gap-1 justify-center my-3  ">
                        <p className="text-3xl font-semibold">ที่อยู่จัดส่ง</p>
                        <Button
                           variant="flat"
                           isIconOnly
                           className="bg-transparent text-black absolute right-1 top-1"
                           onClick={onClose}
                        >
                           <LuX size={24} />
                        </Button>
                     </div>
                     {isError && <Alert />}

                     <p className="px-4 font-semibold text-default-600">
                        {data?.member} โทร : {data?.mobile}
                     </p>
                     <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-2"
                     >
                        <div id="textarea-wrapper">
                           <Textarea
                              isInvalid={form.formState.errors?.address && true}
                              color={form.formState.errors?.address && "danger"}
                              {...form.register("address", { required: true })}
                              minRows={1}
                              // defaultValue={data?.note}
                              //       defaultValue="582/47 ซอยรัชดา 3 (แยก 10) ถนนอโศก-ดินแดง แขวงดินแดง
                              // เขตดินแดง กทม. 10400 เบอร์โทร 0956628171
                              // "
                           />
                        </div>
                        <div className="py-3">
                           {/* <Button fullWidth color="primary"> */}
                           <Button
                              type="submit"
                              fullWidth
                              className="bg-default-foreground text-primary-foreground"
                           >
                              บันทึก
                           </Button>{" "}
                        </div>
                     </form>
                  </div>
               </div>
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

export default EditAddress;
