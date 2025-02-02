"use client";
import { modalProps, stateProps } from "@/@type";
import {
  DeliverRes,
  deliveryPrismaProps,
  getDeliverById,
  updateAddress,
} from "@/lib/actions/deliver.actions";
import { useDeliverById, useUpdateAddress } from "@/lib/query/delivery";
import { cn } from "@/lib/util";
import Alert from "@/ui/alert";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { Danger } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { LuX } from "react-icons/lu";

const EditAddress = ({
  onEditAddress,
  dialogState,
  updatePrintModal,
  refetch,
}: {
  updatePrintModal: (data: Awaited<ReturnType<typeof updateAddress>>) => void;
  refetch?: () => void;
  dialogState: stateProps<
    modalProps<
      Awaited<ReturnType<typeof getDeliverById>> | DeliverRes["data"][0]
    > & { refetch?: () => void; id?: string }
  >;
  onEditAddress: (data: DeliverRes["data"][0] | undefined) => void;
}) => {
  const [dialog, setDialog] = dialogState;
  const { open, data, id } = dialog;
  console.log("dialogState", dialogState);
  const router = useRouter();

  const onClose = () => {
    onEditAddress(undefined);
  };

  const [isError, setIsError] = useState(false);

  const onError = (error: Error) => {
    console.error(error);
    setIsError(true);
  };
  const getData = useDeliverById(
    parseInt(id!),
    open && data === undefined && id !== undefined
  );
  const mutationUpdateAddress = useUpdateAddress({
    onError: onError,
    onSuccess: (data: Awaited<ReturnType<typeof updateAddress>>) => {
      if (refetch) {
        refetch();
      }
      if (getData.data) {
        getData.refetch();
      }
      updatePrintModal(data);
      onClose();
    },
  });
  const form = useForm<{ address: string }>();

  const onSubmit = ({ address }: { address: string }) => {
    // console.log(address);
    mutationUpdateAddress.mutate({
      id: newData?.id!,
      updateAddress: address,
      // courseId: data?.courses.map((d) => d.id.toString())!,
    });
  };

  const [newData, setNewData] = useState(data);
  useMemo(() => {
    if (getData.data && open && data === undefined && id !== undefined) {
      setNewData(getData.data);
    } else {
      setNewData(data);
    }
  }, [getData.data, data]);

  useEffect(() => {
    if (newData) {
      form.setValue("address", newData?.updatedAddress!);
    }
  }, [newData, open]);

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
          {newData === undefined ? (
            <div className="flex flex-1 h-full items-center justify-center">
              <Spinner className="w-[60px] h-[60px]" color="default" />
            </div>
          ) : (
            <div className="flex flex-col">
              <div className=" flex flex-col rounded-xl    bg-white flex-1 px-4 space-y-2">
                <div className="flex gap-1 justify-center my-3  ">
                  <p className="text-3xl font-semibold font-sans">
                    ที่อยู่จัดส่ง
                  </p>
                  <Button
                    variant="flat"
                    isIconOnly
                    className="bg-transparent text-black absolute right-1 top-1"
                    onClick={onClose}
                    disabled={mutationUpdateAddress.isPending}
                  >
                    <LuX size={24} />
                  </Button>
                </div>
                {isError && <Alert />}

                <p className="px-4 font-semibold text-default-600">
                  {newData?.member} โทร : {newData?.mobile}
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
                      value={form.watch("address")}
                      minRows={1}
                      classNames={{
                        input: cn("text-base"),
                      }}
                      // defaultValue={data?.note}
                      //       defaultValue="582/47 ซอยรัชดา 3 (แยก 10) ถนนอโศก-ดินแดง แขวงดินแดง
                      // เขตดินแดง กทม. 10400 เบอร์โทร 0956628171
                      // "
                    />
                  </div>
                  <div className="py-3">
                    {/* <Button fullWidth color="primary"> */}
                    <Button
                      isLoading={mutationUpdateAddress.isPending}
                      type="submit"
                      fullWidth
                      color="primary"
                      variant="solid"
                      className="flex-shrink-0 font-sans  text-base font-medium "
                    >
                      บันทึก
                    </Button>{" "}
                  </div>
                </form>
              </div>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditAddress;
