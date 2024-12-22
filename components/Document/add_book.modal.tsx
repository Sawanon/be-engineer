import { cn, renderBookName } from "@/lib/util";
import Alert from "@/ui/alert";
import {
   Button,
   Modal,
   ModalBody,
   ModalContent,
   Image,
   Input,
} from "@nextui-org/react";
import {
   LuImage,
   LuX,
} from "react-icons/lu";

// import Image from "next/image";
import CustomInput from "../CustomInput";
import { useUploadThing } from "@/lib/uploading/uploadthing";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept, generatePermittedFileTypes } from 'uploadthing/client'
import { useCallback, useState } from "react";
import { addBookAction, editBookAction, listBooksAction, revalidateBook } from "@/lib/actions/book.actions";
import { useQuery } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateBook } from "@/lib/model/document";
import { useSearchParams } from "next/navigation";

const AddBook = ({
   open,
   onClose,
}: {
   open: boolean;
   onClose: () => void;
}) => {
   const searchParams = useSearchParams()
   const {refetch: refetchBookList} = useQuery({
      queryKey: ["listBooksAction"],
      queryFn: () => listBooksAction(),
   })
   const {
      register,
      handleSubmit,
      formState: {errors, isSubmitting},
      setError,
      reset,
   } = useForm<CreateBook>()
   const [files, setFiles] = useState<File[]>([]);
   const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null | undefined>()

   const handleOnClose = () => {
      reset()
      setFiles([])
      setImagePreview(undefined)
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
      onUploadError: (e) => {
         // alert("error occurred while uploading");
         console.error(e)
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

   const submitCreateBook:SubmitHandler<CreateBook> = async (data) => {
      try {
         const {name, term, year, volume} = data
         console.log(data);
         if(files.length === 0){
            setError('root', {
               message: "กรุณากรอกข้อมูลให้ครบ"
            })
            return
         }
         const response = await addBookAction({
            name: name!,
            // image: responseUploadFile![0].url,
            // inStock: volume,
            term: term,
            year: year,
            volume: volume,
            fullName: `${name!} ${term} ${year}${volume ? ` vol.${volume}` : ``}`
         })
         console.log("🚀 ~ submitAddBook ~ response:", response)
         if(typeof response === "string"){
            console.log(response.includes("name_UNIQUE"));
            
            if(response.includes("name_UNIQUE")){
               setError('root', {
                  message: `ชื่อหนังสือ ${name} มีอยู่แล้ว กรุณาใช้ชื่ออื่น`,
               })
               console.error(response)
               return
            }
            throw response
         }
         if(!response){
            throw `response is ${response}`
         }
         const responseUploadFile = await startUpload(files)
         if(!responseUploadFile){
            throw "Can't upload file to Uploadthing"
         }
         const updateImageToBook = await editBookAction(response.id, {
            image: responseUploadFile![0].url,
         })
         console.log("🚀 ~ submitAddBook ~ updateImageToBook:", updateImageToBook)
         handleOnClose()
         // refetchBookList()
         const params = new URLSearchParams(searchParams.toString())
         params.delete('add')
         revalidateBook(`/document?${params.toString()}`)
         console.log(data);
      } catch (error) {
         console.error(error)
         setError('root', {
            message: `เกิดข้อผิดพลาดบางอย่าง ดูเพิ่มเติมใน Console`,
         })
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
                  <form onSubmit={handleSubmit(submitCreateBook)}>
                     <div className=" flex flex-col rounded-xl bg-white flex-1 px-4 space-y-2">
                        <div className="flex gap-1 justify-center my-3">
                           <p className="text-3xl font-semibold font-sans text-default-foreground">หนังสือ</p>
                           <Button
                              variant="flat"
                              isIconOnly
                              className="bg-transparent text-black absolute right-1 top-1"
                              onClick={handleOnClose}
                           >
                              <LuX size={24} />
                           </Button>
                        </div>
                        {errors.root ?
                           <Alert label={errors.root.message} />
                           :
                           (errors.name || errors.term || errors.year) &&
                             <Alert label={'กรุณากรอกข้อมูลให้ครบ'} />
                        }
                        {/* <CustomInput classNames={{inputWrapper: 'h-11'}} onChange={(e) => setName(e.target.value)} placeholder="ชื่อวิชา" /> */}
                        <Input
                           aria-label="book name"
                           placeholder={`ชื่อวิชา`}
                           classNames={{
                              input: ['font-serif', 'text-[1em]'],
                              inputWrapper: ['h-11'],
                           }}
                           className={`rounded-lg`}
                           color={errors.name ? `danger` : `default`}
                           {...register('name', {required: true})}
                        />
                        <div className="flex gap-2">
                           <div className={`cursor-pointer rounded-lg w-28 h-[148px] flex justify-center items-center transition-background ${errors.root ? `bg-danger-50 hover:bg-danger-100` : `bg-default-100 hover:bg-default-300`}`} {...getRootProps()}>
                              <input aria-label="book image" {...getInputProps()} multiple={false} />
                              {imagePreview
                              ?
                              <Image className={`object-cover w-28 h-[148px]  data-[loaded=true]:hover:opacity-80`} src={`${imagePreview}`} alt="book image" />
                              :
                              <LuImage className={`${errors.root ? `text-danger-300` : `text-[#A1A1AA]`} h-24 w-24`} />
                              }
                           </div>
                           <div className="flex-1 flex flex-col gap-2">
                              {/* <CustomInput classNames={{inputWrapper: 'h-11'}} onChange={(e) => setTerm(e.target.value)} placeholder="midterm/final" /> */}
                              <Input
                                 aria-label="term"
                                 placeholder={`midterm/final`}
                                 classNames={{
                                    input: ['font-serif', 'text-[1em]'],
                                    inputWrapper: ['h-11'],
                                 }}
                                 className={`rounded-lg`}
                                 color={errors.term ? `danger` : `default`}
                                 {...register('term', {required: true})}
                              />
                              {/* <CustomInput classNames={{inputWrapper: 'h-11'}} onChange={(e) => setYear(e.target.value)} placeholder="ปีการศึกษา" />{" "} */}
                              <Input
                                 aria-label="year"
                                 placeholder={`ปีการศึกษา`}
                                 classNames={{
                                    input: ['font-serif', 'text-[1em]'],
                                    inputWrapper: ['h-11'],
                                 }}
                                 className={`rounded-lg`}
                                 color={errors.year ? `danger` : `default`}
                                 {...register('year', {required: true})}
                              />
                              {/* <CustomInput classNames={{inputWrapper: 'h-11'}} onChange={(e) => setVolume(e.target.value)} placeholder="volume" /> */}
                              <Input
                                 aria-label="volume"
                                 placeholder={`volume`}
                                 classNames={{
                                    input: ['font-serif', 'text-[1em]'],
                                    inputWrapper: ['h-11'],
                                 }}
                                 className={`rounded-lg`}
                                 color={errors.volume ? `danger` : `default`}
                                 {...register('volume')}
                              />
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
                              className="bg-default-foreground text-primary-foreground md:order-2 order-1 font-sans font-medium text-base"
                              // onClick={submitAddBook}
                              isLoading={isSubmitting}
                              type="submit"
                           >
                              บันทึก
                           </Button>
                        </div>
                     </div>
                  </form>
               </div>
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

export default AddBook;
