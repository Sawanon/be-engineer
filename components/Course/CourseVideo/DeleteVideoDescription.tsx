import { deleteVideoDescription } from '@/lib/actions/video.actions'
import Alert from '@/ui/alert'
import { Button, Modal, ModalContent } from '@nextui-org/react'
import { useQueryClient } from '@tanstack/react-query'
import { Trash2, X } from 'lucide-react'
import React, { useState } from 'react'

const DeleteVideoDescription = ({
  isOpen,
  onClose,
  descriptionId,
  contentName,
  videoId,
  onSuccess,
}:{
  isOpen: boolean,
  onClose: () => void,
  descriptionId?: number | null,
  contentName?: string | null,
  videoId?: number | null,
  onSuccess: () => void,
}) => {
  const queryClient = useQueryClient()
  const [error, setError] = useState({
    isError: false,
    message: ``,
  })
  const [isLoading, setIsLoading] = useState(false)
  
  const handleOnClose = () => {
    onClose()
  }

  const submitDeleteDocument = async () => {
    try {
      console.log("descriptionId", descriptionId);
      if(!videoId) throw `video id is empty`
      setIsLoading(true)
      const response = await deleteVideoDescription(videoId)
      console.log("🚀 ~ submitDeleteDocument ~ response:", response)
      if(!response) throw `response delete video description is ${response}`
      if(typeof response === "string") throw response
      queryClient.invalidateQueries({queryKey: ['listCourseAction']})
      handleOnClose()
      onSuccess()
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
            Description {contentName} ออกจากวิดีโอ
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

export default DeleteVideoDescription