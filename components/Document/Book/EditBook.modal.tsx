import CustomInput from "@/components/CustomInput";
import { deleteBookAction, deleteBookImage, editBookAction, listBooksAction } from "@/lib/actions/book.actions";
import { useUploadThing } from "@/lib/uploading/uploadthing";
import { cn } from "@/lib/util";
import Alert from "@/ui/alert";
import {
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
} from "@nextui-org/react";
import { DocumentBook, LessonOnDocumentBook } from "@prisma/client";
import { useDropzone } from "@uploadthing/react";
import React, { useCallback, useMemo, useState } from "react";
import { LuImage, LuX } from "react-icons/lu";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import ConfirmBook from "../confirm.book";
import { useQuery } from "@tanstack/react-query";
import { CreateBook } from "@/lib/model/document";
import { SubmitHandler, useForm } from "react-hook-form";

const EditBookModal = ({
  open,
  selectedBook,
  onClose,
}: {
  open: boolean;
  selectedBook: DocumentBook;
  onClose: () => void;
}) => {
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
 } = useForm<CreateBook>({
  defaultValues: {
    name: selectedBook.name,
    term: selectedBook.term ?? undefined,
    year: selectedBook.year ?? undefined,
    volume: selectedBook.volume ?? undefined,
  }
 })
  // const [name, setName] = useState<string | undefined>();
  // const [term, setTerm] = useState<string | undefined | null>();
  // const [year, setYear] = useState<string | undefined | null>();
  // const [volume, setVolume] = useState<string | undefined | null>();
  // const [errorEditBook, setErrorEditBook] = useState({
  //   isError: false,
  //   message: "",
  // });
  const [errorDeleteBook, setErrorDeleteBook] = useState({
    isError: false,
    message: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<
    string | ArrayBuffer | null | undefined
  >();
  const [isDelete, setIsDelete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCantDelete, setIsCantDelete] = useState(false)

  useMemo(() => {
    // setName(selectedBook.name)
    // setTerm(selectedBook.term)
    // setYear(selectedBook.year)
    // setVolume(selectedBook.volume)
    setImagePreview(selectedBook.image)
  }, [selectedBook])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result); // อัพเดต URL ของรูปภาพใน state
    };
    reader.readAsDataURL(acceptedFiles[0]);
  }, []);

  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {
      console.log("uploaded successfully!");
    },
    onUploadError: () => {
      // alert("error occurred while uploading");
    },
    onUploadBegin: (file) => {
      console.log("upload has begun for", file);
    },
    onUploadProgress: (process) => {
      console.log(process);
    },
  });

  const handleOnClose = () => {
    reset()
    setFiles([]);
    setImagePreview(undefined);
    // setName(undefined);
    // setTerm(undefined);
    // setYear(undefined);
    // setVolume(undefined);
    setErrorDeleteBook({
      isError: false,
      message: '',
    })
    // setErrorEditBook({
    //   isError: false,
    //   message: '',
    // })
    onClose();
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
  });

  const submitUpdateBook:SubmitHandler<CreateBook> = async (data) => {
    try {
      console.log(data);
      const {name, term, year, volume} = data
      let payload:{[x: string]:any} = {
        name: name!,
        term: term,
        year: year,
        volume: volume,
      }
      if(files.length > 0){
        const responseUploadFile = await startUpload(files);
        if (!responseUploadFile) {
          throw "Can't upload file to Uploadthing"
        }
        payload.image = responseUploadFile![0].url
      }
      const response = await editBookAction(selectedBook.id, payload);
      if(files.length > 0){
        const imageKey = selectedBook.image!.split("/").reverse()[0]
        deleteBookImage(imageKey)
      }
      console.log("🚀 ~ submitAddBook ~ response:", response);
      if (typeof response === "string") {
        throw response
      }
      handleOnClose();
      refetchBookList()
    } catch (error) {
      console.error(error)
      setError('root', {
        message: `เกิดข้อผิดพลาดบางอย่าง ดูเพิ่มเติมใน Console`,
      })
    }
  }

  const handleOnDelete = () => {
    const book:any = selectedBook
    const lessonUseBook:LessonOnDocumentBook[] = book.LessonOnDocumentBook;
    if(lessonUseBook.length > 0){
      setIsCantDelete(true)
      return
    }
    setIsDelete(true)
  };

  const submitDeleteBook = async () => {
    console.log(selectedBook);
    const imageKey = selectedBook.image!.split("/").reverse()[0]
    const response = await deleteBookAction(selectedBook.id, imageKey)
    if(typeof response === "string"){
      console.error(response)
      setErrorDeleteBook({
        isError: true,
        message: 'ลบไม่สำเร็จ ดูเพิ่มเติมใน Console',
      })
      return
    }
    handleOnClose()
    refetchBookList()
  }

  return (
    <Modal
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
      <Modal
        isOpen={isCantDelete}
        classNames={{
          base: "bottom-0 absolute md:relative w-screen md:w-[428px] bg-white m-0 ",
          body: "p-0",
        }}
        backdrop="blur"
        onClose={() => {}}
        closeButton={<></>}
      >
        <ModalContent
          className={`p-app`}
        >
          <div className={`text-3xl font-semibold font-IBM-Thai`}>
            ไม่สามารถลบได้ !
          </div>
          <div className={`mt-app font-IBM-Thai-Looped`}>
            ไม่สามารถลบ หนังสือ {selectedBook.name} เพราะถูกใช้งานในคอร์สแล้ว
          </div>
          <div className={`pt-2 flex justify-end`}>
            <Button
              className={`bg-default-100 font-IBM-Thai`}
              onClick={handleOnClose}
            >
              ตกลง
            </Button>
          </div>
        </ModalContent>
      </Modal>
      <ConfirmBook
        open={isDelete}
        onClose={() => setIsDelete(false)}
        onConfirm={submitDeleteBook}
        error={errorDeleteBook}
        bookName={selectedBook.name}
      />
      <ModalContent>
        <ModalBody className={cn("p-0 flex-1 ")}>
          <form onSubmit={handleSubmit(submitUpdateBook)}>
            <div className=" flex flex-col rounded-xl bg-white flex-1 px-4 pb-4 space-y-2">
              <div className="flex gap-1 justify-center my-3  ">
                <p className="text-3xl font-semibold font-sans">หนังสือ</p>
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
                (errors.name || errors.term || errors.year || errors.volume) &&
                  <Alert label={'กรุณากรอกข้อมูลให้ครบ'} />
              }
              {/* <CustomInput
                classNames={{ inputWrapper: "h-11" }}
                onChange={(e) => setName(e.target.value)}
                placeholder="ชื่อวิชา"
                defaultValue={selectedBook.name}
              /> */}
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
                <div
                  className="cursor-pointer rounded-lg w-28 h-[148px] flex justify-center items-center bg-[#F4F4F5]"
                  {...getRootProps()}
                >
                  <input aria-label="book image" {...getInputProps()} multiple={false} />
                  {imagePreview ? (
                    <Image
                      className={`object-cover w-28 h-[148px] data-[loaded=true]:hover:opacity-80`}
                      src={`${imagePreview}`}
                      alt="book image"
                    />
                  ) : (
                    <LuImage className="text-[#A1A1AA] h-24 w-24" />
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  {/* <CustomInput
                    classNames={{ inputWrapper: "h-11" }}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="midterm/final"
                    defaultValue={selectedBook.term ?? ''}
                  /> */}
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
                  {/* <CustomInput
                    classNames={{ inputWrapper: "h-11" }}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="ปีการศึกษา"
                    defaultValue={selectedBook.year ?? ''}
                  />{" "} */}
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
                  {/* <CustomInput
                    classNames={{ inputWrapper: "h-11" }}
                    onChange={(e) => setVolume(e.target.value)}
                    placeholder="volume"
                    defaultValue={selectedBook.volume ?? ""}
                  /> */}
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
                <Button
                  color="danger"
                  variant="light"
                  className="text-danger font-medium order-2 md:order-1 font-serif"
                  onClick={handleOnDelete}
                  disabled={isLoading}
                >
                  ลบ
                </Button>
                <Button
                  fullWidth
                  // color="primary"
                  className="bg-default-foreground text-primary-foreground md:order-2 order-1 font-sans font-medium"
                  // onClick={submitEditBook}
                  isLoading={isSubmitting}
                  type="submit"
                >
                  บันทึก
                </Button>
              </div>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditBookModal;
