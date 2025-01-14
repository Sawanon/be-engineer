import { cn } from "@/lib/util";
import Alert from "@/ui/alert";
import {
  Modal,
  ModalBody,
  ModalContent,
  Image as NextUiImage,
  Spinner,
} from "@nextui-org/react";

import { useEffect, useMemo, useState } from "react";
import CustomInput from "../CustomInput";
import {
  Controller,
  useForm,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";
import { addTrackingProps, deliveryTypeProps, modalProps } from "@/@type";
import { register } from "module";
import _ from "lodash";
import {
  useAddTracking,
  useChangeType,
  useDeliverById,
  useDeliverByIds,
  useUpdatePickup,
} from "@/lib/query/delivery";
import { deliveryType } from "@/lib/res/const";
import SingleTrack from "./singleTrack";
import { addDeliverShipService } from "@/lib/actions/delivery_ship.actions";
import ChangeReceiveType from "./change_type.modal";
import ReceiveOrder from "./receive_order";
import {
  DeliverRes,
  deliveryPrismaProps,
  getDeliverByFilter,
} from "@/lib/actions/deliver.actions";
import { useRouter } from "next/navigation";
import { changeType as changeTypefn } from "@/lib/actions/deliver.actions";
import { getQueryClient } from "@/app/provider";
const AddTracking = ({
  onClose,
  refetch,
  dialogState,
  onChangeTypeSuccess,
}: {
  onChangeTypeSuccess: (
    type: deliveryTypeProps,
    newData: Awaited<ReturnType<typeof changeTypefn>>
  ) => void;
  dialogState: modalProps<
    Awaited<ReturnType<typeof getDeliverByFilter>>["data"][0]
  > & { id?: string; type?: deliveryTypeProps };
  refetch: () => void;
  onClose: () => void;
}) => {
  const queryClient = getQueryClient();
  const { open, data, type, id } = dialogState;
  const [isError, setIsError] = useState(false);
  const onError = (e: Error) => {
    console.error(e);
    setIsError(true);
  };
  const [changeType, setChangeType] = useState<
    modalProps<{ detail: deliveryPrismaProps; type: deliveryTypeProps }>
  >({
    open: false,
    data: undefined,
  });
  const getData = useDeliverById(
    parseInt(id!),
    open && data === undefined && id !== undefined
  );
  const [newData, setNewData] = useState(data);
  useMemo(() => {
    if (getData.data && open && data === undefined && id !== undefined) {
      setNewData(getData.data);
    } else {
      setNewData(data);
    }
  }, [getData.data, data]);
  const mutationChangeType = useChangeType({
    onSuccess: (returnData) => {
      getData.refetch();
      const cloneData = _.cloneDeep(newData);
      cloneData!["type"] = returnData.type;
      setNewData(cloneData);
      onCloseChangeType();
      onChangeTypeSuccess(changeType.data?.type!, returnData!);
      refetch();
      // router.refresh()
    },
    // onError
  });

  const onChangeType = (data: {
    detail: deliveryPrismaProps;
    type: deliveryTypeProps;
  }) => {
    setChangeType({
      data,
      open: true,
    });
  };
  const addSingleTrack = useAddTracking({
    onError: onError,
    onSuccess: (d) => {
      // alert("Add track Success");
      // router.refresh();
      refetch();
      onClose();
    },
  });
  const updatePickup = useUpdatePickup({
    onError: onError,
    onSuccess: () => {
      // alert("Update Pickup Success");
      refetch();
      onClose();
    },
  });
  // console.log(addSingleTrack);
  const handleAddTrack = async (data: addTrackingProps) => {
    await addSingleTrack.mutate(data);
  };
  const onCloseChangeType = () => {
    setChangeType({
      open: false,
    });
  };

  return (
    <Modal
      //  size={"full"}
      // className=" bg-white"
      isOpen={open}
      classNames={{
        backdrop: `bg-backdrop`,
        base: "top-0 absolute md:relative w-screen bg-white  md:w-[428px]  m-0  max-w-full ",
      }}
      backdrop="blur"
      onClose={() => {}}
      scrollBehavior={"inside"}
      closeButton={<></>}
    >
      <ModalContent>
        <ModalBody
          className={cn("p-0 flex-1 font-IBM-Thai-Looped rounded-[14px]")}
        >
          {newData === undefined ? (
            <div className="flex flex-1 h-full items-center justify-center">
              <Spinner className="w-[60px] h-[60px]" color="default" />
            </div>
          ) : (
            <>
              <ChangeReceiveType
                mutation={mutationChangeType}
                onClose={onCloseChangeType}
                dialog={changeType}
              />
              {newData?.type === "ship" && (
                <SingleTrack
                  // onChangenewData?.typeSuccess={onChangeTypeSuccess}
                  isError={isError}
                  handleAddTrack={handleAddTrack}
                  addTracking={addSingleTrack}
                  data={newData!}
                  onChangeType={onChangeType}
                  onClose={onClose}
                />
              )}
              {newData?.type === "pickup" && (
                <ReceiveOrder
                  id={id ? parseInt(id) : undefined}
                  data={newData!}
                  mutation={updatePickup}
                  onChangeType={onChangeType}
                  onClose={onClose}

                  // onChangeTypeSuccess={onChangeTypeSuccess}
                  // isError={isError}
                  // handleAddTrack={handleAddTrack}
                />
              )}
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddTracking;
