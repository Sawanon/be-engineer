import { closestCorners, DndContext, DragEndEvent } from "@dnd-kit/core";
import { CourseLesson } from "@prisma/client";
import React, { useMemo, useState } from "react";
import ColumeLesson from "./ColumeLesson";
import { Button, Modal, ModalContent } from "@nextui-org/react";
import { arrayMove } from "@dnd-kit/sortable";

const SortLessonModal = ({
  isOpen,
  lessonList,
  onDragEnd,
  onConfirm,
  onClose,
}: {
  isOpen: boolean;
  lessonList: CourseLesson[];
  onDragEnd?: (event: DragEndEvent) => void;
  onConfirm: (newLessonList: CourseLesson[]) => Promise<void>;
  onClose: () => void;
}) => {
  const [cloneLessonList, setCloneLessonList] = useState<CourseLesson[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useMemo(() => {
    setCloneLessonList(lessonList)
  }, [lessonList])

  const handleOnDragEnd = (event: DragEndEvent) => {
    const cloneCloneLessonList = [...cloneLessonList]
    const { active, over } = event;
    const originalPos = cloneCloneLessonList.findIndex(
      (lesson) => lesson.id === active.id
    );
    const newPos = cloneCloneLessonList.findIndex(
      (lesson) => lesson.id === over!.id
    );
    const newPosition = arrayMove(cloneCloneLessonList, originalPos, newPos)
    setCloneLessonList(newPosition)
  }
  
  const handleOnClose = () => {
    setCloneLessonList(lessonList)
    onClose()
  }

  const handleOnConfirm = async () => {
    setIsLoading(true)
    await onConfirm(cloneLessonList)
    setIsLoading(false)
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
        {() => (
          <div className={`p-app overflow-hidden`}>
            <DndContext collisionDetection={closestCorners} onDragEnd={handleOnDragEnd}>
              <div className={`bg-default-100 p-1 rounded-md`}>
                <ColumeLesson lessonList={cloneLessonList} />
              </div>
            </DndContext>
            <div className={`mt-3 flex gap-2 justify-end`}>
              <Button disabled={isLoading} onClick={handleOnClose} className={`bg-default-100 text-default-foreground font-medium text-base font-IBM-Thai`}>
                ยกเลิก
              </Button>
              <Button isLoading={isLoading} onClick={handleOnConfirm} className={`bg-default-foreground text-primary-foreground font-medium text-base font-IBM-Thai`}>
                ตกลง
              </Button>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SortLessonModal;
