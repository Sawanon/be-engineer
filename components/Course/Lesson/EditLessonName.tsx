import { listCourseAction, revalidateCourse } from '@/lib/actions/course.actions'
import { updateLesson } from '@/lib/actions/lesson.actions'
import Alert from '@/ui/alert'
import { Button, Input, Modal, ModalContent } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import React, { useState } from 'react'

const EditLessonName = ({
  isOpen,
  onClose,
  lesson,
}:{
  isOpen: boolean,
  onClose: () => void,
  lesson?: any,
}) => {
  const [lessonName, setLessonName] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({
    isError: false,
    message: "",
  })

  const handleOnChangeLessonName = (value: string) => {
    setLessonName(value)
  }

  const handleOnClose = () => {
    setLessonName(undefined)
    setError({
      isError: false,
      message: ""
    })
    onClose()
  }

  const submitChangeLessonName = async () => {
    try {
      if(!lessonName || lessonName === ""){
        setError({
          isError: true,
          message: "เปลี่ยนชื่อไม่สำเร็จ ดูเพิ่มเติมใน Console"
        })
        return
      }
      setIsLoading(true)
      const response = await updateLesson(lesson.id, {
        name: lessonName,
      })
      if(typeof response === "string"){
        console.error(response);
        setError({
          isError: true,
          message: response,
        })
        return
      }
      handleOnClose()
      revalidateCourse()
    } catch (error) {
      setError({
        isError: true,
        message: "เปลี่ยนชื่อไม่สำเร็จ ดูเพิ่มเติมใน Console"
      })
      console.error(error)
    } finally {
      setIsLoading(false)
      setError({
        isError: false,
        message: ""
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
        <ModalContent>
          <div className={`p-app`}>
            <div className={`flex`}>
              <div className="flex-1"></div>
              <div className="flex-1 text-3xl font-semibold font-IBM-Thai text-center">
                บทเรียน
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
            <Input
              size="lg"
              className="font-IBM-Thai-Looped text-lg font-medium mt-3"
              classNames={{
                input: "font-IBM-Thai-Looped text-lg font-medium",
              }}
              placeholder="ชื่อบทเรียน"
              onKeyDown={(key) => {
                if(key.code === `Enter`){
                  submitChangeLessonName()
                }
              }}
              onChange={(e) => handleOnChangeLessonName(e.target.value)}
              defaultValue={lesson?.name}
            />
            <Button
              className={`mt-3 text-base font-medium font-IBM-Thai bg-default-foreground text-primary-foreground`}
              fullWidth
              onClick={submitChangeLessonName}
              isLoading={isLoading}
            >
              บันทึก
            </Button>
          </div>
        </ModalContent>
      </Modal>
  )
}

export default EditLessonName