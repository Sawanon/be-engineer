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

import thaipost from "../../assets/deliver_thaipost.jpg";
import jtIcon from "../../assets/deliver_JT.webp";
import kerryIcon from "../../assets/deliver_kerry.png";
import flashIcon from "../../assets/deliver_flash.jpg";
import Image from "next/image";
import { useState } from "react";
import CustomInput from "../CustomInput";
import {
   Controller,
   useForm,
   UseFormProps,
   UseFormReturn,
} from "react-hook-form";
import { deliverProps } from "@/@type";
import { register } from "module";
import _ from "lodash";

const AddTracking = ({
   data,
   open,
   onClose,
}: {
   data?: deliverProps;
   open: boolean;
   onClose: () => void;
}) => {
   const [isAddTracking, setIsAddTracking] = useState(true);
   console.table(data);
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
               {isAddTracking ? (
                  <SingleTrack
                     data={data}
                     onChangeType={() => setIsAddTracking(false)}
                     onClose={onClose}
                  />
               ) : (
                  <ReceiveBook
                     onChangeType={() => setIsAddTracking(true)}
                     onClose={onClose}
                  />
               )}
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

export default AddTracking;

const ReceiveBook = ({
   onChangeType,
   onClose,
}: {
   onChangeType: () => void;
   onClose: () => void;
}) => {
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
            <div id="textarea-wrapper">
               <Textarea placeholder="หมายเหตุ(ถ้ามี)" minRows={1} />
            </div>
            <div className="py-2 grid grid-cols-3 gap-2">
               <Button
                  fullWidth
                  className="flex gap-3 bg-white text-default-foreground md:order-1 order-2  col-span-3 md:col-span-1"
                  onClick={onChangeType}
               >
                  <LuArrowRightLeft /> จัดส่ง
               </Button>
               <Button
                  fullWidth
                  className="md:col-span-2 col-span-3 order-1 bg-default-foreground text-primary-foreground"
               >
                  รับหนังสือ
               </Button>
            </div>
         </div>
      </div>
   );
};

const SingleTrack = ({
   onChangeType,
   onClose,
   data,
}: {
   data?: deliverProps;
   onChangeType: () => void;
   onClose: () => void;
}) => {
   const form = useForm<{
      trackingNumber: string;
      delivery: keyof typeof checkStartIcon;
      // delivery: ReturnType<keyof checkStartIcon>;
   }>({
      defaultValues: {
         trackingNumber: "",
         // delivery: "",
      },
   });
   console.log("form.watch()", form.watch());
   const {
      register,
      formState: { errors },
   } = form;
   console.log("errors", errors);
   const onSubmit = (data: Record<string, any>) => {
      console.log("data", data);
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
            {/*  <Alert /> */}
            { !_.isEmpty(errors) && <Alert label="กรุณากรอกข้อมูลให้ครบ" />}
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
                           // isInvalid={true}
                           color={errors.trackingNumber && "danger"}
                           {...e.field}
                           placeholder="เลข Tracking"
                           // defaultValue="TH212318237"
                        />
                     );
                  }}
               />

               <Select
                  // onChange={(e) => {
                  //    console.log(e.target.value);
                  //    // form.setValue("delivery", e);
                  //    // setValue(e)
                  // }}
                  {...register("delivery", { required: true })}
                  // onSelectionChange={setValue}
                  // isInvalid={true}
                  color={errors.delivery && "danger"}
                  placeholder="ขนส่ง"
                  startContent={
                     form.watch("delivery") &&
                     checkStartIcon[form.watch("delivery")]
                  }
                  // defaultSelectedKeys={["flash"]}
               >
                  <SelectItem
                     classNames={{
                        base: cn("flex gap-1"),
                     }}
                     startContent={checkStartIcon["flash"]}
                     key={"flash"}
                  >
                     Flash
                  </SelectItem>
                  <SelectItem
                     classNames={{
                        base: cn("flex gap-1"),
                     }}
                     startContent={checkStartIcon["kerry"]}
                     key={"kerry"}
                  >
                     Kerry
                  </SelectItem>
                  <SelectItem
                     classNames={{
                        base: cn("flex gap-1"),
                     }}
                     startContent={checkStartIcon["j&t"]}
                     key={"j&t"}
                  >
                     J&T
                  </SelectItem>
                  <SelectItem
                     classNames={{
                        base: cn("flex gap-1"),
                     }}
                     startContent={checkStartIcon["thaipost"]}
                     key={"thaipost"}
                  >
                     ไปรษณีย์ไทย
                  </SelectItem>
               </Select>
               <div id="textarea-wrapper">
                  <Textarea
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
                     onClick={onChangeType}
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
            <Alert />

            <Select
               isInvalid={true}
               color={"danger"}
               placeholder="ขนส่ง"
               startContent={checkStartIcon["thaipost"]}
               defaultSelectedKeys={["flash"]}
            >
               <SelectItem
                  classNames={{
                     base: cn("flex gap-1"),
                  }}
                  startContent={<LuPackageCheck />}
                  key={"flash"}
               >
                  Flash
               </SelectItem>
               <SelectItem
                  classNames={{
                     base: cn("flex gap-1"),
                  }}
                  startContent={checkStartIcon["kerry"]}
                  key={"kerry"}
               >
                  Kerry
               </SelectItem>
               <SelectItem
                  classNames={{
                     base: cn("flex gap-1"),
                  }}
                  startContent={checkStartIcon["j&t"]}
                  key={"j&t"}
               >
                  J&T
               </SelectItem>
               <SelectItem
                  classNames={{
                     base: cn("flex gap-1"),
                  }}
                  startContent={checkStartIcon["thaipost"]}
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

const checkStartIcon = {
   flash: (
      <Image
         className="rounded"
         width={24}
         height={24}
         src={flashIcon}
         alt="Picture of the author"
      />
   ),
   "j&t": (
      <Image
         className="rounded"
         width={24}
         height={24}
         src={jtIcon}
         alt="Picture of the author"
      />
   ),
   kerry: (
      <Image
         className="rounded"
         width={24}
         height={24}
         src={kerryIcon}
         alt="Picture of the author"
      />
   ),
   thaipost: (
      <Image
         className="rounded"
         width={24}
         height={24}
         src={thaipost}
         alt="Picture of the author"
      />
   ),
};
