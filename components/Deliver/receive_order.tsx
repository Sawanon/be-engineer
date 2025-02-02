import { deliveryTypeProps } from "@/@type";
import {
  deliveryPrismaProps,
  getDeliver,
  getDeliverByFilter,
  getDeliverById,
} from "@/lib/actions/deliver.actions";
import {
  formatCourse,
  useDeliverById,
  useDeliverByIds,
  useUpdatePickup,
} from "@/lib/query/delivery";
import { cn, openSheetPage, renderBookName } from "@/lib/util";
import Alert from "@/ui/alert";
import {
  Button,
  Image as NextUiImage,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  LuArrowRightLeft,
  LuExternalLink,
  LuScrollText,
  LuX,
} from "react-icons/lu";
import { RenderPopoverImg } from ".";
const ReceiveOrder = ({
  onChangeType,
  onClose,
  mutation,
  data,
  id,
  isLoading,
}: {
  data: Awaited<ReturnType<typeof getDeliverById>>;
  mutation: ReturnType<typeof useUpdatePickup>;
  onChangeType: (data: {
    detail: deliveryPrismaProps;
    type: deliveryTypeProps;
  }) => void;
  onClose: () => void;
  id?: number;
  isLoading: boolean;
}) => {
  const form = useForm<{ note: string }>();
  const auth = useSession();

  const onSubmit = ({ note }: { note: string }) => {
    mutation.mutate({
      id: data?.id!,
      note: note,
      webappAdminId: auth.data?.user.id,
      webappAdminUsername: auth.data?.user.username!,

      // courseId: data?.course.map((d) => d.id.toString()),
    });
  };
  // TODO: fetch data

  const checkCourse = useMemo(() => {
    if (data) {
      return formatCourse(data);
    }
    return undefined;
  }, [data]);
  return (
    <div className="flex flex-col ">
      <div className=" flex flex-col rounded-xl md:rounded-none   bg-white flex-1 px-4 space-y-2">
        <div className="flex gap-1 justify-center my-3  ">
          <p className="text-3xl font-sans font-semibold">
            {isLoading ? "" : data?.member}
          </p>
          <Button
            variant="flat"
            isIconOnly
            className="bg-transparent text-black absolute right-1 top-1"
            onClick={onClose}
          >
            <LuX size={24} />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-1 h-full items-center justify-center">
            <Spinner className="w-[60px] h-[60px]" color="default" />
          </div>
        ) : (
          <>
            {data?.Delivery_WebappCourse.map((d) => {
              const checkCMapCourse = data?.Delivery_Course.some((course) => {
                return (
                  course.webappCourseId === d.webappCourseId &&
                  course.Course === null
                );
              });

              if (checkCMapCourse) {
                return (
                  <Alert
                    key={d.webappCourseId}
                    label={`ไม่มีข้อมูลคอร์ส ${d.WebappCourse?.name}`}
                  />
                );
              }
            })}
            {checkCourse?.bookLesson && checkCourse.bookLesson.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="font-bold text-sm text-default-400">หนังสือ</p>

                <div className="space-y-1">
                  <div className="space-y-1 text-base leading-6 font-serif">
                    {checkCourse?.bookLesson.map((d) => {
                      return (
                        <div
                          className="flex gap-2 items-center"
                          key={d.DocumentBook.id}
                        >
                          <RenderPopoverImg imgUrl={d.DocumentBook.image!} />
                          <p>
                            {renderBookName(d.DocumentBook)}
                            {/* {d.DocumentBook.name} */}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            {checkCourse?.sheetLesson && checkCourse.sheetLesson.length > 0 && (
              <div className=" gap-2">
                <p className="font-bold text-sm text-default-400 ">เอกสาร</p>

                <div className="space-y-1">
                  <div className=" text-base leading-6 font-serif">
                    {checkCourse.sheetLesson.map((d) => {
                      return (
                        <div
                          key={d.DocumentSheet.id}
                          className="flex gap-2 items-center "
                        >
                          <LuScrollText size={20} className="min-w-5" />
                          <p className="flex items-center gap-2">
                            {d.DocumentSheet.name}
                            <Button
                              variant="flat"
                              onClick={() => {
                                openSheetPage(d.DocumentSheet.id);
                              }}
                              isIconOnly
                              // color="secondary"
                              className="bg-default-100 text-default-foreground"
                            >
                              <LuExternalLink size={24} />
                            </Button>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div id="textarea-wrapper">
            <Textarea
              classNames={{
                input: cn("text-base"),
              }}
              {...form.register("note")}
              placeholder="หมายเหตุ(ถ้ามี)"
              minRows={1}
            />
          </div>
          <div className="py-2 grid grid-cols-3 gap-2">
            <Button
              disabled={mutation.isPending}
              fullWidth
              onClick={() => onChangeType({ detail: data!, type: "ship" })}
              color="default"
              variant="light"
              className="flex-shrink-0 text-base font-medium font-sans flex gap-3 bg-white text-default-foreground md:order-1 order-2  col-span-3 md:col-span-1"
            >
              <LuArrowRightLeft /> จัดส่ง
            </Button>
            <Button
              isLoading={mutation.isPending}
              type="submit"
              fullWidth
              color={"primary"}
              className="md:col-span-2 col-span-3 order-1  font-sans font-medium text-base"
            >
              รับหนังสือ
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReceiveOrder;
