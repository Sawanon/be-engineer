"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
   Page,
   Text,
   View,
   Document,
   StyleSheet,
   PDFViewer,
   PageProps,
   Font,
   Image,
   PDFDownloadLink,
   BlobProvider,
   Svg,
   Path,
   //    PDFViewer,
} from "@react-pdf/renderer";
import {
   DeliverRes,
   deliveryPrismaProps,
   getDeliverByIds,
} from "@/lib/actions/deliver.actions";
import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react";
import { cn } from "@nextui-org/theme";
import { LuDownload, LuPrinter, LuX } from "react-icons/lu";
import { formatCourse } from "@/lib/query/delivery";
import dayjs from "dayjs";
import { downloadBlobToFile } from "@/lib/util";

Font.register({
   family: `sanLoop`,
   src: "./fonts/IBMPlexSansThaiLooped.ttf",
});
Font.register({
   family: `san`,
   src: "./fonts/IBMPlexSansThai.ttf",
});
const styles = StyleSheet.create({
   page: {
      display: "flex",
      flexDirection: "column",
      fontFamily: "sanLoop",
   },
   pageSize: {
      height: "212", // 74.5mm to in * 72
      width: "281", // 99mm to in * 72
   },
   section: { color: "black", margin: 8 },
});

const PrintPdf = ({
   data,
   open,
   onClose,
   PDFDoc,
}: {
   PDFDoc: JSX.Element;
   open: boolean;
   onClose: () => void;
   data?: DeliverRes["data"];
}) => {
   const [loaded, setLoaded] = useState(false);

   useEffect(() => {
      setLoaded(true);
   }, []);
   return (
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
               <div className="flex gap-2 justify-end mr-2 mt-2 ">
                  <BlobProvider document={PDFDoc}>
                     {({ blob, url, loading, error }) => {
                        // Do whatever you need with blob here
                        if (loading) {
                           return <div>Loading...</div>;
                        }
                        return (
                           <Button
                              onClick={() => {
                                 downloadBlobToFile(
                                    blob!,
                                    `Label ${dayjs().format("DD-MM-YYYY")}`
                                 );
                              }}
                              color={"primary"}
                              className="flex-shrink-0 font-sans  text-base font-medium w-fit"
                           >
                              Download <LuDownload size={24} />
                           </Button>
                        );
                     }}
                  </BlobProvider>
                  <Button
                     className="bg-default-100 text-default-foreground"
                     isIconOnly
                     onClick={onClose}
                  >
                     <LuX size={24} />
                  </Button>
               </div>
               {/* <Suspense> */}
               {loaded && open && (
                  <>
                     <PDFViewer
                        //  fileName={`Label ${dayjs().format("DD-MM-YYYY")}`}
                        showToolbar={true}
                        className="flex-1"
                     >
                        {PDFDoc}
                     </PDFViewer>
                  </>
               )}
               {/* </Suspense> */}
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

export default PrintPdf;

export const PDFDocument = ({
   data,
}: {
   data: Awaited<ReturnType<typeof getDeliverByIds>>;
}) => {
   return (
      <Document
         producer=""
         title={`Label ${dayjs().format("DD-MM-YYYY")}`}
         language="th"
      >
         {data?.map((delivery) => {
            const checkCourse = formatCourse(delivery);
            return (
               <Page
                  key={delivery.webappOrderId}
                  size={styles.pageSize}
                  style={styles.page}
               >
                  <View style={styles.section}>
                     <Text style={{ fontSize: 8 }}>
                        {delivery.webappOrderId}
                     </Text>
                     {/* <Text
                        style={{
                           fontSize: 10,
                           marginTop: "4px",
                           padding: "0px 8px",
                        }}
                     >
                        {delivery?.member} <br />
                     </Text> */}
                     <Text
                        style={{
                           fontSize: 12,
                           // lineHeight : 0.9
                           // padding: "0px 8px",
                        }}
                     >
                        {delivery.updatedAddress}
                     </Text>
                     {/* <Text
                        style={{
                           fontSize: 10,
                           padding: "0px 8px",
                        }}
                     >
                        เบอร์โทร {delivery.mobile}
                     </Text> */}
                     <Text
                        style={{
                           backgroundColor: "#A1A1AA",
                           marginVertical: 4,
                           padding: "0.5px 0px",
                        }}
                     />
                     {delivery.Delivery_Course.some(
                        (course) => course.Course?.id !== undefined
                     ) ? (
                        <View>
                           {checkCourse.bookLesson.length > 0 && (
                              <View style={{ display: "flex", gap: 2 }}>
                                 <Text
                                    style={{
                                       fontSize: 8,
                                       color: "#A1A1AA",
                                    }}
                                 >
                                    หนังสือ
                                 </Text>
                                 <View
                                    style={{
                                       fontSize: 10,
                                    }}
                                 >
                                    {checkCourse.bookLesson.map((d) => {
                                       return (
                                          <Text key={d.DocumentBook.id}>
                                             {d.DocumentBook.name}
                                          </Text>
                                       );
                                    })}
                                 </View>
                                 <View style={{ display: "flex", gap: 1 }}>
                                    {checkCourse.bookLesson.map((d) => {
                                       return d.DocumentBook.image ? (
                                          <Image
                                             key={d.DocumentBook.id}
                                             style={{
                                                width: 24,
                                                height: 34,
                                             }}
                                             src={d.DocumentBook.image}
                                          />
                                       ) : (
                                          <></>
                                       );
                                    })}
                                 </View>
                              </View>
                           )}
                           {checkCourse.sheetLesson.length > 0 && (
                              <View style={{ display: "flex", gap: 2 }}>
                                 <Text
                                    style={{
                                       fontSize: 8,
                                       color: "#A1A1AA",
                                    }}
                                 >
                                    เอกสาร
                                 </Text>
                                 <View
                                    style={{
                                       fontSize: 10,
                                    }}
                                 >
                                    {checkCourse.sheetLesson.map((d) => {
                                       return (
                                          <Text key={d.DocumentSheet.id}>
                                             {d.DocumentSheet.name}
                                          </Text>
                                       );
                                    })}
                                 </View>
                              </View>
                           )}

                           {checkCourse.preExamLesson.length > 0 && (
                              <View style={{ display: "flex", gap: 2 }}>
                                 <Text
                                    style={{
                                       fontSize: 8,
                                       color: "#A1A1AA",
                                    }}
                                 >
                                    ข้อสอบ
                                 </Text>
                                 <View
                                    style={{
                                       fontSize: 10,
                                    }}
                                 >
                                    {checkCourse.preExamLesson.map((d) => {
                                       return (
                                          <Text key={d.DocumentPreExam.id}>
                                             {d.DocumentPreExam.name}
                                          </Text>
                                       );
                                    })}
                                 </View>
                              </View>
                           )}
                        </View>
                     ) : (
                        <View
                           style={{
                              borderRadius: "4px",
                              paddingLeft: "4px",
                              backgroundColor: "#F31260",
                           }}
                        >
                           <View
                              style={{
                                 gap : 4,
                                 display: "flex",
                                 flexDirection : 'row',
                                 paddingLeft: "16px",
                                 paddingVertical: 2,
                                 color: "#F31260",
                                 backgroundColor: "#FEE7EF",
                                 // alignItems: "center",
                                 borderRadius: 4,
                              }}
                           >
                              <ErrorIcon />

                              <Text style={{ fontSize: 8 }}>
                                 ไม่มีข้อมูลคอร์ส{" "}
                                 {
                                    delivery.Delivery_WebappCourse[0]
                                       .WebappCourse?.name
                                 }
                              </Text>
                           </View>
                        </View>
                     )}
                  </View>
               </Page>
            );
         })}
      </Document>
   );
};

// import React, {useEffect, useState} from 'react'
// import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
// import MyDocument from '../../components/generatedFile'
// import { useAuth } from '../../config/useAuth';
// import {isMobile, isBrowser} from 'react-device-detect';

// export default function Exame() {
// const { user, isAdmin, isNurse } = useAuth();

//   const styles  =  {
//     height: '100vh',
//     width: '100vw'
//   }

//    if(user || isAdmin || isNurse && isBrowser){
//       return (
//           <div>
//               <PDFViewer style={styles} >
//                   <MyDocument />
//               </PDFViewer>
//           </div>
//       )
//   }
//   if(user || isAdmin || isNurse && isMobile){
//     return (
//       <>
//       <PDFDownloadLink document={<MyDocument/>} fileName="exame-covid.pdf">
//       {({ blob, url, loading, error }) =>
//         loading ? 'Gerando seu exame...' : 'Baixe agora!'
//       }
//       </PDFDownloadLink>
//       </>
//     )
//   }
// }

const ErrorIcon = () => {
   return (
      <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
         <Path
            d="M21.76 15.92 15.36 4.4C14.5 2.85 13.31 2 12 2s-2.5.85-3.36 2.4l-6.4 11.52c-.81 1.47-.9 2.88-.25 3.99.65 1.11 1.93 1.72 3.61 1.72h12.8c1.68 0 2.96-.61 3.61-1.72.65-1.11.56-2.53-.25-3.99ZM11.25 9c0-.41.34-.75.75-.75s.75.34.75.75v5c0 .41-.34.75-.75.75s-.75-.34-.75-.75V9Zm1.46 8.71-.15.12c-.06.04-.12.07-.18.09-.06.03-.12.05-.19.06-.06.01-.13.02-.19.02s-.13-.01-.2-.02a.636.636 0 0 1-.18-.06.757.757 0 0 1-.18-.09l-.15-.12c-.18-.19-.29-.45-.29-.71 0-.26.11-.52.29-.71l.15-.12c.06-.04.12-.07.18-.09.06-.03.12-.05.18-.06.13-.03.27-.03.39 0 .07.01.13.03.19.06.06.02.12.05.18.09l.15.12c.18.19.29.45.29.71 0 .26-.11.52-.29.71Z"
            fill="#f31260"
         ></Path>
      </Svg>
   );
};
