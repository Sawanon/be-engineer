"use client"
import { addSheetAction, listSheetActionPerPage, revalidateSheet } from '@/lib/actions/sheet.action'
import React, { useMemo, useState } from 'react'
import TableDocument from '../table'
import { DocumentSheet } from '@prisma/client'
import EditSheeModal from './EditSheeModal'
import SheetUsage from './SheetUsage'
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
  const [isOpenAddDocumentSheet, setIsOpenAddDocumentSheet] = useState(false);

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
    </div>
  )
}

export default SheetComponent