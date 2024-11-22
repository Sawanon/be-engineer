import SortableComponent from '@/components/Sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { Button, Modal, ModalContent } from '@nextui-org/react';
import { CourseVideo } from '@prisma/client';
import { X } from 'lucide-react';
import React, { useMemo, useState } from 'react'

const SortContentModal = ({
  open,
  onClose,
  onConfirm,
  courseVideoList,
}:{
  open: boolean,
  onClose: () => void,
  onConfirm: (courseVideoList: CourseVideo[]) => Promise<void>,
  courseVideoList: CourseVideo[],
}) => {

  const [cloneCourseVideoList, setCloneCourseVideoList] = useState<CourseVideo[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useMemo(() => {
    setCloneCourseVideoList(courseVideoList)
  }, [courseVideoList])

  const handleOnClose = () => {
    onClose()
  }

  const handleOnConfirm = async () => {
    try {
      setIsLoading(true)
      await onConfirm(cloneCourseVideoList)
      handleOnClose()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
    isOpen={open}
    closeButton={<></>}
    backdrop="blur"
    classNames={{
      backdrop: `bg-backdrop`,
    }}
  >
    <ModalContent>
      {() => (
        <div className="p-app">
          <div className="flex">
            <div className="flex-1"></div>
            <div
              className={`flex-1 text-nowrap text-3xl font-semibold font-IBM-Thai`}
            >
              จัดเรียงเนื้อหา
            </div>
            <div className="flex-1 flex justify-end">
              <Button
                className="bg-transparent"
                isIconOnly
                onClick={handleOnClose}
              >
                <X />
              </Button>
            </div>
          </div>
          <div className={`mt-app overflow-hidden`}>
            <SortableComponent
              courseVideoList={cloneCourseVideoList}
              onDragEnd={(event) => {
                const cloneVideo = [...cloneCourseVideoList]
                const { active, over } = event;
                const originalPos = cloneVideo.findIndex(
                  (video: any) => video.id === active.id
                );
                const newPos = cloneVideo.findIndex(
                  (lesson: any) => lesson.id === over!.id
                );
                const newPosition = arrayMove(cloneVideo, originalPos, newPos)
                setCloneCourseVideoList(newPosition)
              }}
            />
          </div>
          <div className={`mt-app`}>
            <Button isLoading={isLoading} onClick={handleOnConfirm} fullWidth className={`bg-default-foreground text-primary-foreground font-medium text-base font-IBM-Thai`}>
              ตกลง
            </Button>
          </div>
        </div>
      )}
    </ModalContent>
  </Modal>
  )
}

export default SortContentModal