"use client"
import { listBooksAction } from '@/lib/actions/book.actions'
import { addBookToLessonAction, addDocumentToLesson, addPreExamToLessonAction } from '@/lib/actions/lesson.actions'
import { listPreExamAction } from '@/lib/actions/pre-exam.actions'
import { listSheetsAction } from '@/lib/actions/sheet.action'
import { renderBookName } from '@/lib/util'
import Alert from '@/ui/alert'
import { Autocomplete, AutocompleteItem, Button, Image, Modal, ModalContent } from '@nextui-org/react'
import { DocumentBook } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { ClipboardSignature, ScrollText, X } from 'lucide-react'
import React, { Key, useMemo, useState } from 'react'

const AddDocumentToLesson = ({
  open,
  onConfirm,
  onClose,
  lessonId,
}:{
  open: boolean,
  onConfirm: (type: string) => void,
  onClose: () => void,
  lessonId?: number,
}) => {
  // const { data: sheetList, refetch: refetchSheet} = useQuery({
  //   queryKey: ['listSheetsAction', 'add'],
  //   queryFn: () => listSheetsAction(),
  //   // enabled: lessonId !== undefined,
  // })
  // const {data: bookList, refetch: refetchBook } = useQuery({
  //   queryKey: ["listBooksAction", 'add'],
  //   queryFn: () => listBooksAction(),
  //   // enabled: lessonId !== undefined,
  // })
  // const {data: preExamList, refetch: refetchPreExam} = useQuery({
  //   queryKey: ["listPreExamAction", 'add'],
  //   queryFn: () => listPreExamAction(),
  //   // enabled: lessonId !== undefined,
  // })
  const [sheetList, setSheetList] = useState<Awaited<ReturnType<typeof listSheetsAction>>>()
  const [bookList, setBookList] = useState<Awaited<ReturnType<typeof listBooksAction>>>()
  const [preExamList, setPreExamList] = useState<Awaited<ReturnType<typeof listPreExamAction>>>()
  const [selectedDocument, setSelectedDocument] = useState<string | undefined>()
  const [error, setError] = useState({
    isError: false,
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const setup = async () => {
    const responseSheet = await listSheetsAction()
    const responseBook = await listBooksAction()
    const responsePreExam = await listPreExamAction()
    setSheetList(responseSheet)
    setBookList(responseBook)
    setPreExamList(responsePreExam)
  }

  useMemo(() => {
    if(open){
      setup()
    }
  }, [open])

  const documentList = useMemo(() => {
    console.log('bookList', bookList);
    console.log('sheetList', sheetList);
    console.log('preExamList', preExamList);
    
    if(!sheetList || !bookList || !preExamList) {
      return []
    }
    return [ ...sheetList.map(sheet => ({...sheet, type: 'sheet'})), ...bookList.map(book => ({...book, type: 'book'})), ...preExamList.map(preExam => ({...preExam, type: 'preExam'}))]
  }, [sheetList, bookList, preExamList])

  const handleOnClose = () => {
    setSelectedDocument(undefined)
    setError({
      isError: false,
      message: "",
    })
    onClose()
  }

  const handleOnChangeDocument = (key: Key | null) => {
    if(!key){
      setSelectedDocument(undefined)
      return
    }
    setSelectedDocument(key.toString())
  }

  const handleOnConfirm = async () => {
    try {
      if(!selectedDocument){
        setError({
          isError: true,
          message: "โปรดเลือกเอกสารที่คุณต้องการเพิ่ม"
        })
        return
      }
      if(!lessonId){
        throw "lessonId is undefined"
      }
      const [id, type] = selectedDocument.split(":")
      setIsLoading(true)
      if(type === "sheet"){
        const response = await addDocumentToLesson(parseInt(id), lessonId)
        console.log("🚀 ~ submitAddDocumentToLesson ~ response:", response)
      }else if(type === "book"){
        const response = await addBookToLessonAction(parseInt(id), lessonId)
        console.log("🚀 ~ submitAddDocumentToLesson ~ response:", response)
      }else if(type === "preExam"){
        const response = await addPreExamToLessonAction(parseInt(id), lessonId)
        console.log("🚀 ~ submitAddDocumentToLesson ~ response:", response)
      }
      onConfirm(type)
      handleOnClose()
    } catch (error) {
      console.error(error)
      setError({
        isError: true,
        message: "เกิดข้อผิดพลาดบางอย่าง ดูเพิ่มเติมใน Console"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderStartContent = (document: any) => {
    if(document.type === "book"){
      return <Image width={16} className={`rounded`} src={document.image} alt="image book" />
    }
    else if(document.type === "sheet"){
      return <ScrollText size={16} />
    }
    else if(document.type === "preExam"){
      return <ClipboardSignature size={16} />
    }
    return <div></div>
  }

  const renderStartContentSelected = (selectedKey: string | undefined) => {
    if(!selectedKey){
      return <div></div>
    }
    const [id, type] = selectedKey.split(":")
    const document:any = documentList.find(document => (document.id === parseInt(id) && document.type === type))
    console.log("document", document);
    
    if(!document){
      return <div></div>
    }
    if(document.type === "book"){
      return (
        <div className={`w-7`}>
          <Image height={32} className={`rounded`} src={document.image} alt="image book" />
        </div>
      )
    }
    else if(document.type === "sheet"){
      return <ScrollText size={20} />
    }
    else if(document.type === "preExam"){
      return <ClipboardSignature size={20} />
    }
    return <div></div>
  }
  return (
    <Modal
    isOpen={open}
    closeButton={<></>}
    backdrop="blur"
    classNames={{
      backdrop: `bg-backdrop`,
    }}
    placement='top-center'
  >
    <ModalContent className={`p-app`} >
      <div className={`flex items-center`}>
        <div className={`flex-1`}></div>
        <div className={`flex-1 text-center text-3xl font-semibold font-IBM-Thai`}>เอกสาร</div>
        <div className={`flex-1 flex items-center justify-end`}>
            <Button onClick={handleOnClose} className={`min-w-0 w-8 max-w-8 max-h-8 bg-primary-foreground`} isIconOnly><X /></Button>
        </div>
      </div>
      {error.isError &&
        <div className={`mt-app`}>
          <Alert label={error.message} />
        </div>
      }
      <div className={`mt-app`}>
        <Autocomplete
          onSelectionChange={handleOnChangeDocument}
          startContent={renderStartContentSelected(selectedDocument)}
          className={`font-serif`}
          inputProps={{
            classNames: {
              input: ['text-[1em]'],
            }
          }}
          listboxProps={{
            className: 'font-serif',
          }}
        >
          {
            documentList?
            documentList?.sort((a, b) => {
              if(a.updatedAt! > b.updatedAt!){
                return -1
              }else if(a.updatedAt! < b.updatedAt!){
                return 1
              }
              return 0
            }).map((document, index) => {
              const book = document as DocumentBook
              const name = document.type === "book" ? renderBookName(book) : document.name
              return (
                <AutocompleteItem
                  className={`font-serif`}
                  key={`${document.id}:${document.type}`}
                  startContent={renderStartContent(document)}
                >
                  {name}
                </AutocompleteItem>
              )
            })
          : (
            <AutocompleteItem className={`font-serif`} key={`loading`}>
              loading...
            </AutocompleteItem>
          )}
        </Autocomplete>
      </div>
      <Button
        isLoading={isLoading}
        onClick={handleOnConfirm}
        className={`mt-[22px] bg-default-foreground text-primary-foreground font-IBM-Thai font-medium text-base`}
      >
        บันทึก
      </Button>
    </ModalContent>
  </Modal>
  )
}

export default AddDocumentToLesson