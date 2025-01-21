import {
  DeliverRes,
  deliveryPrismaProps,
  getDeliverByIds,
} from "@/lib/actions/deliver.actions";
import { cn, downloadBlobToFile, renderBookName } from "@/lib/util";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Divider,
  Image,
  Spinner,
} from "@nextui-org/react";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { LuArrowLeft, LuPenSquare, LuPrinter } from "react-icons/lu";
import { useReactToPrint } from "react-to-print";
import PrintPdf, { PDFDocument } from "./printPdf";
import Alert from "@/ui/alert";
import { modalProps, stateProps } from "@/@type";
import { BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";
import { formatCourse, useDeliverByIds } from "@/lib/query/delivery";
import dayjs from "dayjs";

const PrintModal = ({
  onEditAddress,
  onClose,
  dialogState,
}: {
  dialogState: stateProps<modalProps<DeliverRes["data"]>>;
  onEditAddress: (data: DeliverRes["data"][0], refetch: () => void) => void;
  onClose: () => void;
}) => {
  const [pdfState, setPdfState] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    fonts: [
      {
        family: "IBM Plex Sans Thai Looped",
        source:
          "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai+Looped:wght@100;200;300;400;500;600;700&family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&display=swap",
      },
    ],
    bodyClass: `background : red`,
    pageStyle: `@media print {
         @page {
           size: 99mm 74.5mm;
           margin: 0;
         }
       }`,
  });
  const [dialog, setDialog] = dialogState;
  const { open, data } = dialog;
  const queryData = useDeliverByIds(data?.map((d) => d?.id));
  useEffect(() => {
    queryData.refetch();
  }, [data]);

  const PDFDoc = useMemo(() => {
    return <PDFDocument data={queryData.data!} />;
  }, [queryData.data]);
  return (
    <>
      <PrintPdf
        open={pdfState}
        data={queryData.data}
        PDFDoc={PDFDoc}
        onClose={() => setPdfState(false)}
      />

      <Modal
        size={"full"}
        className="rounded-none bg-transparent"
        closeButton={<></>}
        isOpen={open}
        backdrop="blur"
        onClose={() => {}}
        scrollBehavior={"inside"}
      >
        <ModalContent>
          <ModalBody className={cn("p-0 font-IBM-Thai-Looped")}>
            <div className="flex flex-1  overflow-y-hidden">
              <div className="hidden md:block flex-1"></div>

              <div className="  md:min-w-[400px] md:w-fit w-screen flex flex-col   bg-gradient-to-b from-[#838388] to-[#9B9BA5] px-4 py-2">
                <div className="flex gap-1 justify-between ">
                  <Button
                    className="bg-default-100 text-default-foreground"
                    isIconOnly
                    onClick={onClose}
                  >
                    <LuArrowLeft size={24} />
                  </Button>

                  {queryData.data && (
                    <BlobProvider document={PDFDoc}>
                      {({ blob, url, loading, error }) => {
                        // Do whatever you need with blob here
                        if (loading) {
                          return <div>Loading...</div>;
                        }
                        return (
                          <Button
                            isLoading={queryData.isFetching}
                            onClick={() => {
                              downloadBlobToFile(
                                blob!,
                                `Label ${dayjs().format("DD-MM-YYYY")}`
                              );
                            }}
                            className="flex md:hidden bg-default-foreground text-primary-foreground"
                          >
                            Print <LuPrinter size={24} />
                          </Button>
                        );
                      }}
                    </BlobProvider>
                  )}
                  <Button
                    isLoading={queryData.isFetching}
                    style={{ display: "contents" }}
                    onClick={() => setPdfState(true)}
                    // onClick={() => reactToPrintFn()}
                    className="hidden md:flex  bg-default-foreground text-primary-foreground"
                  >
                    Print <LuPrinter size={24} />
                  </Button>
                </div>
                <div
                  ref={contentRef}
                  className={cn("space-y-2  flex-1 mt-2  overflow-y-auto", {
                    "flex flex-col": queryData.isFetching,
                  })}
                >
                  {queryData.isFetching ? (
                    <div className="flex flex-1 h-full items-center justify-center">
                      <Spinner className="w-[60px] h-[60px]" color="default" />
                    </div>
                  ) : (
                    queryData.data?.map((delivery) => {
                      return (
                        <CardDeliver
                          refetch={queryData.refetch}
                          key={delivery?.id.toString()}
                          delivery={delivery}
                          onEdit={onEditAddress}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PrintModal;

const CardDeliver = ({
  onEdit,
  delivery,
  refetch,
}: {
  refetch: () => void;
  delivery: NonNullable<Awaited<ReturnType<typeof getDeliverByIds>>[0]>;
  onEdit: (data: DeliverRes["data"][0], refetch: () => void) => void;
}) => {
  const myRef = useRef<HTMLDivElement>(null);
  const handleMouseOver = () => {
    if (myRef.current) {
      myRef.current.className =
        "block absolute bottom-2 left-1/2 -translate-x-1/2";
    }
  };

  const handleMouseOut = () => {
    if (myRef.current) {
      myRef.current.className = "hidden ";
    }
  };
  const checkCourse = useMemo(() => {
    return formatCourse(delivery);
  }, [delivery]);

  return (
    <Card
      className="break-after-page flex-1 h-[281px] w-[392px]  rounded-none  hover:bg-black hover:bg-opacity-15  shadow-md "
      style={
        {
          // width : 281,
          // height: `282px !important`,
        }
      }
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <CardBody className="relative ">
        <div ref={myRef} className={cn("hidden ", {})}>
          <Button
            onClick={() => {
              onEdit(delivery, refetch);
            }}
            size="sm"
            endContent={<LuPenSquare size={20} />}
          >
            แก้ไขที่อยู่
          </Button>
        </div>

        <p className=" text-[10px] md:text-[10px]">{delivery?.webappOrderId}</p>
        <p className="px-2 mt-1 leading-[19.6px] text-[14px] md:text-[16px] ">
          {/* {delivery?.member} <br /> */}
          {delivery?.updatedAddress}
          {/* เบอร์โทร {delivery?.mobile} */}
        </p>
        <Divider className="my-2 bg-[#A1A1AA]" />
        {
          <>
            {delivery?.Delivery_WebappCourse.map((d) => {
              const checkCMapCourse = delivery.Delivery_Course.some(
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
            {checkCourse.bookLesson.length > 0 && (
              <div className="flex gap-2">
                <p className=" text-[8px] md:text-[10px] w-[34px] text-[#A1A1AA]">
                  หนังสือ
                </p>
                <div className="space-y-1">
                  <div className="list-disc list-outside text-[10px] md:text-[12px]">
                    {checkCourse.bookLesson.map((d) => {
                      return (
                        <li key={d.DocumentBook.id}>
                          <span className="relative -left-[6px]">
                            {renderBookName(d.DocumentBook)}
                          </span>
                        </li>
                      );
                    })}
                  </div>
                  {/* <div className="flex gap-1 ">
                    {checkCourse.bookLesson.map((d) => {
                      return d.DocumentBook.image ? (
                        <Image
                          className="rounded-sm object-cover"
                          key={d.DocumentBook.id}
                          width={24}
                          height={34}
                          alt="NextUI hero Image"
                          src={d.DocumentBook.image}
                        />
                      ) : (
                        <></>
                      );
                    })}
                  </div> */}
                </div>
              </div>
            )}
            {checkCourse.sheetLesson.length > 0 && (
              <div className="flex gap-2">
                <p className=" text-[8px] md:text-[10px] w-[34px] text-[#A1A1AA]">
                  เอกสาร
                </p>
                <div className="space-y-1">
                  <div className="list-disc list-outside text-[10px] md:text-[12px]">
                    {checkCourse.sheetLesson.map((d) => {
                      return (
                        <li key={d.DocumentSheet.id}>
                          <span className="relative -left-[6px]">
                            {" "}
                            {d.DocumentSheet.name}
                          </span>
                        </li>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* {checkCourse.preExamLesson.length > 0 && (
              <div className="flex gap-2">
                <p className=" text-[8px] md:text-[10px] text-[#A1A1AA]">
                  ข้อสอบ
                </p>
                <div className="space-y-1">
                  <div className="list-disc list-outside text-[10px] md:text-[12px]">
                    {checkCourse.preExamLesson.map((d) => {
                      return (
                        <li key={d.DocumentPreExam.id}>
                          {d.DocumentPreExam.name}
                        </li>
                      );
                    })}
                  </div>
                </div>
              </div>
            )} */}
          </>
        }
      </CardBody>
    </Card>
  );
};
