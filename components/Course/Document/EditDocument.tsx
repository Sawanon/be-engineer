import { listBooksAction } from '@/lib/actions/book.actions'
import { listPreExamAction } from '@/lib/actions/pre-exam.actions'
import { listSheetsAction } from '@/lib/actions/sheet.action'
import Alert from '@/ui/alert'
import { Autocomplete, AutocompleteItem, Button, Image, Modal, ModalContent } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ClipboardSignature, ScrollText, X } from 'lucide-react'
import React, { Key, useMemo, useState } from 'react'
import DisconnectDocument from './DisconnectDocument'
import { updateBookInLesson } from '@/lib/actions/lesson.actions'

const EditDocument = ({
  isOpen,
  onClose,
  onConfirm,
  lessonId,
  document,
}:{
  isOpen: boolean,
  onClose: () => void,
  onConfirm: (type: string) => void,
  lessonId?: number,
  document: any,
}) => {
  const { data: sheetList, refetch: refetchSheets } = useQuery({
    queryKey: ['listSheetsAction'],
    queryFn: () => listSheetsAction(),
    // enabled: lessonId !== undefined,
  })
  const {data: bookList, refetch: refetchBooks} = useQuery({
    queryKey: ["listBooksAction"],
    queryFn: () => listBooksAction(),
    // enabled: lessonId !== undefined,
  })
  const {data: preExamList, refetch: refetchPreExam} = useQuery({
    queryKey: ["listPreExamAction"],
    queryFn: () => listPreExamAction(),
    // enabled: lessonId !== undefined,
  })
  const [selectedDocument, setSelectedDocument] = useState<string | undefined>()
  const [error, setError] = useState({
    isError: false,
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenDisconnect, setIsOpenDisconnect] = useState(false)

  const documentList = useMemo(() => {
    if(!sheetList || !bookList || !preExamList) return []
    return [ ...sheetList.map(sheet => ({...sheet, type: 'sheet'})), ...bookList.map(book => ({...book, type: 'book'})), ...preExamList.map(preExam => ({...preExam, type: 'preExam'}))]
  }, [sheetList, bookList, preExamList])

  // useMemo(() => {
  //   if(documentList.length === 0){
  //     refetchBooks()
  //     refetchSheets()
  //     refetchPreExam()
  //   }
  // }, [documentList])

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
          message: "โปรดเลือกเอกสารที่คุณต้องการเปลี่ยน"
        })
        return
      }
      if(!lessonId){
        throw "lessonId is undefined"
      }
      const [id, type] = selectedDocument.split(":")
      console.log(id, type);
      setIsLoading(true)
      const oldDocumentId = getId(document)
      if(type === "sheet"){
        // const response = await addDocumentToLesson(parseInt(id), lessonId)
        // console.log("🚀 ~ submitAddDocumentToLesson ~ response:", response)
      }else if(type === "book"){
        // const oldBookId = document.DocumentBook.id
        // console.log("old book", oldBookId);
        // console.log("new book", id);
        // return
        const response = await updateBookInLesson(oldDocumentId, parseInt(id), lessonId)
        console.log("🚀 ~ submitAddDocumentToLesson ~ response:", response)
      }else if(type === "preExam"){
        // const response = await addPreExamToLessonAction(parseInt(id), lessonId)
        // console.log("🚀 ~ submitAddDocumentToLesson ~ response:", response)
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

  const handleOnDisconnect = () => {
    setIsOpenDisconnect(true)
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
    let documentSelect:any
    if(!selectedKey){
      const id = getId(document)
      documentSelect = documentList.find(_document => (_document.id === parseInt(id) && _document.type === document.type))
      // return <div></div>
    }else{
      const [id, type] = selectedKey.split(":")
      documentSelect = documentList.find(document => (document.id === parseInt(id) && document.type === type))
      console.log("document", documentSelect);
    }
    
    if(!documentSelect){
      return <div></div>
    }
    if(documentSelect.type === "book"){
      return (
        <div className={`w-7`}>
          <Image height={32} className={`rounded`} src={documentSelect.image} alt="image book" />
        </div>
      )
    }
    else if(documentSelect.type === "sheet"){
      return <ScrollText size={20} />
    }
    else if(documentSelect.type === "preExam"){
      return <ClipboardSignature size={20} />
    }
    return <div></div>
  }

  const getId = (document?: any) => {
    if(!document) return
    if(document.type === "book"){
      return document.DocumentBook.id
     }
     else if(document.type === "sheet"){
       return document.DocumentSheet.id
     }
     else if(document.type === "preExam"){
       return document.DocumentPreExam.id
     }
  }

  const renderKey = (document?: any) => {
    if(!document) return ""
    if(document.type === "book"){
     return `${document.DocumentBook.id}:${document.type}`
    }
    else if(document.type === "sheet"){
      return `${document.DocumentSheet.id}:${document.type}`
    }
    else if(document.type === "preExam"){
      return `${document.DocumentPreExam.id}:${document.type}`
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      closeButton={<></>}
      backdrop="blur"
      classNames={{
        backdrop: `bg-backdrop`,
      }}
      scrollBehavior='inside'
      placement='top-center'
    >
      <ModalContent className={`p-app`} >
        {lessonId &&
          <DisconnectDocument
            isOpen={isOpenDisconnect}
            document={document}
            onClose={() => setIsOpenDisconnect(false)}
            lessonId={lessonId}
            onSuccess={(type) => {
              onConfirm(type)
              handleOnClose()
            }}
          />
        }
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
            // defaultSelectedKey={`${document?.id}:${document?.type}`}
            defaultSelectedKey={renderKey(document)}
            className={`font-serif`}
            selectorIcon={<ChevronDown size={24} />}
            disabledKeys={['loading']}
          >
            {
              documentList?
              documentList?.map((document, index) => {
              return (
                <AutocompleteItem
                  key={`${document.id}:${document.type}`}
                  startContent={renderStartContent(document)}
                  className={`font-serif`}
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
          className={`mt-app bg-default-foreground text-primary-foreground font-IBM-Thai font-medium text-base antialiased`}
        >
          บันทึก
        </Button>
        <Button
          disabled={isLoading}
          onClick={handleOnDisconnect}
          color='danger'
          variant='light'
          className={`mt-2 text-danger-500 font-sans font-medium text-base antialiased`}
        >
          เอาออก
        </Button>
      </ModalContent>
    </Modal>
  )
}

export default EditDocument