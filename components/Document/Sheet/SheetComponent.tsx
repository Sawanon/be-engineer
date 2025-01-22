"use client"
import { addSheetAction, listSheetActionPerPage, revalidateSheet } from '@/lib/actions/sheet.action'
import React, { useMemo, useState } from 'react'
import TableDocument from '../table'
import { DocumentSheet } from '@prisma/client'
import EditSheeModal from './EditSheeModal'
import SheetUsage from './SheetUsage'
import { Button, Input, Modal, ModalContent, Textarea } from '@nextui-org/react'
import { X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import AddSheetModal from './AddSheetModal'

const SheetComponent = ({
  sheetItems,
}:{
  sheetItems: Awaited<ReturnType<typeof listSheetActionPerPage>>
}) => {
  const searchParams = useSearchParams()
  const route = useRouter()
  const [selectedSheet, setSelectedSheet] = useState<DocumentSheet | undefined>()
  const [isOpenEditSheet, setIsOpenEditSheet] = useState(false)
  const [courseList, setCourseList] = useState<any[]>([])
  const [isOpenSheetViewUsage, setIsOpenSheetViewUsage] = useState(false)
  const [documentName, setDocumentName] = useState<string | undefined>();
  const [documentLink, setDocumentLink] = useState<string | undefined>();
  const [isOpenAddDocumentSheet, setIsOpenAddDocumentSheet] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const handleOnClickEditSheet = (sheet: DocumentSheet) => {
    setSelectedSheet(sheet)
    setIsOpenEditSheet(true)
  }

  const handleOnOpenSheetViewUsage = (courseList: any[], sheet: DocumentSheet) => {
    setIsOpenSheetViewUsage(true)
    setSelectedSheet(sheet)
    setCourseList(courseList)
  }

  const handleOnSuccess = async () => {
    try {
      revalidateSheet(`/document${location.search}`)
    } catch (error) {
      revalidateSheet()
    }
  }

  const handleOnCloseSheetViewUsage = () => {
    setIsOpenSheetViewUsage(false)
    setSelectedSheet(undefined)
    setCourseList([])
  }

  const submitDocument = async () => {
    try {
      console.log("boom");
      console.table({
         documentName,
         documentLink,
      });
      if (!documentName || !documentLink) return;
      setIsLoading(true)
      const response = await addSheetAction(documentName, documentLink);
      console.log(response);
      if (!response) {
         console.error("response is undefiend Document/index:89");
      }
      handleOnCloseAddSheet()
      handleOnSuccess()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  };

  useMemo(() => {
    const isAdd = searchParams.get('add') === 'true'
    if(isAdd){
      setIsOpenAddDocumentSheet(true)
    }else{
      setIsOpenAddDocumentSheet(false)
    }
  }, [searchParams.get('add')])

  const handleOnCloseAddSheet = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('add')
    route.replace(`/document?${params.toString()}`)
  }

  return (
    <div>
      <SheetUsage
        open={isOpenSheetViewUsage}
        courseList={courseList}
        sheet={selectedSheet}
        onClose={handleOnCloseSheetViewUsage}
      />
      {isOpenEditSheet &&
        <EditSheeModal
            isOpen={isOpenEditSheet}
            sheet={selectedSheet}
            onClose={() => {
              setIsOpenEditSheet(false)
            }}
            onSuccess={handleOnSuccess}
        />
      }
      <TableDocument
        documentList={sheetItems === undefined || typeof sheetItems === "string" ? undefined : sheetItems}
        onEditSheet={handleOnClickEditSheet}
        onViewUsage={handleOnOpenSheetViewUsage}
      />
      <AddSheetModal
        isOpen={isOpenAddDocumentSheet}
        onClose={handleOnCloseAddSheet}
      />
      {/* <Modal
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
                    onClick={handleOnCloseAddSheet}
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
              isLoading={isLoading}
            >
              บันทึก
            </Button>
        </ModalContent>
      </Modal> */}
    </div>
  )
}

export default SheetComponent