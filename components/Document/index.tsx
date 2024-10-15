"use client";

import { modalProps } from "@/@type";
import { useMemo, useState } from "react";
import FormDocument from "./form";
import TableDocument from "./table";
import AddBook from "./add_book.modal";
import ConfirmBook from "./confirm.book";
import BookInventory from "./inventory.book";
import EditInventory from "./inventory.book.edit";
import BookUsage from "./usage.book";
import { Button, Input, Modal, ModalContent } from "@nextui-org/react";
import { X } from "lucide-react";
import { addDocumentAction, listDocument } from "@/lib/actions/document.action";
import { useQuery } from "@tanstack/react-query";

export type DocumentMode = "book" | "document" | "pre-exam"

const DocumentComp = () => {
   const {
      data: documentList,
      refetch: refetchDocument,
   } = useQuery({
      queryKey: ['listDocument'],
      queryFn: () => listDocument()
   })

   const [selectState, setSelectState] = useState<modalProps>({
      open: false,
      data: undefined,
   });
   // console.log(selectState);
   const [isInventory, setIsInventory] = useState(false)
   const [isAddDocument, setIsAddDocument] = useState(false)
   const [isEditStock, setIsEditStock] = useState(false)
   const [isDelete, setIsDelete] = useState(false)
   const [isViewUsage, setIsViewUsage] = useState(false)
   const [documentMode, setDocumentMode] = useState<DocumentMode>("book")

   const [isOpenAddDocumentSheet, setIsOpenAddDocumentSheet] = useState(false)
   // const [documentList, setDocumentList] = useState()
   const [documentName, setDocumentName] = useState<string | undefined>()
   const [documentLink, setDocumentLink] = useState<string | undefined>()
   
   const title = useMemo(() => {
      switch (documentMode) {
         case "book":
            return "หนังสือ"
         case "document":
            return "เอกสาร"
         case "pre-exam":
            return "Pre-exam"
         default:
            return ""
      }
   }, [documentMode])

   const handleOnChangeDocumentMode = (mode: DocumentMode) => {
      setDocumentMode(mode)
   }

   const submitDocument = async () => {
      console.log("boom");
      console.table({
         documentName,
         documentLink,
      })
      if(!documentName || !documentLink) return
      const response = await addDocumentAction(documentName, documentLink)
      console.log(response);
      if(!response) {
         console.error('response is undefiend Document/index:63');
      }
      setIsOpenAddDocumentSheet(false)
      refetchDocument()
   }

   return (
      <div className="relative pt-6 px-app">
         <BookInventory
            open={isInventory}
            onClose={() => setIsInventory(false)}
            onEditStock={() => setIsEditStock(true)}
         />
         <EditInventory
            open={isEditStock}
            onClose={() => setIsEditStock(false)}
         />
         <AddBook
            open={isAddDocument}
            onClose={() => setIsAddDocument(false)}
            onDelete={() => setIsDelete(true)}
         />
         <ConfirmBook
            open={isDelete}
            onClose={() => setIsDelete(false)}
         />
         <BookUsage
            open={isViewUsage}
            onClose={() => setIsViewUsage(false)}
         />
         <Modal
            isOpen={isOpenAddDocumentSheet}
            closeButton={<></>}
            backdrop="blur"
            classNames={{
               backdrop: `bg-backdrop`,
            }}
         >
            <ModalContent
               className={`p-app`}
            >
               <div className={`flex items-center`}>
                  <div className={`flex-1`}></div>
                  <div className={`flex-1 text-center text-3xl font-semibold font-IBM-Thai`}>เอกสาร</div>
                  <div className={`flex-1 flex items-center justify-end`}>
                     <Button onClick={() => setIsOpenAddDocumentSheet(false)} className={`min-w-0 w-8 max-w-8 max-h-8 bg-primary-foreground`} isIconOnly><X /></Button>
                  </div>
               </div>
               <div className={`mt-app`}>
                  <Input
                     placeholder={`ชื่อเอกสาร`}
                     aria-label={`ชื่อเอกสาร`}
                     onChange={(e) => setDocumentName(e.target.value)}
                  />
                  <Input
                     placeholder={`Link`}
                     aria-label={`Link`}
                     className={`mt-2`}
                     onChange={(e) => setDocumentLink(e.target.value)}
                  />
               </div>
               <Button
                  onClick={submitDocument}
                  className={`mt-[22px] bg-default-foreground text-primary-foreground font-IBM-Thai font-medium text-base`}
               >
                  บันทึก
               </Button>
            </ModalContent>
         </Modal>

         <div className="font-IBM-Thai text-3xl font-bold py-2 hidden md:block">
            {title}
         </div>
         <FormDocument
            onAddDocument={() => {
               if(documentMode === "document"){
                  setIsOpenAddDocumentSheet(true)
                  return
               }
               setIsAddDocument(true)
            }}
            onChangeMode={handleOnChangeDocumentMode}
         />
         <div className="flex-1 px-2">
            <TableDocument
               documentList={documentList}
               onViewStock={() => setIsInventory(true)}
               onEditBook={() => setIsAddDocument(true)}
               onViewUsage={() => setIsViewUsage(true)}
            />
            <div className="flex w-full justify-center my-[14px]">
               <Pagination
                  classNames={{
                     cursor: "bg-default-foreground",
                  }}
                  showShadow
                  color="primary"
                  page={1}
                  total={10}
                  // onChange={(page) => setPage(page)}
               />
            </div>
         </div>
      </div>
   );
};

export default DocumentComp;
