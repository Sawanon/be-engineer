"use client"
import React, { useMemo, useState } from 'react'
import TablePreExam from './Table'
import { listPreExamActionPerPage, revalidatePreExam } from '@/lib/actions/pre-exam.actions'
import { DocumentPreExam } from '@prisma/client'
import EditPreExamModal from './EditPreExamModal'
import PreExamUsage from './PreExamUsage'
import { useRouter, useSearchParams } from 'next/navigation'
import AddPreExamModal from './AddPreExamModal'

const PreExamComponent = ({
  preExamItems,
}:{
  preExamItems: Awaited<ReturnType<typeof listPreExamActionPerPage>>
}) => {
  const searchParams = useSearchParams()
  const route = useRouter()
  const [isOpenPreExamViewUsage, setIsOpenPreExamViewUsage] = useState(false)
  const [selectedPreExam, setSelectedPreExam] = useState<DocumentPreExam | undefined>()
  const [isOpenEditPreExam, setIsOpenEditPreExam] = useState(false)
  const [courseList, setCourseList] = useState<any[]>([])
  const [isOpenAddDocumentPreExam, setIsOpenAddDocumentPreExam] = useState(false);

  const handleOnOpenPreExamViewUsage = (courseList: any[], preExam: DocumentPreExam) => {
    setIsOpenPreExamViewUsage(true)
    setSelectedPreExam(preExam)
    setCourseList(courseList)
  }

  const handleOnClickEditPreExam = (preExam: DocumentPreExam) => {
    setSelectedPreExam(preExam)
    setIsOpenEditPreExam(true)
  }

  const revalidate = async () => {
    revalidatePreExam()
  }

  const handleOnClosePreExamViewUsage = () => {
    setIsOpenPreExamViewUsage(false)
    setSelectedPreExam(undefined)
    setCourseList([])
  }

  const handleCloseAddPreExam = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('add')
    route.replace(`/document?${params.toString()}`)
  }

  useMemo(() => {
    const isAdd = searchParams.get('add') === 'true'
    if(isAdd){
      setIsOpenAddDocumentPreExam(true)
    }else{
      setIsOpenAddDocumentPreExam(false)
    }
  }, [searchParams.get('add')])

  return (
    <div>
      <AddPreExamModal
        isOpen={isOpenAddDocumentPreExam}
        onClose={handleCloseAddPreExam}
      />
      {isOpenEditPreExam &&
        <EditPreExamModal
            isOpen={isOpenEditPreExam}
            preExam={selectedPreExam}
            onClose={() => {
              setIsOpenEditPreExam(false)
            }}
            onSuccess={revalidate}
        />
      }
      <PreExamUsage
        open={isOpenPreExamViewUsage}
        courseList={courseList}
        preExam={selectedPreExam}
        onClose={handleOnClosePreExamViewUsage}
      />
      <TablePreExam
        onViewUsage={handleOnOpenPreExamViewUsage}
        // preExamList={preExamList}
        preExamList={preExamItems}
        onEditPreExam={handleOnClickEditPreExam}
      />
    </div>
  )
}

export default PreExamComponent