import { cn } from '@/lib/util'
import BulletPoint from '@/ui/bullet_point'
import { Button, Modal, ModalBody, ModalContent } from '@nextui-org/react'
import { DocumentPreExam } from '@prisma/client'
import { X } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { LuArrowUpRight } from 'react-icons/lu'

const PreExamUsage = ({
  open,
  onClose,
  preExam,
  courseList,
}:{
  open: boolean,
  onClose: () => void,
  preExam?: DocumentPreExam,
  courseList: any[],
}) => {
  return (
    <Modal
      isOpen={open}
      classNames={{
        base: "top-0 p-0 m-0 absolute md:relative w-screen   md:w-[428px] bg-white m-0  max-w-full ",
        backdrop: 'bg-backdrop',
      }}
      backdrop="blur"
      onClose={() => {}}
      scrollBehavior={"inside"}
      closeButton={<></>}
    >
      <ModalContent>
        <ModalBody className={cn("p-0 flex-1 ")}>
            <div className="flex flex-col pb-4 ">
              <div className=" flex flex-col rounded-xl    bg-white flex-1 px-4 space-y-2">
                  <div className="flex gap-1  my-3  ">
                    <div className="flex  gap-2 w-4/5">
                        <div className="flex flex-1 items-center">
                          <p className="text-lg font-semibold font-sans">
                              {/* หนังสือ Dynamics midterm vol.1 - 2/2566{" "} */}
                              {preExam?.name}{" "}
                          </p>
                          <div className="flex-1 whitespace-nowrap "></div>
                        </div>
                    </div>

                    <Button
                        variant="flat"
                        isIconOnly
                        className="bg-transparent text-black absolute right-1 top-1"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </Button>
                  </div>

                  <div className="col-span-2 flex flex-col gap-2">
                    <p className="text-[#71717A] font-bold text-lg font-serif">
                        รายการคอร์สที่ใช้งาน
                    </p>
                    <div className="ml-4   ">
                      {courseList?.map((course, index) => {
                        const mode = course.status === "noContent" ? `tutor` : `admin`
                        const link = `/course?drawerCourse=${course.id}&mode=${mode}`
                        return (
                          <Link
                            target="_blank"
                            key={`courseUsage${index}`}
                            // href={`/course?drawerCourse=${course.id}`}
                            href={link}
                          >
                            <div className="flex items-center font-serif">
                                <BulletPoint />
                                <p>{course.name}</p>
                                <LuArrowUpRight className="self-start" />
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
              </div>
            </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default PreExamUsage