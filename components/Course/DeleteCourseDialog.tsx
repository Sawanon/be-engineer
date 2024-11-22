import { Button, Modal, ModalContent } from '@nextui-org/react'
import { Trash2, X } from 'lucide-react'
import React, { useState } from 'react'
import ErrorBox from '../ErrorBox'

const DeleteCourseDialog = ({
  title,
  detail,
  isOpen,
  onConfirm,
  onCancel,
  error,
}:{
  title: string
  detail: React.JSX.Element
  isOpen: boolean,
  onConfirm: () => Promise<void>
  onCancel: () => void
  error: {
    isError: boolean,
    message: string,
  }
}) => {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleOnConfirm = async () => {
    try {
      setIsLoading(true)
      await onConfirm()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Modal
        isOpen={isOpen}
        className={`z-10`}
        closeButton={<></>}
        backdrop="blur"
        classNames={{
          backdrop: `bg-backdrop`,
        }}
      >
        <ModalContent
          className={`p-app`}
        >
          <div className={`flex justify-between items-center`}>
            <div className={`text-3xl font-semibold font-IBM-Thai`}>
              {title}
            </div>
            <Button
              isIconOnly
              className={`w-8 max-w-8 min-w-0 h-8 bg-transparent`}
              onClick={onCancel}
            >
              <X size={24}/>
            </Button>
          </div>
          {error.isError &&
            <div className={`mt-app`}>
              <ErrorBox
                message={error.message}
              />
            </div>
          }
          <div className={`mt-app font-IBM-Thai-Looped`}>
            {detail}
          </div>
          <div className={`mt-app flex gap-2 justify-end pt-2`}>
            <Button
              className={`font-IBM-Thai font-medium text-base bg-default-100`}
              onClick={onCancel}
              isLoading={isLoading}
            >
              ยกเลิก
            </Button>
            <Button
              className={`font-IBM-Thai font-medium text-base text-danger-500 bg-default-100`}
              startContent={<Trash2 size={20} />}
              onClick={handleOnConfirm}
              isLoading={isLoading}
            >
              ลบ
            </Button>
          </div>
        </ModalContent>
      </Modal>
  )
}

export default DeleteCourseDialog