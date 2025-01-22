"use client";
import { addSheetAction, revalidateSheet } from "@/lib/actions/sheet.action";
import Alert from "@/ui/alert";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  Textarea,
} from "@nextui-org/react";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type CreateSheet = {
  name: string;
  url: string;
};

const AddSheetModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
    watch,
  } = useForm<CreateSheet>();

  const searchParams = useSearchParams();
  const route = useRouter();

  const handleOnClose = () => {
    reset()
    onClose()
  }

  const handleOnCloseAddSheet = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("add");
    route.replace(`/document?${params.toString()}`);
  };

  const handleOnSuccess = async () => {
    try {
      revalidateSheet(`/document${location.search}`);
    } catch (error) {
      revalidateSheet();
    }
  };

  const submitCreateSheet: SubmitHandler<CreateSheet> = async (data) => {
    try {
      console.log("boom");
      console.table({
        name: data.name,
        url: data.url,
      });
      if (!data.name || !data.url) {
        setError("root", {
          message: "กรุณากรอกข้อมูลให้ครบ",
        });
        return;
      }
      const response = await addSheetAction(data.name, data.url);
      console.log(response);
      if (!response) {
        console.error("response is undefiend Document/index:89");
      }
      handleOnCloseAddSheet();
      handleOnSuccess();
    } catch (error) {
      console.error(error);
      setError('root', {
        message: `เกิดข้อผิดพลาดบางอย่าง ดูเพิ่มเติมใน Console`,
      })
    }
  };
  return (
    <div>
      <Modal
        isOpen={isOpen}
        closeButton={<></>}
        backdrop="blur"
        classNames={{
          backdrop: `bg-backdrop`,
        }}
      >
        <ModalContent className={`p-app`}>
          <form
            className={`flex flex-col w-full`}
            onSubmit={handleSubmit(submitCreateSheet)}
          >
            <div className={`flex items-center`}>
              <div className={`flex-1`}></div>
              <div
                className={`flex-1 text-center text-3xl font-semibold font-IBM-Thai`}
              >
                เอกสาร
              </div>
              <div className={`flex-1 flex items-center justify-end`}>
                <Button
                  onClick={handleOnClose}
                  className={`min-w-0 w-8 max-w-8 max-h-8 bg-primary-foreground`}
                  isIconOnly
                >
                  <X />
                </Button>
              </div>
            </div>
            {errors.root ? (
              <div className={`-mb-3 mt-app`}>
                <Alert label={errors.root.message} />
              </div>
            ) : (
              (errors.name || errors.url) && (
                <div className={`-mb-3 mt-app`}>
                  <Alert label={"กรุณากรอกข้อมูลให้ครบ"} />
                </div>
              )
            )}
            <div className={`mt-app`}>
              <Input
                placeholder={`ชื่อเอกสาร`}
                aria-label={`ชื่อเอกสาร`}
                // onChange={(e) => setDocumentName(e.target.value)}
                className={`font-serif`}
                classNames={{
                  input: `text-[1em]`,
                  inputWrapper: ["rounded-lg"],
                }}
                color={errors.name ? `danger` : `default`}
                {...register("name", { required: true })}
              />
              <div id="textarea-wrapper">
                <Textarea
                  classNames={{
                    input: `text-[1em]`,
                    inputWrapper: ["rounded-lg"],
                  }}
                  minRows={1}
                  placeholder={`Link`}
                  aria-label={`Link`}
                  className={`mt-2 font-serif ${
                    !watch("url") ? `` : `underline`
                  }`}
                  color={errors.url ? `danger` : `default`}
                  // onChange={(e) => setDocumentLink(e.target.value)}
                  {...register("url", { required: true })}
                />
              </div>
            </div>
            <Button
              // onClick={submitDocument}
              type="submit"
              className={`mt-[22px] bg-default-foreground text-primary-foreground font-IBM-Thai font-medium text-base`}
              isLoading={isSubmitting}
            >
              บันทึก
            </Button>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddSheetModal;
