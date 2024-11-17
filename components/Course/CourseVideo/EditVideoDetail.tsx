'use client'
import { changeDescrioptionVideo, listVideoDescriptions } from '@/lib/actions/video.actions'
import Alert from '@/ui/alert'
import { Autocomplete, AutocompleteItem, Button, Modal, ModalContent } from '@nextui-org/react'
import { CourseVideo } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { FileText, Video, X } from 'lucide-react'
import React, { Key, useState } from 'react'

const EditVideoDetail = ({
  isOpen,
  onClose,
  video,
}:{
  isOpen: boolean,
  onClose: () => void,
  video?: CourseVideo,
}) => {
  const {data: videoDescriptionList} = useQuery({
    queryKey: ['listVideoDescriptions'],
    queryFn: () => listVideoDescriptions()
  })

  const [isLoading, setIsLoading] = useState(false)
  const [selectedDescription, setSelectedDescription] = useState<Key | null | undefined>()
  const [error ,setError] = useState({
    isError: false,
    message: '',
  })

  const handleOnClose = () => {
    setError({
      isError: false,
      message: ""
    })
    setSelectedDescription(undefined)
    onClose()
  }

  const handleOnDelete = () => {
    
  }

  const handleOnSubmit = async () => {
    try {
      setIsLoading(true)
      if(!video) throw "video is empty"
      if(!selectedDescription) {
        setError({
          isError: true,
          message: "กรุณาเลือกรายละเอียดวิดีโอ"
        })
        return
      }
      console.log(selectedDescription);
      const description = videoDescriptionList.find((descrion:any) => descrion.id === parseInt(selectedDescription.toString()))
      console.log("🚀 ~ handleOnSubmit ~ description:", description)
      const response = await changeDescrioptionVideo(video.id, description.id, description.name)
      console.log("🚀 ~ handleOnSubmit ~ response:", response)
      if(typeof response === "string"){
        throw response
      }
      handleOnClose()
    } catch (error) {
      setError({
        isError: true,
        message: `${error}`,
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
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
          <div className={`flex-1 text-center text-3xl font-semibold font-IBM-Thai`}>เนื้อหา</div>
          <div className={`flex-1 flex items-center justify-end`}>
              <Button onClick={handleOnClose} className={`min-w-0 w-8 max-w-8 max-h-8 bg-primary-foreground`} isIconOnly><X /></Button>
          </div>
        </div>
        {error.isError &&
          <Alert label={error.message} />
        }
        <div className={`mt-app`}>
          <div className={`font-IBM-Thai-Looped text-foreground-400 font-medium text-xs flex gap-1`}>
            <Video size={16} />
            <div>
              {video?.playlistName}
            </div>
          </div>
          <div className={`text-default-foreground text-lg font-bold font-IBM-Thai-Looped`}>
            {video?.name}
          </div>
        </div>
        <div className={`mt-app`}>
          <div className={`flex gap-1 text-foreground-400 text-xs font-medium font-IBM-Thai-Looped`}>
            <FileText size={16} />
            <div>
              รายละเอียดใต้วิดีโอ
            </div>
          </div>
          <Autocomplete
            aria-label='video description'
            className={`mt-1`}
            onSelectionChange={(key) => setSelectedDescription(key)}
            defaultSelectedKey={video?.descriptionId === null ? undefined : video?.descriptionId.toString()}
          >
            {videoDescriptionList
            ?
            videoDescriptionList.map((description:any, index:number) => (
              <AutocompleteItem key={`${description.id}`}>
                {description.name}
              </AutocompleteItem>
            ))
            :
            <AutocompleteItem key={`loading...`}>
              Loading...
            </AutocompleteItem>
            }
          </Autocomplete>
        </div>
        <div className={`mt-app`}>
          <Button isLoading={isLoading} onClick={handleOnSubmit} className={`bg-default-foreground text-base font-medium text-primary-foreground font-IBM-Thai`} fullWidth>
            ตกลง
          </Button>
          <Button isLoading={isLoading} onClick={handleOnDelete} className={`bg-transparent text-danger-500 font-medium font-IBM-Thai-Looped mt-2`} fullWidth>
            ลบ
          </Button>
        </div>
      </ModalContent>
    </Modal>
  )
}

export default EditVideoDetail