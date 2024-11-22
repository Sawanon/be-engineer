import { restoreBook } from '@/lib/actions/book.actions'
import { countBookInCourse, getCourseById, listCourseAction } from '@/lib/actions/course.actions'
import { getLessonById, removeBookLessonAction, removeDocumentPreExamInLessonAction, removeDocumentSheetInLessonAction } from '@/lib/actions/lesson.actions'
import Alert from '@/ui/alert'
import { Button, Modal, ModalContent } from '@nextui-org/react'
import { CourseLesson } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { Trash2, X } from 'lucide-react'
import React, { useState } from 'react'

const DisconnectDocument = ({
  isOpen,
  onClose,
  document,
  lessonId,
  onSuccess,
}:{
  isOpen: boolean,
  onClose: () => void,
  document: any,
  lessonId: number,
  onSuccess: (type: string) => void,
}) => {

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({
    isError: false,
    message: "",
  })

  const handleOnClose = () => {
    onClose()
  }

  const submitDeleteDocument = async () => {
    console.log("document", document);
    try {
      setIsLoading(true)
      if(document.type === "book"){
        const lesson = await getLessonById(lessonId)
        const bookId =  document.DocumentBook.id
        if(typeof lesson === "string") throw lesson
        if(!lesson) throw `lesson is ${lesson}`
        const course = await getCourseById(lesson.courseId)
        if(typeof course === "string") throw course
        if(!course) throw `course is ${course}`
        if(course.webappCourseId !== null){
          console.log(lesson.courseId, bookId);
          const response = await countBookInCourse(lesson.courseId, bookId)
          if(typeof response === "string") throw response
          if(!response) throw `response is ${response}`
          const leftBook = Number(response.leftBook)
          console.log("🚀 ~ submitDeleteDocument ~ leftBook:", leftBook)
          if(leftBook > 1){
            console.log("remove now!");
            const response = await removeBookLessonAction(bookId, lessonId)
            console.log("🚀 ~ submitDeleteDocument ~ response:", response)
          }else{
            console.log("restore book and remove!");
            const response = await restoreBook(bookId, course.webappCourseId)
            console.log("🚀 ~ submitDeleteDocument ~ response:", response)
            const responseRemoveBook = await removeBookLessonAction(bookId, lessonId)
            console.log("🚀 ~ submitDeleteDocument ~ responseRemoveBook:", responseRemoveBook)
          }
          onSuccess(document.type)
          handleOnClose()
          return
        }
        console.log("remove now ! not connect");
        const response = await removeBookLessonAction(bookId, lessonId)
        console.log("🚀 ~ submitDeleteDocument ~ response:", response)
      }else if(document.type === "sheet"){
        const sheetId =  document.DocumentSheet.id
        const responseRemoveSheet = await removeDocumentSheetInLessonAction(sheetId, lessonId)
        console.log("🚀 ~ submitDeleteDocument ~ responseRemoveSheet:", responseRemoveSheet)
        if(!responseRemoveSheet) throw `responseRemoveSheet is ${responseRemoveSheet}`
        if(typeof responseRemoveSheet === "string") throw responseRemoveSheet
      }else if(document.type === "preExam"){
        console.log("document", document);
        const preExamId =  document.DocumentPreExam.id
        const responseRemovePreExam = await removeDocumentPreExamInLessonAction(preExamId, lessonId)
        console.log("🚀 ~ submitDeleteDocument ~ responseRemovePreExam:", responseRemovePreExam)
        if(!responseRemovePreExam) throw `responseRemovePreExam is ${responseRemovePreExam}`
        if(typeof responseRemovePreExam === "string") throw responseRemovePreExam
      }
      onSuccess(document.type)
      handleOnClose()
      setError({
        isError: false,
        message: ``,
      })
    } catch (error) {
      console.error(error)
      setError({
        isError: true,
        message: `เกิดข้อผิดพลาดบางอย่าง ดูเพิ่มเติมใน Console`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getName = (document: any) => {
    if(document.type === "book"){
      return document.DocumentBook.name
     }
     else if(document.type === "sheet"){
       return document.DocumentSheet.name
     }
     else if(document.type === "preExam"){
       return document.DocumentPreExam.name
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
            เอกสาร {getName(document)} ออกจากคอร์ส
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
            onClick={submitDeleteDocument}
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

export default DisconnectDocument