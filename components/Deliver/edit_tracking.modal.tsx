import { cn, openSheetPage, renderBookName } from "@/lib/util";
import Alert from "@/ui/alert";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Select,
  SelectItem,
  Textarea,
  Image as NextUiImage,
  Image,
  Spinner,
  Popover,
  PopoverTrigger,
  PopoverContent,
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
import { useEffect, useMemo, useState } from "react";
import CustomInput from "../CustomInput";
import {
  Controller,
  useForm,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";
import {
  addTrackingProps,
  deliverShipServiceKey,
  deliveryTypeProps,
  modalProps,
} from "@/@type";
import { register } from "module";
import _ from "lodash";
import {
  formatRecord,
  useDeliverById,
  useUpdateTracking,
  useViewEdit,
} from "@/lib/query/delivery";
import { deliveryType } from "@/lib/res/const";
import SingleTrack from "./singleTrack";
import { addDeliverShipService } from "@/lib/actions/delivery_ship.actions";
import ChangeReceiveType from "./change_type.modal";
import ReceiveOrder from "./receive_order";
import {
  deliveryPrismaProps,
  getDeliver,
  getDeliverById,
} from "@/lib/actions/deliver.actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { RenderPopoverImg } from ".";
type createProp = {
  trackingNumber?: string;
  delivery?: deliverShipServiceKey;
  note?: string;
};
const EditTracking = ({
  onClose,
  refetch,
  dialogState,
}: {
  dialogState: modalProps<Awaited<ReturnType<typeof getDeliverById>>> & {
    type?: deliveryTypeProps;
    id?: string;
  };
  refetch: () => void;
  onClose: () => void;
}) => {
  const { open, data, id } = dialogState;
  const [isError, setIsError] = useState(false);
  const onError = (e: Error) => {
    console.error(e);
    setIsError(true);
  };

  const auth = useSession();

  const form = useForm<createProp>({
    defaultValues: {
      trackingNumber: "",
      // delivery: ,
    },
  });
  const {
    setValue,
    register,
    watch,
    formState: { errors },
  } = form;

  const [newData, setNewData] = useState(data);

  const queryData = useViewEdit(
    id ? parseInt(id) : undefined,
    data === undefined && id !== undefined
  );
  // useEffect(() => {
  // setNewData(data);
  // }, [data]);
  useMemo(() => {
    if (queryData.data && open) {
      setNewData(queryData.data);
    } else {
      setNewData(data);
    }
  }, [queryData.data, data]);
  const checkCourse = useMemo(() => {
    if (newData) {
      // const data = queryData.data;
      if (newData.type === "pickup") {
        setValue("note", newData.note!);
      } else if (newData.type === "ship") {
        setValue("trackingNumber", newData.trackingCode!);
        setValue("note", newData.note!);
        setValue(
          "delivery",
          newData.DeliverShipService?.name as deliverShipServiceKey
        );
      }

      return formatRecord(newData);
    }
    return undefined;
  }, [, newData]);
  useEffect(() => {
    setIsError(false);
  }, [open]);

  const mutation = useUpdateTracking({
    onError: onError,
    onSuccess: () => {
      // alert("Update Success");
      refetch();
      handleClose();
      queryData.refetch();
    },
  });

  const onSubmit = (props: createProp) => {
    mutation.mutate({
      ...props,
      id: parseInt(id!),
      webappAdminUsername: auth.data?.user.username!,
      webappAdminId: auth.data?.user.id,
    });
  };
  const handleClose = () => {
    onClose();
    form.setValue("delivery", undefined);
    form.setValue("note", "");
    form.setValue("trackingNumber", "");
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
      // backdrop="blur"
      onClose={() => {}}
      // scrollBehavior={"inside"}
      closeButton={<></>}
    >
      <ModalContent>
        <ModalBody className={cn("p-0 flex-1 font-serif rounded-[14px]")}>
          <div className="flex flex-col p-4 ">
            <div className=" flex flex-col md:rounded-none   bg-white flex-1 px-4 space-y-2">
              <div className="flex gap-1 justify-center my-3  ">
                <p className="text-3xl font-semibold font-IBM-Thai">
                  {queryData.isFetching ? "" : newData?.member}
                </p>
                <Button
                  variant="flat"
                  isIconOnly
                  className="bg-transparent text-black absolute right-1 top-1 "
                  onClick={handleClose}
                >
                  <LuX size={24} />
                </Button>
              </div>
            </div>
            {isError && <Alert />}
            {queryData.isFetching ? (
              <div className="flex flex-1 h-full items-center justify-center">
                <Spinner className="w-[60px] h-[60px]" color="default" />
              </div>
            ) : (
              <>
                {/* TODO: Check Course */}
                {newData?.Delivery_WebappCourse.map((d) => {
                  const checkCMapCourse = newData.Delivery_Course.some(
                    (course) => {
                      return (
                        course.webappCourseId === d.webappCourseId &&
                        course.Course === null
                      );
                    }
                  );

                  if (checkCMapCourse) {
                    return (
                      <Alert
                        key={d.webappCourseId}
                        label={`ไม่มีข้อมูลคอร์ส ${d.WebappCourse?.name}`}
                      />
                    );
                  }
                })}

                {checkCourse && checkCourse.bookRecord.length > 0 && (
                  <div className="gap-2">
                    <p className=" text-[14px] text-[#A1A1AA]">หนังสือ</p>
                    <div className="space-y-1">
                      {checkCourse.bookRecord.map((d) => {
                        return d.DocumentBook?.image ? (
                          <div
                            className="flex gap-2 items-center"
                            key={d.DocumentBook.id}
                          >
                            <RenderPopoverImg imgUrl={d.DocumentBook.image} />

                            <p
                              key={d.DocumentBook?.id}
                              className="leading-6 text-base font-serif"
                            >
                              {renderBookName(d.DocumentBook)}
                            </p>
                          </div>
                        ) : (
                          <></>
                        );
                      })}
                    </div>
                  </div>
                )}
                {checkCourse && checkCourse.sheetRecord.length > 0 && (
                  <div className="">
                    <p className=" text-[14px] text-[#A1A1AA]">เอกสาร</p>
                    <div className="space-y-1">
                      <div className="text-[14px] md:text-[12px]">
                        {checkCourse.sheetRecord.map((d) => {
                          return (
                            <div
                              className=" flex gap-2 items-center"
                              key={d.DocumentSheet?.id}
                            >
                              <LuScrollText size={20} className="min-w-5" />
                              <div className="flex items-center gap-2">
                                <p className="leading-6 text-base font-serif">
                                  {d.DocumentSheet?.name}{" "}
                                </p>
                                <Button
                                  variant="flat"
                                  onClick={() => {
                                    window.open(d.DocumentSheet?.url);
                                    // openSheetPage(d.DocumentSheet?.id!);
                                  }}
                                  isIconOnly
                                  // color="secondary"
                                  className="bg-default-100 text-default-foreground"
                                >
                                  <LuExternalLink size={24} />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="pt-3.5"></div>

            <div>
              {!_.isEmpty(errors) && <Alert label="กรุณากรอกข้อมูลให้ครบ" />}

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                {newData?.type === "ship" && (
                  <div className="space-y-2">
                    <Controller
                      name="trackingNumber"
                      control={form.control}
                      defaultValue=""
                      // rules={{ required: true }}
                      render={(e) => {
                        // console.log("e", e);
                        return (
                          <CustomInput
                            isInvalid={errors.trackingNumber && true}
                            color={errors.trackingNumber && "danger"}
                            {...e.field}
                            placeholder="เลข Tracking"
                            // defaultValue="TH212318237"
                          />
                        );
                      }}
                    />

                    <Select
                      {...register("delivery", {
                        // required: true,
                      })}
                      color={errors.delivery && "danger"}
                      placeholder="ขนส่ง"
                      // isInvalid={errors.delivery && true}
                      startContent={
                        form.watch("delivery") &&
                        deliveryType[form.watch("delivery")!].logo
                      }
                      value={"kerry"}
                      selectedKeys={
                        form.watch("delivery") &&
                        ([form.watch("delivery")] as Iterable<any>)
                      }
                      renderValue={() => {
                        return deliveryType[form.watch("delivery")!]?.txt ?? "";
                      }}
                      // defaultSelectedKeys={["flash"]}
                    >
                      <SelectItem
                        classNames={{
                          base: cn("flex gap-1 font-sans"),
                        }}
                        startContent={[deliveryType["flash"].logo]}
                        key={"flash"}
                      >
                        Flash
                      </SelectItem>
                      <SelectItem
                        classNames={{
                          base: cn("flex gap-1 font-sans"),
                        }}
                        startContent={deliveryType["kerry"].logo}
                        key={"kerry"}
                      >
                        Kerry
                      </SelectItem>
                      <SelectItem
                        classNames={{
                          base: cn("flex gap-1 font-sans"),
                        }}
                        startContent={deliveryType["j&t"].logo}
                        key={"j&t"}
                      >
                        J&T
                      </SelectItem>
                      <SelectItem
                        classNames={{
                          base: cn("flex gap-1 font-sans"),
                        }}
                        startContent={deliveryType["thaipost"].logo}
                        key={"thaipost"}
                      >
                        ไปรษณีย์ไทย
                      </SelectItem>
                    </Select>
                  </div>
                )}
                <div id="textarea-wrapper">
                  <Textarea
                    {...register("note")}
                    classNames={{
                      input: "text-[1em]",
                    }}
                    placeholder="หมายเหตุ(ถ้ามี)"
                    minRows={1}
                    value={form.watch("note")}
                    // defaultValue="ได้ Calculus ไปแล้ว ขาด Physics กัับ Chemistry จะส่งให้วันพฤหัสที่ 8 ธ.ค. นะครับ"
                  />
                </div>
                <div className="py-2 grid grid-cols-3 gap-2">
                  <Button
                    isLoading={mutation.isPending || queryData.isFetching}
                    type="submit"
                    fullWidth
                    color="primary"
                    variant="solid"
                    className="flex-shrink-0 font-sans  text-base font-medium  col-span-3 "
                  >
                    บันทึก
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditTracking;
