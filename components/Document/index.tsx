"use client";

import { modalProps } from "@/@type";
import { useEffect, useMemo, useState } from "react";
import FormDocument from "./form";
import TableDocument from "./table";
import AddBook from "./add_book.modal";
import BookInventory from "./inventory.book";
import EditInventory from "./inventory.book.edit";
import BookUsage from "./usage.book";
import {
   Button,
   Input,
   Modal,
   ModalContent,
   Pagination,
   Textarea,
} from "@nextui-org/react";
import { X } from "lucide-react";
import { addSheetAction, listSheetsAction } from "@/lib/actions/sheet.action";
import { useQuery } from "@tanstack/react-query";
import { getBookById, listBooksAction } from "@/lib/actions/book.actions";
import TableBooks from "./Book/Table";
import { DocumentBook, DocumentPreExam, DocumentSheet } from "@prisma/client";
import { addPreExamAction, listPreExamAction } from "@/lib/actions/pre-exam.actions";
import TablePreExam from "./PreExam/Table";
import EditBookModal from "./Book/EditBook.modal";
import _ from 'lodash'
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import EditSheeModal from "./Sheet/EditSheeModal";
import SheetUsage from "./Sheet/SheetUsage";
import PreExamUsage from "./PreExam/PreExamUsage";
import EditPreExamModal from "./PreExam/EditPreExamModal";

export type DocumentMode = "book" | "sheet" | "pre-exam";

