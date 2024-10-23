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
   //    PDFViewer,
} from "@react-pdf/renderer";
import {
   DeliverRes,
   deliveryPrismaProps,
   getDeliverByIds,
} from "@/lib/actions/deliver.actions";
import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react";
import { cn } from "@nextui-org/theme";
import { LuX } from "react-icons/lu";
import { formatCourse } from "@/lib/query/delivery";
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
      width: "281", // 99mm to in * 72
      height: "212", // 74.5mm to in * 72
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
               <div className="flex gap-1 justify-end ">
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
                  <PDFViewer showToolbar={true} className="flex-1">
                     {PDFDoc}
                  </PDFViewer>
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
      <Document title="Print Track" language="th">
         {data?.map((delivery) => {
            const checkCourse = formatCourse(delivery);
            console.log("delivery.Delivery_Course", delivery.Delivery_Course);
            return (
               <Page
                  key={delivery.id}
                  size={styles.pageSize}
                  style={styles.page}
               >
                  <View style={styles.section}>
                     <Text style={{ fontSize: 8 }}>
                        {delivery.webappOrderId}
                     </Text>
                     <Text
                        style={{
                           fontSize: 10,
                           marginTop: "4px",
                           padding: "0px 8px",
                        }}
                     >
                        {delivery?.member} <br />
                     </Text>
                     <Text
                        style={{
                           fontSize: 10,
                           padding: "0px 8px",
                        }}
                     >
                        {delivery.updatedAddress}
                     </Text>
                     <Text
                        style={{
                           fontSize: 10,
                           padding: "0px 8px",
                        }}
                     >
                        เบอร์โทร {delivery.mobile}
                     </Text>
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
                                 display: "flex",
                                 paddingLeft: "16px",
                                 paddingVertical: 2,
                                 color: "#F31260",
                                 backgroundColor: "#FEE7EF",
                                 alignItems: "center",
                                 borderRadius: 4,
                              }}
                           >
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
