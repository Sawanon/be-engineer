import { Button, Modal, ModalContent } from '@nextui-org/react'
import { DocumentSheet } from '@prisma/client'
import { X } from 'lucide-react'
import React from 'react'

const EditSheeModal = ({
  isOpen,
  sheet,
  onClose,
}:{
  isOpen: boolean,
  sheet?: DocumentSheet,
  onClose: () => void,
}) => {

  const handleOnClose = () => {
    onClose()
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
        <div className={`flex items-center`}>
          <div className={`flex-1`}></div>
          <div className={`flex-1 text-center text-3xl font-semibold font-IBM-Thai`}>เอกสาร</div>
          <div className={`flex-1 flex items-center justify-end`}>
              <Button onClick={handleOnClose} className={`min-w-0 w-8 max-w-8 max-h-8 bg-primary-foreground`} isIconOnly><X /></Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}

export default EditSheeModal