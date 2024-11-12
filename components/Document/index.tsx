"use client";

import { modalProps } from "@/@type";
import { useEffect, useMemo, useState } from "react";
import FormDocument from "./form";
import TableDocument from "./table";
import AddBook from "./add_book.modal";
import ConfirmBook from "./confirm.book";
import BookInventory from "./inventory.book";
import EditInventory from "./inventory.book.edit";
import BookUsage from "./usage.book";
import {
   Button,
   Input,
   Modal,
   ModalContent,
   Pagination,
} from "@nextui-org/react";
import { X } from "lucide-react";
import { addSheetAction, listSheetsAction } from "@/lib/actions/sheet.action";
import { useQuery } from "@tanstack/react-query";
import { listBooksAction } from "@/lib/actions/book.actions";
import TableBooks from "./Book/Table";
import { DocumentBook } from "@prisma/client";
import { addPreExamAction, listPreExamAction } from "@/lib/actions/pre-exam.actions";
import TablePreExam from "./PreExam/Table";
import EditBookModal from "./Book/EditBook.modal";
import _ from 'lodash'

export type DocumentMode = "book" | "sheet" | "pre-exam";

const DocumentComp = () => {
   const {
      data: bookListData,
      isLoading: isLoadingBook,
   } = useQuery({
      queryKey: ["listBooksAction"],
      queryFn: () => listBooksAction(),
      refetchOnWindowFocus: true,
   })
   const { data: sheetListData, refetch: refetchSheets } = useQuery({
      queryKey: ["listSheetsAction"],
      queryFn: () => listSheetsAction(),
      refetchOnWindowFocus: true,
   });
   const {data: preExamListData, refetch: refetchPreExam} = useQuery({
      queryKey: ["listPreExamAction"],
      queryFn: () => listPreExamAction(),
      refetchOnWindowFocus: true,
   })

   const [isInventory, setIsInventory] = useState(false);
   const [isAddDocumentBook, setIsAddDocumentBook] = useState(false);
   const [isOpenEditDocumentBook, setIsOpenEditDocumentBook] = useState(false);
   const [isEditStock, setIsEditStock] = useState(false);
   const [isDelete, setIsDelete] = useState(false);
   const [isViewUsage, setIsViewUsage] = useState(false);
   const [documentMode, setDocumentMode] = useState<DocumentMode>("book");

   const [isOpenAddDocumentSheet, setIsOpenAddDocumentSheet] = useState(false);
   const [documentName, setDocumentName] = useState<string | undefined>();
   const [documentLink, setDocumentLink] = useState<string | undefined>();
   
   const [isOpenAddDocumentPreExam, setIsOpenAddDocumentPreExam] = useState(false);
   const [preExamName, setPreExamName] = useState<string | undefined>();
   const [preExamLink, setPreExamLink] = useState<string | undefined>();
   
   const [selectedBook, setSelectedBook] = useState<DocumentBook | undefined>()
   const [courseList, setCourseList] = useState<any[]>([])

   const [searchBookText, setSearchBookText] = useState("")
   const [preSearchBookText, setPreSearchBookText] = useState("")
   const [searchSheetText, setSearchSheetText] = useState("")
   const [preSearchSheetText, setPreSearchSheetText] = useState("")
   const [searchPreExamText, setSearchPreExamText] = useState("")
   const [preSearchPreExamText, setPreSearchPreExamText] = useState("")
   
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(30)
   const rowPerPage = 30
   
   // book search
   const bookList = useMemo(() => {
      if(searchBookText !== ""){
         return bookListData?.filter(book => {
            return book.name.toLowerCase().includes(searchBookText.toLowerCase()) || book.term?.toLowerCase().includes(searchBookText.toLowerCase()) || book.year?.toLowerCase().includes(searchBookText.toLowerCase())
         })
      }
      return bookListData
   }, [bookListData, searchBookText])
   const handleSearchBook = (value: string) => {
      setSearchBookText(value)
   }
   const debounceSearchBook = _.debounce(handleSearchBook, 2000)
   useEffect(() => {
      debounceSearchBook(preSearchBookText)
      return () => {
         debounceSearchBook.cancel()
      }
   }, [preSearchBookText])
   // book search
   // sheet search
   const sheetList = useMemo(() => {
      if(searchSheetText !== ""){
         return sheetListData?.filter(sheet => {
            return sheet.name.toLowerCase().includes(searchSheetText.toLowerCase())
         })
      }
      return sheetListData
   }, [sheetListData, searchSheetText])
   const handleSearchSheet = (value: string) => {
      setSearchSheetText(value)
   }
   const debounceSearchSheet = _.debounce(handleSearchSheet, 2000)
   useEffect(() => {
      debounceSearchSheet(preSearchSheetText)
      return () => {
         debounceSearchSheet.cancel()
      }
   }, [preSearchSheetText])
   // sheet search
   // pre-exam search
   const preExamList = useMemo(() => {
      if(searchPreExamText !== ""){
         return preExamListData?.filter(preExam => {
            return preExam.name.toLowerCase().includes(searchPreExamText.toLowerCase())
         })
      }
      return preExamListData
   }, [preExamListData, searchPreExamText])
   const handleSearchPreExam = (value: string) => {
      setSearchPreExamText(value)
   }
   const debounceSearchPreExam = _.debounce(handleSearchPreExam, 2000)
   useEffect(() => {
      debounceSearchPreExam(preSearchPreExamText)
      return () => {
         debounceSearchPreExam.cancel()
      }
   }, [preSearchPreExamText])
   // pre-exam search
   
   useMemo(() => {
      let pageSize = 1
      if(documentMode === "book"){
         if(bookList){
            pageSize = Math.ceil(bookList.length / rowPerPage)
         }
      }else if(documentMode === "pre-exam"){
         if(preExamList){
            pageSize = Math.ceil(preExamList.length / rowPerPage)
         }
      }else if(documentMode === "sheet"){
         if(sheetList){
            pageSize = Math.ceil(sheetList.length / rowPerPage)
         }
      }
      console.log(pageSize);
      
      setPageSize(pageSize)
   }, [documentMode, bookList, preExamList, sheetList])

   const bookItems = useMemo(() => {
      const startIndex = (page - 1) * rowPerPage;
      const endIndex = startIndex + rowPerPage;
      return bookList?.slice(startIndex, endIndex)
   }, [bookList, page])

   const sheetItems = useMemo(() => {
      const startIndex = (page - 1) * rowPerPage;
      const endIndex = startIndex + rowPerPage;
      return sheetList?.slice(startIndex, endIndex)
   }, [sheetList, page])

   const preExamItems = useMemo(() => {
      const startIndex = (page - 1) * rowPerPage;
      const endIndex = startIndex + rowPerPage;
      return preExamList?.slice(startIndex, endIndex)
   }, [preExamList, page])

   const title = useMemo(() => {
      switch (documentMode) {
         case "book":
            return "หนังสือ";
         case "sheet":
            return "เอกสาร";
         case "pre-exam":
            return "Pre-exam";
         default:
            return "";
      }
   }, [documentMode]);

   const handleOnChangeDocumentMode = (mode: DocumentMode) => {
      setDocumentMode(mode);
   };

   const submitDocument = async () => {
      console.log("boom");
      console.table({
         documentName,
         documentLink,
      });
      if (!documentName || !documentLink) return;
      const response = await addSheetAction(documentName, documentLink);
      console.log(response);
      if (!response) {
         console.error("response is undefiend Document/index:89");
      }
      setIsOpenAddDocumentSheet(false);
      refetchSheets();
   };

   const submitPreExam = async () => {
      if(!preExamName || !preExamLink) return
      const repsonse = await addPreExamAction({
         name: preExamName,
         url: preExamLink,
      })
      if(!repsonse){
         console.error(`response is undefined Document/index:102`)
         return
      }
      setIsOpenAddDocumentPreExam(false)
      refetchPreExam()
   }

   return (
      <div className="relative pt-6 px-app h-screenDevice flex flex-col">
         <BookInventory
            open={isInventory}
            onClose={() => setIsInventory(false)}
            onEditStock={() => setIsEditStock(true)}
            book={selectedBook}
         />
         <EditInventory
            open={isEditStock}
            onClose={() => setIsEditStock(false)}
            book={selectedBook}
         />
         <AddBook
            open={isAddDocumentBook}
            onClose={() => setIsAddDocumentBook(false)}
         />
         {selectedBook &&
            <EditBookModal
               open={isOpenEditDocumentBook}
               selectedBook={selectedBook}
               onClose={() => {
                  setIsOpenEditDocumentBook(false)
                  setTimeout(() => {
                     setSelectedBook(undefined)
                  }, 250);
               }}
            />
         }
         {/* <ConfirmBook open={isDelete} onClose={() => setIsDelete(false)} /> */}
         <BookUsage courseList={courseList} book={selectedBook} open={isViewUsage} onClose={() => setIsViewUsage(false)} />
         <Modal
            isOpen={isOpenAddDocumentSheet}
            closeButton={<></>}
            backdrop="blur"
            classNames={{
               backdrop: `bg-backdrop`,
            }}
         >
            <ModalContent className={`p-app`}>
               <div className={`flex items-center`}>
                  <div className={`flex-1`}></div>
                  <div
                     className={`flex-1 text-center text-3xl font-semibold font-IBM-Thai`}
                  >
                     เอกสาร
                  </div>
                  <div className={`flex-1 flex items-center justify-end`}>
                     <Button
                        onClick={() => setIsOpenAddDocumentSheet(false)}
                        className={`min-w-0 w-8 max-w-8 max-h-8 bg-primary-foreground`}
                        isIconOnly
                     >
                        <X />
                     </Button>
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
         <Modal
            isOpen={isOpenAddDocumentPreExam}
            closeButton={<></>}
            backdrop="blur"
            classNames={{
               backdrop: `bg-backdrop`,
            }}
         >
            <ModalContent className={`p-app`}>
               <div className={`flex items-center`}>
                  <div className={`flex-1`}></div>
                  <div
                     className={`flex-1 text-center text-3xl font-semibold font-IBM-Thai`}
                  >
                     Pre-exam
                  </div>
                  <div className={`flex-1 flex items-center justify-end`}>
                     <Button
                        onClick={() => setIsOpenAddDocumentPreExam(false)}
                        className={`min-w-0 w-8 max-w-8 max-h-8 bg-primary-foreground`}
                        isIconOnly
                        aria-label="addPreExam-button"
                     >
                        <X />
                     </Button>
                  </div>
               </div>
               <div className={`mt-app`}>
                  <Input
                     placeholder={`Dynamics (CU) - Pre-midterm 2/2565`}
                     aria-label={`ชื่อเอกสาร`}
                     onChange={(e) => setPreExamName(e.target.value)}
                  />
                  <Input
                     placeholder={`Link`}
                     aria-label={`Link`}
                     className={`mt-2`}
                     onChange={(e) => setPreExamLink(e.target.value)}
                  />
               </div>
               <Button
                  onClick={submitPreExam}
                  className={`mt-[22px] bg-default-foreground text-primary-foreground font-IBM-Thai font-medium text-base`}
               >
                  บันทึก
               </Button>
            </ModalContent>
         </Modal>

         <div className="font-sans text-3xl font-bold py-2 hidden md:block">
            {title}
         </div>
         <FormDocument
            className={`py-2`}
            onAddDocument={() => {
               if (documentMode === "sheet") {
                  setIsOpenAddDocumentSheet(true);
                  return;
               }else if(documentMode === "pre-exam"){
                  setIsOpenAddDocumentPreExam(true)
                  return
               }
               setIsAddDocumentBook(true);
            }}
            onChangeMode={handleOnChangeDocumentMode}
            onChangeSearch={(value) => {
               if(documentMode === "book"){
                  setPreSearchBookText(value)
               }else if(documentMode === "sheet"){
                  setPreSearchSheetText(value)
               }else if(documentMode === "pre-exam"){
                  setPreSearchPreExamText(value)
               }
               console.log("value", value);
            }}
         />
         <div className="flex-1">
            {documentMode === "book" &&
               <TableBooks
                  isLoading={isLoadingBook}
                  booksList={bookItems}
                  onEditBook={(book) => {
                     console.log("onEditBook");
                     setSelectedBook(book)
                     setIsOpenEditDocumentBook(true)
                  }}
                  onViewStock={(book) => {
                     console.log("onViewStock");
                     setIsInventory(true)
                     setSelectedBook(book)
                  }}
                  onViewUsage={(courseLise, book) => {
                     console.log("onViewUsage");
                     setIsViewUsage(true)
                     setCourseList(courseLise)
                     setSelectedBook(book)
                  }}
               />
            }
            {documentMode === "sheet" &&
               <TableDocument
                  documentList={sheetItems}
                  onViewStock={() => setIsInventory(true)}
                  onEditBook={() => setIsAddDocumentBook(true)}
                  onViewUsage={() => setIsViewUsage(true)}
               />
            }
            {documentMode === "pre-exam" &&
               <TablePreExam
                  onViewUsage={() => {
                     console.log("asd");
                  }}
                  // preExamList={preExamList}
                  preExamList={preExamItems}
               />
            }
         </div>
         <div className="flex w-full justify-center my-[14px]">
            <Pagination
               classNames={{
                  cursor: "bg-default-foreground",
               }}
               aria-label="pagination-document"
               showShadow
               color="primary"
               page={page}
               total={pageSize}
               onChange={(page) => setPage(page)}
            />
         </div>
      </div>
   );
};

export default DocumentComp;
