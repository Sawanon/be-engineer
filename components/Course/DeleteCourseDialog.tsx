import { Button, Modal, ModalContent } from '@nextui-org/react'
import { Trash2, X } from 'lucide-react'
import React from 'react'
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
  onConfirm: () => void
  onCancel: () => void
  error: {
    isError: boolean,
    message: string,
  }
}) => {
  
  return (
    <Modal
        isOpen={isOpen}
        className={`z-10`}
        closeButton={<></>}
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
            >
              ยกเลิก
            </Button>
            <Button
              className={`font-IBM-Thai font-medium text-base text-danger-500 bg-default-100`}
              startContent={<Trash2 size={20} />}
              onClick={onConfirm}
            >
              ลบ
            </Button>
          </div>
        </ModalContent>
      </Modal>
  )
}

export default DeleteCourseDialog