import {
  addPreExamAction,
  revalidatePreExam,
} from "@/lib/actions/pre-exam.actions";
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

type CreatePreExam = {
  name: string;
  url: string;
};

const AddPreExamModal = ({
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
  } = useForm<CreatePreExam>();
  const searchParams = useSearchParams();
  const route = useRouter();

  const handleOnClose = () => {
    reset()
    onClose()
  }

  const revalidate = async () => {
    revalidatePreExam();
  };

  const handleCloseAddPreExam = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("add");
    route.replace(`/document?${params.toString()}`);
  };

  const submitCreatePreExam: SubmitHandler<CreatePreExam> = async (data) => {
    try {
      if (!data.name || !data.url) {
        setError("root", {
          message: "กรุณากรอกข้อมูลให้ครบ",
        });
        return;
      }
      const repsonse = await addPreExamAction({
        name: data.name,
        url: data.url,
      });
      if (!repsonse) {
        console.error(`response is undefined Document/index:102`);
        return;
      }
      handleCloseAddPreExam();
      revalidate();
    } catch (error) {
      console.error(error);
      setError("root", {
        message: `เกิดข้อผิดพลาดบางอย่าง ดูเพิ่มเติมใน Console`,
      });
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
          <form className={`flex flex-col`} onSubmit={handleSubmit(submitCreatePreExam)}>
            <div className={`flex items-center`}>
              <div className={`flex-1`}></div>
              <div
                className={`flex-1 text-center text-3xl font-semibold font-IBM-Thai`}
              >
                Pre-exam
              </div>
              <div className={`flex-1 flex items-center justify-end`}>
                <Button
                  onClick={handleOnClose}
                  className={`min-w-0 w-8 max-w-8 max-h-8 bg-primary-foreground`}
                  isIconOnly
                  aria-label="addPreExam-button"
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
                placeholder={`Dynamics (CU) - Pre-midterm 2/2565`}
                aria-label={`ชื่อเอกสาร preExam`}
                // onChange={(e) => setPreExamName(e.target.value)}
                className={`font-serif`}
                classNames={{
                  input: "text-[1em]",
                }}
                color={errors.name ? `danger` : `default`}
                {...register("name", { required: true })}
              />
              <div id="textarea-wrapper">
                <Textarea
                  classNames={{
                    input: `text-[1em]`,
                  }}
                  minRows={1}
                  placeholder={`Link`}
                  aria-label={`Link`}
                  className={`mt-2 font-serif ${
                    !watch("url") ? `` : `underline`
                  }`}
                  // onChange={(e) => setPreExamLink(e.target.value)}
                  color={errors.url ? `danger` : `default`}
                  {...register("url", { required: true })}
                />
              </div>
            </div>
            <Button
              // onClick={submitPreExam}
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

export default AddPreExamModal;
