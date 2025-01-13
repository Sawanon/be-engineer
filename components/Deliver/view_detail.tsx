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
import { useMemo, useState } from "react";
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
  useAddTracking,
  useChangeType,
  useDeliverById,
  useDeliverByIds,
  useUpdatePickup,
  useUpdateTracking,
} from "@/lib/query/delivery";
import { deliveryType } from "@/lib/res/const";
import SingleTrack from "./singleTrack";
import { addDeliverShipService } from "@/lib/actions/delivery_ship.actions";
import ChangeReceiveType from "./change_type.modal";
import ReceiveOrder from "./receive_order";
import { deliveryPrismaProps, getDeliver } from "@/lib/actions/deliver.actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
type createProp = {
  trackingNumber?: string;
  delivery?: deliverShipServiceKey;
  note?: string;
};
const ViewDetail = ({
  onClose,
  dialogState,
}: {
  dialogState: modalProps<Awaited<ReturnType<typeof getDeliver>>["data"][0]> & {
    type?: deliveryTypeProps;
    id?: string;
  };
  onClose: () => void;
}) => {
  const router = useRouter();
  const { open, data, id } = dialogState;
  const [isError, setIsError] = useState(false);

  const [newData, setNewData] = useState(data);
  const queryData = useDeliverById(
    id ? parseInt(id) : undefined,
    id !== undefined
  );
  useMemo(() => {
    if (queryData.data && open && data === undefined && id !== undefined) {
      setNewData(queryData.data);
    } else {
      setNewData(data);
    }
  }, [queryData.data, data]);
  const checkCourse = useMemo(() => {
    if (queryData.data) {
      return formatRecord(queryData.data);
    }
    return undefined;
  }, [queryData.data]);

  const handleClose = () => {
    onClose();

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
                  {newData?.member}
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
              {isError && <Alert />}
            </div>
            {queryData.isPending ? (
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
                            <Image
                              className="rounded-sm"
                              width={24}
                              height={34}
                              alt="NextUI hero Image"
                              src={d.DocumentBook.image}
                            />
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
                              <LuScrollText size={24} />
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
            {isError && <Alert />}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ViewDetail;