const DocumentComp = ({
   bookItems,
   pageSize,
   currentPage,
   selectedBook,
}:{
   bookItems: Awaited<ReturnType<typeof listBooksAction>>,
   pageSize: number,
   currentPage: number,
   selectedBook: Awaited<ReturnType<typeof getBookById>> ,
}) => {
   const searchParams = useSearchParams()
   const pathName = usePathname()
   const route = useRouter()
   // const {
   //    data: bookListData,
   //    isLoading: isLoadingBook,
   //    refetch: refetchBook,
   // } = useQuery({
   //    queryKey: ["listBooksAction"],
   //    queryFn: () => listBooksAction(),
   //    // refetchOnWindowFocus: true,
   //    refetchOnMount: true,
   // })
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

   const [isOpenEditSheet, setIsOpenEditSheet] = useState(false)
   const [selectedSheet, setSelectedSheet] = useState<DocumentSheet | undefined>()

   const [isOpenAddDocumentSheet, setIsOpenAddDocumentSheet] = useState(false);
   const [documentName, setDocumentName] = useState<string | undefined>();
   const [documentLink, setDocumentLink] = useState<string | undefined>();
   
   const [isOpenAddDocumentPreExam, setIsOpenAddDocumentPreExam] = useState(false);
   const [preExamName, setPreExamName] = useState<string | undefined>();
   const [preExamLink, setPreExamLink] = useState<string | undefined>();
   
   const [selectedBookViewUsage, setSelectedBookViewUsage] = useState<DocumentBook | undefined>()
   const [courseList, setCourseList] = useState<any[]>([])

   const [searchBookText, setSearchBookText] = useState("")
   const [preSearchBookText, setPreSearchBookText] = useState("")
   const [searchSheetText, setSearchSheetText] = useState("")
   const [preSearchSheetText, setPreSearchSheetText] = useState("")
   const [searchPreExamText, setSearchPreExamText] = useState("")
   const [preSearchPreExamText, setPreSearchPreExamText] = useState("")
   
   const [page, setPage] = useState(1)
   // const [pageSize, setPageSize] = useState(30)
   const rowPerPage = 30

   const [isOpenSheetViewUsage, setIsOpenSheetViewUsage] = useState(false)

   const [isOpenPreExamViewUsage, setIsOpenPreExamViewUsage] = useState(false)
   const [selectedPreExam, setSelectedPreExam] = useState<DocumentPreExam | undefined>()
   const [isOpenEditPreExam, setIsOpenEditPreExam] = useState(false)
   
   // book search
   // const bookList = useMemo(() => {
   //    if(searchBookText !== ""){
   //       return bookListData?.filter(book => {
   //          return book.name.toLowerCase().includes(searchBookText.toLowerCase()) || book.term?.toLowerCase().includes(searchBookText.toLowerCase()) || book.year?.toLowerCase().includes(searchBookText.toLowerCase())
   //       })
   //    }
   //    return bookListData
   // }, [bookListData, searchBookText])
   const handleSearchBook = (value: string) => {
      setSearchBookText(value)
   }
   const debounceSearchBook = _.debounce(handleSearchBook, 500)
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
   const debounceSearchSheet = _.debounce(handleSearchSheet, 500)
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
   const debounceSearchPreExam = _.debounce(handleSearchPreExam, 500)
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
         // if(bookList){
         //    pageSize = Math.ceil(bookList.length / rowPerPage)
         // }
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
      
      // setPageSize(pageSize)
   // }, [documentMode, bookList, preExamList, sheetList])
   }, [documentMode, preExamList, sheetList])

   // const bookItems = useMemo(() => {
   //    const startIndex = (page - 1) * rowPerPage;
   //    const endIndex = startIndex + rowPerPage;
   //    return bookList?.slice(startIndex, endIndex)
   // }, [bookList, page])

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

   const handleOnClickEditBook = (book: DocumentBook) => {
      // setSelectedBook(book)
      // setIsOpenEditDocumentBook(true)
      const params = new URLSearchParams(searchParams.toString())
      params.set('documentId', `${book.id}`)
      params.set(`edit`, 'true')
      route.replace(`/document?${params.toString()}`)
      // const newPath = `${pathName}?bookId=${book.id}`;
      // window.history.replaceState(null, "", newPath);
   }

   const handleOnCloseEditBook = () => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete(`documentId`)
      params.delete(`edit`)
      route.replace(`/document?${params.toString()}`)
      // setIsOpenEditDocumentBook(false)
      // setTimeout(() => {
      //    setSelectedBook(undefined)
      // }, 250);
      // replacePath()
   }

   useEffect(() => {
      const isEdit = searchParams.get('edit') === 'true'
      if(isEdit){
         setIsOpenEditDocumentBook(true)
      }else{
         setIsOpenEditDocumentBook(false)
      }
   }, [searchParams.get('documentId'), searchParams.get('edit')])

   const replacePath = () => {
      const newPath = `/document`;
      window.history.replaceState(null, "", newPath);
   };

   // useMemo(() => {
   //    if(bookListData){
   //       const bookId = searchParams.get('bookId')
   //       if(!bookId) return
   //       const book = bookListData.find(book => book.id === parseInt(bookId))
   //       if(!book)return
   //       handleOnClickEditBook(book)
   //    }
   // }, [searchParams.get('bookId'), bookListData])

   const handleOnClickEditSheet = (sheet: DocumentSheet) => {
      setSelectedSheet(sheet)
      setIsOpenEditSheet(true)
   }

   const handleOnOpenSheetViewUsage = (courseList: any[], sheet: DocumentSheet) => {
      setIsOpenSheetViewUsage(true)
      setSelectedSheet(sheet)
      setCourseList(courseList)
   }

   const handleOnCloseSheetViewUsage = () => {
      setIsOpenSheetViewUsage(false)
      setSelectedSheet(undefined)
      setCourseList([])
   }

   const handleOnOpenPreExamViewUsage = (courseList: any[], preExam: DocumentPreExam) => {
      setIsOpenPreExamViewUsage(true)
      setSelectedPreExam(preExam)
      setCourseList(courseList)
   }

   const handleOnClosePreExamViewUsage = () => {
      setIsOpenPreExamViewUsage(false)
      setSelectedPreExam(undefined)
      setCourseList([])
   }

   const handleOnClickEditPreExam = (preExam: DocumentPreExam) => {
      setSelectedPreExam(preExam)
      setIsOpenEditPreExam(true)
   }

   useMemo(() => {
      const isAdd = searchParams.get('add') === 'true'
      if(isAdd){
         setIsAddDocumentBook(true)
      }else{
         setIsAddDocumentBook(false)
      }
   }, [searchParams.get('add')])

   return (
      <div className="relative flex flex-col">
         <BookInventory
            open={isInventory}
            onClose={() => {
               // setIsInventory(false)
               const params = new URLSearchParams(searchParams.toString())
               // params.delete(`stock`)
               params.delete(`stockBookId`)
               route.replace(`/document?${params.toString()}`)
            }}
            onEditStock={() => setIsEditStock(true)}
            book={selectedBook ?? undefined}
         />
         <EditInventory
            open={isEditStock}
            onClose={() => setIsEditStock(false)}
            book={selectedBook}
         />
         <AddBook
            open={isAddDocumentBook}
            // onClose={() => setIsAddDocumentBook(false)}
            onClose={() => {
               const params = new URLSearchParams(searchParams.toString())
               params.delete('add')
               route.replace(`/document?${params.toString()}`)
            }}
         />
         {selectedBook &&
            <EditBookModal
               open={isOpenEditDocumentBook}
               selectedBook={selectedBook}
               onClose={handleOnCloseEditBook}
            />
         }
         {isOpenEditSheet &&
            <EditSheeModal
               isOpen={isOpenEditSheet}
               sheet={selectedSheet}
               onClose={() => {
                  setIsOpenEditSheet(false)
               }}
               onSuccess={refetchSheets}
            />
         }
         {isOpenEditPreExam &&
            <EditPreExamModal
               isOpen={isOpenEditPreExam}
               preExam={selectedPreExam}
               onClose={() => {
                  setIsOpenEditPreExam(false)
               }}
               onSuccess={refetchPreExam}
            />
         }
         {/* <ConfirmBook open={isDelete} onClose={() => setIsDelete(false)} /> */}
         <BookUsage courseList={courseList} book={selectedBookViewUsage} open={isViewUsage} onClose={() => setIsViewUsage(false)} />
         <SheetUsage
            open={isOpenSheetViewUsage}
            courseList={courseList}
            sheet={selectedSheet}
            onClose={handleOnCloseSheetViewUsage}
         />
         <PreExamUsage
            open={isOpenPreExamViewUsage}
            courseList={courseList}
            preExam={selectedPreExam}
            onClose={handleOnClosePreExamViewUsage}
         />
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
                     className={`font-serif`}
                     classNames={{
                        input: `text-[1em]`,
                        inputWrapper: ['rounded-lg']
                     }}
                  />
                  <div id="textarea-wrapper">
                     <Textarea
                        classNames={{
                           input: `text-[1em]`,
                           inputWrapper: ['rounded-lg']
                        }}
                        minRows={1}
                        placeholder={`Link`}
                        aria-label={`Link`}
                        className={`mt-2 font-serif ${!documentLink ? `` : `underline`}`}
                        onChange={(e) => setDocumentLink(e.target.value)}
                     />
                  </div>
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
                     aria-label={`ชื่อเอกสาร preExam`}
                     onChange={(e) => setPreExamName(e.target.value)}
                     className={`font-serif`}
                     classNames={{
                        input: 'text-[1em]'
                     }}
                  />
                  <div id="textarea-wrapper">
                     <Textarea
                        classNames={{
                           input: `text-[1em]`,
                        }}
                        minRows={1}
                        placeholder={`Link`}
                        aria-label={`Link`}
                        className={`mt-2 font-serif ${!preExamLink ? `` : `underline`}`}
                        onChange={(e) => setPreExamLink(e.target.value)}
                     />
                  </div>
               </div>
               <Button
                  onClick={submitPreExam}
                  className={`mt-[22px] bg-default-foreground text-primary-foreground font-IBM-Thai font-medium text-base`}
               >
                  บันทึก
               </Button>
            </ModalContent>
         </Modal>

         {/* <div className="font-sans text-3xl font-bold py-2 hidden md:block">
            {title}
         </div> */}
         {/* <FormDocument
            documentMode={documentMode}
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
               // if(documentMode === "book"){
               //    setPreSearchBookText(value)
               // }else if(documentMode === "sheet"){
               //    setPreSearchSheetText(value)
               // }else if(documentMode === "pre-exam"){
               //    setPreSearchPreExamText(value)
               // }
               console.log("value", value);
               
               const params = new URLSearchParams(searchParams.toString())
               params.set('page', '1')
               if(value){
                  params.set('search', value)
               }else{
                  params.delete('search')
               }
               route.replace(`/document?${params.toString()}`)
            }}
         /> */}
         <div className="flex-1">
            {documentMode === "book" &&
               <TableBooks
                  isLoading={false}
                  booksList={bookItems}
                  onEditBook={handleOnClickEditBook}
                  onViewStock={(book) => {
                     // console.log("onViewStock");
                     // setIsInventory(true)
                     // setSelectedBook(book)
                     const params = new URLSearchParams(searchParams.toString())
                     params.set(`stockBookId`, `${book.id}`)
                     route.push(`/document?${params.toString()}`)
                     // route.push(`/document?stockBookId=${book.id}`)
                  }}
                  onViewUsage={(courseLise, book) => {
                     console.log("onViewUsage");
                     setIsViewUsage(true)
                     setCourseList(courseLise)
                     setSelectedBookViewUsage(book)
                  }}
               />
            }
            {documentMode === "sheet" &&
               <TableDocument
                  documentList={sheetItems}
                  onEditSheet={handleOnClickEditSheet}
                  onViewUsage={handleOnOpenSheetViewUsage}
               />
            }
            {documentMode === "pre-exam" &&
               <TablePreExam
                  onViewUsage={handleOnOpenPreExamViewUsage}
                  // preExamList={preExamList}
                  preExamList={preExamItems}
                  onEditPreExam={handleOnClickEditPreExam}
               />
            }
         </div>
         {/* <div className="flex w-full justify-center my-[14px]">
            <Pagination
               classNames={{
                  cursor: "bg-default-foreground",
               }}
               className={`font-serif`}
               aria-label="pagination-document"
               showShadow
               color="primary"
               // page={page}
               page={currentPage}
               total={pageSize}
               // onChange={(page) => setPage(page)}
               onChange={(page) => {
                  const params = new URLSearchParams(searchParams.toString())
                  params.set('page', page.toString())
                  route.replace(`/document?${params.toString()}`)
               }}
            />
         </div> */}
      </div>
   );
};

export default DocumentComp;
