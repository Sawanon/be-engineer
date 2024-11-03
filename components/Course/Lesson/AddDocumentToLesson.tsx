import { listBooksAction } from '@/lib/actions/book.actions'
import { addBookToLessonAction, addDocumentToLesson, addPreExamToLessonAction } from '@/lib/actions/lesson.actions'
import { listPreExamAction } from '@/lib/actions/pre-exam.actions'
import { listSheetsAction } from '@/lib/actions/sheet.action'
import Alert from '@/ui/alert'
import { Autocomplete, AutocompleteItem, Button, Image, Modal, ModalContent } from '@nextui-org/react'
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
  onConfirm: () => void,
  onClose: () => void,
  lessonId?: number,
}) => {
  const { data: sheetList } = useQuery({
    queryKey: ['listSheetsAction'],
    queryFn: () => listSheetsAction(),
    enabled: lessonId !== undefined,
  })
  const {data: bookList} = useQuery({
    queryKey: ["listBooksAction"],
    queryFn: () => listBooksAction(),
    enabled: lessonId !== undefined,
  })
  const {data: preExamList} = useQuery({
    queryKey: ["listPreExamAction"],
    queryFn: () => listPreExamAction(),
    enabled: lessonId !== undefined,
  })
  const [selectedDocument, setSelectedDocument] = useState<string | undefined>()
  const [error, setError] = useState({
    isError: false,
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const documentList = useMemo(() => {
    if(!sheetList || !bookList || !preExamList) return []
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
      onConfirm()
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
    const document:any = documentList.find(document => document.type === type)
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
        >
          {
            documentList?
            documentList?.map((document, index) => {
            return (
              <AutocompleteItem
                key={`${document.id}:${document.type}`}
                startContent={renderStartContent(document)}
              >
                {document.name}
              </AutocompleteItem>
            )
          })
        : (
          <AutocompleteItem key={`loading`}>
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