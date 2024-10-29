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
   Image,
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
// import Image from "next/image";
import CustomInput from "../CustomInput";
import { useUploadThing } from "@/lib/uploading/uploadthing";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept, generatePermittedFileTypes } from 'uploadthing/client'
import { useCallback, useState } from "react";
import { addBookAction, listBooksAction } from "@/lib/actions/book.actions";
import { useQuery } from "@tanstack/react-query";

const AddBook = ({
   open,
   onClose,
}: {
   open: boolean;
   onClose: () => void;
}) => {
   const {refetch: refetchBookList} = useQuery({
      queryKey: ["listBooksAction"],
      queryFn: () => listBooksAction(),
   })
   const [files, setFiles] = useState<File[]>([]);
   const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null | undefined>()
   const [name, setName] = useState<string | undefined>()
   const [term, setTerm] = useState<string | undefined>()
   const [year, setYear] = useState<string | undefined>()
   const [volume, setVolume] = useState<string | undefined>()
   const [errorAddBook, setErrorAddBook] = useState({
      isError: false,
      message: ``,
   })
   const [isLoading, setIsLoading] = useState(false)

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
      try {
         if(!validateForm()){
            return setErrorAddBook({
               isError: true,
               message: `กรุณากรอกข้อมูลให้ครบ`,
            })
         }
         setIsLoading(true)
         const responseUploadFile = await startUpload(files)
         if(!responseUploadFile){
            throw "Can't upload file to Uploadthing"
         }
         const response = await addBookAction({
            name: name!,
            image: responseUploadFile![0].url,
            // inStock: volume,
            term: term,
            year: year,
            volume: volume,
         })
         console.log("🚀 ~ submitAddBook ~ response:", response)
         if(typeof response === "string"){
            throw response
         }
         setErrorAddBook({
            isError: false,
            message: ``,
         })
         handleOnClose()
         refetchBookList()
      } catch (error) {
         console.error(error)
         setErrorAddBook({
            isError: true,
            message: `เกิดข้อผิดพลาดบางอย่าง ดูเพิ่มเติมใน Console`,
         })
      } finally {
         setIsLoading(false)
      }
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
                     <CustomInput classNames={{inputWrapper: 'h-11'}} onChange={(e) => setName(e.target.value)} placeholder="ชื่อวิชา" />
                     <div className="flex gap-2">
                        <div className="cursor-pointer rounded-lg w-28 h-[148px] flex justify-center items-center bg-[#F4F4F5]" {...getRootProps()}>
                           <input {...getInputProps()} multiple={false} />
                           {imagePreview
                           ?
                           <Image className={`object-cover w-28 h-[148px]`} src={`${imagePreview}`} alt="book image" />
                           :
                           <LuImage className="text-[#A1A1AA] h-24 w-24" />
                           }
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                           <CustomInput classNames={{inputWrapper: 'h-11'}} onChange={(e) => setTerm(e.target.value)} placeholder="midterm/final" />
                           <CustomInput classNames={{inputWrapper: 'h-11'}} onChange={(e) => setYear(e.target.value)} placeholder="ปีการศึกษา" />{" "}
                           <CustomInput classNames={{inputWrapper: 'h-11'}} onChange={(e) => setVolume(e.target.value)} placeholder="volume" />
                        </div>
                     </div>
                     <div className="py-2 flex md:flex-row flex-col gap-2 ">
                        {/* <Button
                           color="secondary"
                           className="text-danger  order-2 md:order-1 "
                           onClick={onDelete}
                        >
                           ลบ
                        </Button> */}
                        <Button
                           fullWidth
                           // color="primary"
                           className="bg-default-foreground text-primary-foreground md:order-2 order-1"
                           onClick={submitAddBook}
                           isLoading={isLoading}
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
