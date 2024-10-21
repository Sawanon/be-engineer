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
   LuImage,
   LuPackageCheck,
   LuScrollText,
   LuSearch,
   LuX,
} from "react-icons/lu";

import thaipost from "../../assets/thaipost.png";
import Image from "next/image";
import CustomInput from "../CustomInput";
import { useUploadThing } from "@/lib/uploadthing";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept, generatePermittedFileTypes } from 'uploadthing/client'
import { useCallback, useState } from "react";
import { addBookAction } from "@/lib/actions/book.actions";

const AddBook = ({
   open,
   onClose,
   onDelete,
}: {
   open: boolean;
   onClose: () => void;
   onDelete: () => void;
}) => {
   const [files, setFiles] = useState<File[]>([]);
   const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null | undefined>()
   const [name, setName] = useState<string | undefined>()
   const [term, setTerm] = useState<string | undefined>()
   const [year, setYear] = useState<string | undefined>()
   const [volume, setVolume] = useState<number | undefined>()
   const [errorAddBook, setErrorAddBook] = useState({
      isError: false,
      message: ``,
   })

   const handleOnClose = () => {
      setFiles([])
      setImagePreview(undefined)
      setName(undefined)
      setTerm(undefined)
      setYear(undefined)
      setVolume(undefined)
      onClose()
   }

   const onDrop = useCallback((acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      const reader = new FileReader();
      reader.onload = (e) => {
         setImagePreview(e.target?.result); // อัพเดต URL ของรูปภาพใน state
      };
      reader.readAsDataURL(acceptedFiles[0]);
   }, []);

   const {startUpload, routeConfig } = useUploadThing("imageUploader", {
      onClientUploadComplete: () => {
         console.log('uploaded successfully!')
      },
      onUploadError: () => {
         alert("error occurred while uploading");
      },
      onUploadBegin: (file) => {
         console.log("upload has begun for", file);
      },
      onUploadProgress: (process) => {
         console.log(process);
      },
   })

   const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      accept: generateClientDropzoneAccept(
        generatePermittedFileTypes(routeConfig).fileTypes,
      ),
   });

   const validateForm = () => {
      console.table({
         name,
         term,
         year,
         volume,
         fileLength: files.length,
      })
      if(!name || name === "" ||
         !term || term === "" ||
         !year || year === "" ||
         !volume ||
         files.length === 0
      ){
         return false
      }
      return true
   }

   const submitAddBook = async () => {
      if(!validateForm()){
         return setErrorAddBook({
            isError: true,
            message: `กรุณากรอกข้อมูลให้ครบ`,
         })
      }
      const responseUploadFile = await startUpload(files)
      if(!responseUploadFile){
         return setErrorAddBook({
            isError: true,
            message: `เกิดข้อผิดพลาดบางอย่าง ดูเพิ่มเติมใน Console`,
         })
      }
      const response = await addBookAction({
         name: name!,
         image: responseUploadFile![0].url,
         inStock: volume,
         term: term,
         year: year,
      })
      console.log("🚀 ~ submitAddBook ~ response:", response)
      if(!response){
         console.error(`reponse from backend undefined please check log in backend`)
         return setErrorAddBook({
            isError: true,
            message: `เกิดข้อผิดพลาดบางอย่าง ดูเพิ่มเติมใน Console`,
         })
      }
      setErrorAddBook({
         isError: false,
         message: ``,
      })
      handleOnClose()
   }

   return (
      <Modal
         //  size={"full"}
         // className=" bg-white"
         // z-50 bg-overlay/50 backdrop-opacity-disabled w-screen h-screen fixed inset-0
         // z-50 backdrop-blur-md backdrop-saturate-150 bg-overlay/30 w-screen h-screen fixed inset-0
         // z-50 backdrop-blur-md backdrop-saturate-150 w-screen h-screen fixed inset-0 bg-transparent
         isOpen={open}
         classNames={{
            base: "top-0 absolute md:relative w-screen   md:w-[428px] bg-white m-0  max-w-full ",
            backdrop: "bg-backdrop",
         }}
         backdrop="blur"
         onClose={() => {}}
         scrollBehavior={"inside"}
         closeButton={<></>}
      >
         <ModalContent>
            <ModalBody className={cn("p-0 flex-1 ")}>
               <div className="flex flex-col pb-4 ">
                  <div className=" flex flex-col rounded-xl    bg-white flex-1 px-4 space-y-2">
                     <div className="flex gap-1 justify-center my-3  ">
                        <p className="text-3xl font-semibold">หนังสือ</p>
                        <Button
                           variant="flat"
                           isIconOnly
                           className="bg-transparent text-black absolute right-1 top-1"
                           onClick={handleOnClose}
                        >
                           <LuX size={24} />
                        </Button>
                     </div>
                     {errorAddBook.isError &&
                        <Alert label={errorAddBook.message} />
                     }
                     <CustomInput onChange={(e) => setName(e.target.value)} placeholder="ชื่อวิชา" />
                     <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-lg flex items-center justify-center h-full bg-[#F4F4F5]" {...getRootProps()}>
                           <input {...getInputProps()} multiple={false} />
                           {imagePreview
                           ?
                           <Image width={96} height={96} src={`${imagePreview}`} alt="book image" />
                           :
                           <LuImage className="text-[#A1A1AA] h-24 w-24" />
                           }
                        </div>
                        <div className="col-span-2 flex flex-col gap-2">
                           <CustomInput onChange={(e) => setTerm(e.target.value)} placeholder="midterm/final" />
                           <CustomInput onChange={(e) => setYear(e.target.value)} placeholder="ปีการศึกษา" />{" "}
                           <CustomInput type="number" onChange={(e) => setVolume(parseInt(e.target.value))} placeholder="volume" />
                        </div>
                     </div>
                     <div className="py-2 flex md:flex-row flex-col gap-2 ">
                        <Button
                           color="secondary"
                           className="text-danger  order-2 md:order-1 "
                           onClick={onDelete}
                        >
                           ลบ
                        </Button>
                        <Button
                           fullWidth
                           // color="primary"
                           className="bg-default-foreground text-primary-foreground md:order-2 order-1"
                           onClick={submitAddBook}
                        >
                           บันทึก
                        </Button>
                     </div>
                  </div>
               </div>
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

export default AddBook;

const SingleTrack = () => {
   return (
      <div className="flex flex-col">
         <div className=" flex flex-col rounded-t-xl md:rounded-none   bg-white flex-1 px-4 space-y-2">
            <div className="flex gap-1 justify-center my-3  ">
               <p className="text-3xl font-semibold">ธีร์ธนรัชต์ นื่มทวัฒน์</p>
               <Button
                  variant="flat"
                  isIconOnly
                  className="bg-transparent text-black absolute right-1 top-1"
               >
                  <LuX size={24} />
               </Button>
            </div>
            <Alert />
            <Alert label="กรุณากรอกข้อมูลให้ครบ" />
            <CustomInput
               isInvalid={true}
               color={"danger"}
               placeholder="เลข Tracking"
            />
            <Select
               isInvalid={true}
               color={"danger"}
               placeholder="ขนส่ง"
               startContent={
                  <Image src={thaipost} alt="Picture of the author" />
               }
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
                  startContent={<LuPackageCheck />}
                  key={"kerry"}
               >
                  Kerry
               </SelectItem>
               <SelectItem
                  classNames={{
                     base: cn("flex gap-1"),
                  }}
                  startContent={<LuPackageCheck />}
                  key={"j&t"}
               >
                  J&T
               </SelectItem>
               <SelectItem
                  classNames={{
                     base: cn("flex gap-1"),
                  }}
                  startContent={
                     <Image src={thaipost} alt="Picture of the author" />
                  }
                  key={"thaipost"}
               >
                  ไปรษณีย์ไทย
               </SelectItem>
            </Select>
            <div id="textarea-wrapper">
               <Textarea
                  placeholder="หมายเหตุ(ถ้ามี)"
                  minRows={1}
                  defaultValue="ได้ Calculus ไปแล้ว ขาด Physics กัับ Chemistry จะส่งให้วันพฤหัสที่ 8 ธ.ค. นะครับ
         "
               />
            </div>
            <div className="py-2 grid grid-cols-3 gap-2">
               <Button
                  fullWidth
                  color="secondary"
                  className="flex gap-3 bg-white md:order-2 md:col-span-3"
               >
                  <LuArrowRightLeft /> รับที่สถาบัน
               </Button>
               <Button
                  fullWidth
                  color="primary"
                  className="col-span-2 md:col-span-3 md:order-1"
               >
                  บันทึก
               </Button>
            </div>
         </div>
      </div>
   );
};

const muitiTracking = () => {
   return (
      <div className="flex flex-col">
         <div className=" flex flex-col rounded-t-xl md:rounded-none   bg-white flex-1 px-4 space-y-2">
            <div className="flex gap-1 justify-center my-3  ">
               <p className="text-3xl font-semibold">เพิ่มเลข Tracking</p>
               <Button
                  variant="flat"
                  isIconOnly
                  className="bg-transparent text-black absolute right-1 top-1"
               >
                  <LuX size={24} />
               </Button>
            </div>
            <Alert />

            <Select
               isInvalid={true}
               color={"danger"}
               placeholder="ขนส่ง"
               startContent={
                  <Image src={thaipost} alt="Picture of the author" />
               }
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
                  startContent={<LuPackageCheck />}
                  key={"kerry"}
               >
                  Kerry
               </SelectItem>
               <SelectItem
                  classNames={{
                     base: cn("flex gap-1"),
                  }}
                  startContent={<LuPackageCheck />}
                  key={"j&t"}
               >
                  J&T
               </SelectItem>
               <SelectItem
                  classNames={{
                     base: cn("flex gap-1"),
                  }}
                  startContent={
                     <Image src={thaipost} alt="Picture of the author" />
                  }
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
