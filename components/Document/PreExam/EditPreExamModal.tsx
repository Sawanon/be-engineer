import DeleteCourseDialog from '@/components/Course/DeleteCourseDialog'
import { deletePreExamAction, editPreExamAction } from '@/lib/actions/pre-exam.actions'
import Alert from '@/ui/alert'
import { Button, Input, Modal, ModalContent, Textarea } from '@nextui-org/react'
import { DocumentPreExam, LessonOnDocument } from '@prisma/client'
import { X } from 'lucide-react'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type EditPreExam = {
  name: string,
  url: string,
}

const EditPreExamModal = ({
  isOpen,
  preExam,
  onClose,
  onSuccess,
}:{
  isOpen: boolean,
  preExam?: DocumentPreExam,
  onClose: () => void,
  onSuccess: () => void,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors, isSubmitting},
    setError,
    reset,
  } = useForm<EditPreExam>({
    defaultValues: preExam ? {
      name: preExam.name,
      url: preExam.url,
    } : undefined
  })
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const [errorDeletePreExam, setErrorDeletePreExam] = useState({
    isError: false,
    message: "",
  })
  const [isCantDelete, setIsCantDelete] = useState(false)

  const handleOnClose = () => {
    onClose()
    reset({name: '', url: ''})
  }

  const handleOnSubmit:SubmitHandler<EditPreExam> = async (data) => {
    try {
      const response = await editPreExamAction(
        preExam!.id,
        data.name,
        data.url,
      )
      console.log("response", response);
      if(!response) throw `response is ${response}`
      if(typeof response === "string") throw response
      onSuccess()
      handleOnClose()
    } catch (error) {
      console.error(error)
      setError('root', {
        message: `${error}`
      })
    }
  }

  const deletePreExam = async () => {
    try {
      const response = await deletePreExamAction(preExam!.id)
      console.log("🚀 ~ deletePreExam ~ response:", response)
      if(typeof response === 'string') throw response
      if(!response) throw `response is ${response}`
      onSuccess()
      handleOnClose()
    } catch (error) {
      setErrorDeletePreExam({
        isError: true,
        message: `${error}`
      })
    }
  }

  const handleOnDelete = () => {
    console.log(preExam);
    const _preExam:any = preExam
    const lessonUsePreExam:LessonOnDocument[] = _preExam.LessonOnDocument
    if(lessonUsePreExam.length > 0){
      setIsCantDelete(true)
      return
    }
    setIsOpenDelete(true)
  }

  return (
    <Modal
      isOpen={isOpen}
      closeButton={<></>}
      backdrop="blur"
      placement='top-center'
      classNames={{
        backdrop: `bg-backdrop`,
      }}
    >
      <ModalContent className={`p-app`}>
        <Modal
          isOpen={isCantDelete}
          classNames={{
            base: "bottom-0 absolute md:relative w-screen md:w-[428px] bg-white m-0 ",
            body: "p-0",
          }}
          backdrop="blur"
          onClose={() => {}}
          closeButton={<></>}
        >
          <ModalContent
            className={`p-app`}
          >
            <div className={`text-3xl font-semibold font-IBM-Thai`}>
              ไม่สามารถลบได้ !
            </div>
            <div className={`mt-app font-IBM-Thai-Looped`}>
              ไม่สามารถลบเอกสาร {preExam?.name} เพราะถูกใช้งานในคอร์สแล้ว
            </div>
            <div className={`pt-2 flex justify-end`}>
              <Button
                className={`bg-default-100 font-IBM-Thai`}
                onClick={handleOnClose}
              >
                ตกลง
              </Button>
            </div>
          </ModalContent>
        </Modal>
        <DeleteCourseDialog
          isOpen={isOpenDelete}
          title='แน่ใจหรือไม่ ?'
          detail={(
            <div>
              <div>
                คุณแน่ใจหรือไม่ที่จะลบ
              </div>
              <div>
                {preExam?.name}
              </div>
            </div>
          )}
          onCancel={() => {
            setIsOpenDelete(false)
          }}
          error={errorDeletePreExam}
          onConfirm={deletePreExam}
        />
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <div className={`flex items-center`}>
            <div className={`flex-1`}></div>
            <div className={`flex-1 text-center text-3xl font-semibold font-IBM-Thai`}>เอกสาร</div>
            <div className={`flex-1 flex items-center justify-end`}>
                <Button onClick={handleOnClose} className={`min-w-0 w-8 max-w-8 max-h-8 bg-primary-foreground`} isIconOnly><X /></Button>
            </div>
          </div>
          {errors.root &&
            <div className={`mt-app`}>
              <Alert />
            </div>
          }
          <div className={``}>
            <Input
              aria-label='preExam name'
              className={`rounded-lg`}
              placeholder='ชื่อเอกสาร'
              color={errors.name ? `danger` : `default`}
              classNames={{
                input: ['text-[1em] font-serif'],
                inputWrapper: ['rounded-lg']
              }}
              {...register('name', {required: true})}
            />
            <div id="textarea-wrapper" className={`mt-2`}>
              <Textarea
                classNames={{
                    input: `text-[1em]`,
                    inputWrapper: ['rounded-lg']
                }}
                minRows={1}
                color={errors.url ? `danger` : `default`}
                placeholder={`Link`}
                aria-label={`Link`}
                className={`mt-2 font-serif ${!watch('url') ? `` : `underline`}`}
                // onChange={(e) => setDocumentLink(e.target.value)}
                {...register('url', {required: true})}
              />
            </div>
            <div className={`mt-app pt-2 flex gap-2`}>
              <Button onClick={handleOnDelete} disabled={isSubmitting} className={`bg-default-100 text-danger-500 font-serif min-w-0 font-medium text-base`}>
                ลบ
              </Button>
              <Button
                className={`bg-default-foreground font-sans text-base font-medium text-primary-foreground`}
                fullWidth
                type='submit'
                isLoading={isSubmitting}
              >
                บันทึก
              </Button>
            </div>
          </div>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default EditPreExamModal