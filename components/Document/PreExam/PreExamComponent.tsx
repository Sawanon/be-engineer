"use client"
import React, { useMemo, useState } from 'react'
import TablePreExam from './Table'
import { addPreExamAction, listPreExamActionPerPage, revalidatePreExam } from '@/lib/actions/pre-exam.actions'
import { DocumentPreExam } from '@prisma/client'
import EditPreExamModal from './EditPreExamModal'
import PreExamUsage from './PreExamUsage'
import { Button, Input, Modal, ModalContent, Textarea } from '@nextui-org/react'
import { X } from 'lucide-react'
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
  const [preExamName, setPreExamName] = useState<string | undefined>();
  const [preExamLink, setPreExamLink] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

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

  const submitPreExam = async () => {
    try {
      if(!preExamName || !preExamLink) return
      setIsLoading(true)
      const repsonse = await addPreExamAction({
         name: preExamName,
         url: preExamLink,
      })
      if(!repsonse){
         console.error(`response is undefined Document/index:102`)
         return
      }
      handleCloseAddPreExam()
      revalidate()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
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
      {/* <Modal
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
                    onClick={handleCloseAddPreExam}
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
              isLoading={isLoading}
            >
              บันทึก
            </Button>
        </ModalContent>
      </Modal> */}
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