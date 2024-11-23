import { listCourseAction } from '@/lib/actions/course.actions'
import { addLessonToDB } from '@/lib/actions/lesson.actions'
import Alert from '@/ui/alert'
import { Button, Input, Modal, ModalContent } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import React, { useState } from 'react'

const AddLesson = ({
  isOpen,
  onClose,
  position,
  courseId,
}:{
  isOpen: boolean,
  onClose: () => void,
  position: number,
  courseId: number,
}) => {
  const {refetch: refetchCourse} = useQuery({
    queryKey: ["listCourseAction"],
    queryFn: () => listCourseAction(),
  });
  const [isLoading, setLoading] = useState(false)
  const [lessonName, setLessonName] = useState<string | undefined>()
  const [error, setError] = useState({
    isError: false,
    message: "",
  })

  const handleOnChangeLessonName = (value: string) => {
    setLessonName(value)
  }

  const handleOnClose = () => {
    setLessonName(undefined)
    onClose()
    setError({
      isError: false,
      message: "",
    })
  }

  const submitCreateLesson = async () => {
    try {
    if (!lessonName) {
      setError({
        isError: true,
        message: "กรุณากรอกข้อมูลให้ครบ"
      })
      return;
    }
    setLoading(true)
    const res = await addLessonToDB(courseId, {
      name: lessonName,
      position: position,
    });
    if(typeof res === "string") {
      throw res
    }
    handleOnClose()
    refetchCourse()
    } catch (error) {
      console.error(error)
      setError({
        isError: true,
        message: "เพิ่มไม่สำเร็จ ดูเพิ่มเติมใน Console"
      })
    } finally {
      setLoading(false)
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
        placement='top-center'
      >
        <ModalContent>
          {() => (
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
                onKeyDown={(key) => {
                  if(key.code === `Enter`){
                    submitCreateLesson()
                  }
                }}
                className="font-IBM-Thai-Looped text-lg font-medium mt-3"
                classNames={{
                  input: "font-IBM-Thai-Looped text-lg font-medium",
                }}
                placeholder="ชื่อบทเรียน"
                onChange={(e) => handleOnChangeLessonName(e.target.value)}
              />
              <Button
                className={`mt-3 text-base font-medium font-IBM-Thai bg-default-foreground text-primary-foreground`}
                fullWidth
                onClick={submitCreateLesson}
                isLoading={isLoading}
              >
                บันทึก
              </Button>
            </div>
          )}
        </ModalContent>
      </Modal>
  )
}

export default AddLesson