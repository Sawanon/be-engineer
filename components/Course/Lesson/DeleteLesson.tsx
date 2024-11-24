import { listCourseAction, revalidateCourse } from '@/lib/actions/course.actions'
import { deleteLesson } from '@/lib/actions/lesson.actions'
import Alert from '@/ui/alert'
import { Button, Modal, ModalContent } from '@nextui-org/react'
import { CourseLesson } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { Trash2, X } from 'lucide-react'
import React, { useState } from 'react'

const DeleteLesson = ({
  isOpen,
  onClose,
  lesson,
}:{
  isOpen: boolean,
  onClose: () => void,
  lesson: CourseLesson,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({
    isError: false,
    message: "",
  })

  const handleOnClose = () => {
    onClose()
  }

  const submitDeleteCourse = async () => {
    try {
      setIsLoading(true)
      const response = await deleteLesson(lesson.id)
      if(typeof response === "string"){
        throw response
      }
      handleOnClose()
      revalidateCourse()
    } catch (error) {
      console.error(error)
      setError({
        isError: true,
        message: "ลบไม่สำเร็จ ดูเพิ่มเติมใน Console",
      })
    } finally {
      setIsLoading(false)
      setError({
        isError: false,
        message: "",
      })
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
    >
      <ModalContent className={`p-app`}>
        <div className={`flex`}>
          <div className="flex-1 text-3xl font-semibold font-IBM-Thai">
            แน่ใจหรือไม่ ?
          </div>
          <div
            onClick={handleOnClose}
            className="cursor-pointer flex-1 flex justify-end items-center"
          >
            <X size={32} />
          </div>
        </div>
        {error.isError &&
          <Alert label={error.message} />
        }
        <div className={`mt-app font-IBM-Thai-Looped text-default-foreground`}>
          <div>
            คุณแน่ใจหรือไม่ที่จะลบ
          </div>
          <div>
            Lesson {lesson?.name}
          </div>
        </div>
        <div className={`mt-app pt-2 flex justify-end gap-2`}>
          <Button
            isLoading={isLoading}
            className={`bg-default-100 text-default-foreground font-IBM-Thai font-medium`}
            onClick={handleOnClose}
          >
            ยกเลิก
          </Button>
          <Button
            isLoading={isLoading}
            onClick={submitDeleteCourse}
            startContent={<Trash2 size={16} />}
            className={`text-danger-500 bg-default-100 font-IBM-Thai font-medium`}
          >
            ลบ
          </Button>
        </div>
      </ModalContent>
    </Modal>
  )
}

export default DeleteLesson