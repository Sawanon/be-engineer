"use client"
import { Button, Divider, Input, Modal, ModalContent } from "@nextui-org/react";
import React, { useState } from "react";
import {
  ArrowDownUp,
  ArrowLeft,
  Book,
  ChevronDown,
  ClipboardSignature,
  FileText,
  MoreHorizontal,
  Plus,
  RefreshCcw,
  ScrollText,
  Search,
  Video as VideoLucide,
  X,
} from "lucide-react";
import { Danger, Video } from "iconsax-react";
import SortableComponent from "./Sortable";
import { arrayMove } from "@dnd-kit/sortable";

const ManageLesson = () => {
  // const [lessons, setLessons] = useState([
  //   { id: 1, title: "Dynamics - 1.1 Velocity and Acceleration" },
  //   { id: 2, title: "Dynamics - 1.2 Graphical" },
  //   { id: 3, title: "Dynamics - 1.3 X-Y Coordinate" },
  // ]);
  const [isSort, setIsSort] = useState(false);
  const [lessonError, setLessonError] = useState({
    isError: false,
    message: ""
  })
  const [isAddLesson, setIsAddLesson] = useState(false)
  return (
    <div className="bg-default-100 p-[14px] md:min-w-[469px] md:w-[469px] overflow-y-auto">
      {/* <Modal
        isOpen={isSort}
        closeButton={<></>}
        backdrop="blur"
        classNames={{
          backdrop: `bg-backdrop`,
        }}
      >
        <ModalContent>
          {() => (
            <div className="p-[14px]">
              <div className="flex">
                <div className="flex-1"></div>
                <div
                  className={`flex-1 text-nowrap text-3xl font-semibold font-IBM-Thai`}
                >
                  จัดเรียงเนื้อหา
                </div>
                <div className="flex-1 flex justify-end">
                  <Button
                    className="bg-transparent"
                    isIconOnly
                    onClick={() => setIsSort(false)}
                  >
                    <X />
                  </Button>
                </div>
              </div>
              <div className={`mt-[14px] overflow-hidden`}>
                <SortableComponent
                  lessons={lessons}
                  onDragEnd={(event) => {
                    // console.log(`event.collisions`, event.collisions);
                    const { active, over } = event;
                    setLessons((lessons) => {
                      const originalPos = lessons.findIndex(
                        (lesson) => lesson.id === active.id
                      );
                      const newPos = lessons.findIndex(
                        (lesson) => lesson.id === over!.id
                      );
                      return arrayMove(lessons, originalPos, newPos);
                    });
                    // setLessons(event.collisions)
                  }}
                />
              </div>
            </div>
          )}
        </ModalContent>
      </Modal> */}
      <Modal
        isOpen={isAddLesson}
        closeButton={<></>}
        backdrop="blur"
        classNames={{
          backdrop: `bg-backdrop`,
        }}
      >
        <ModalContent>
          {() => (
            <div className={`p-app`}>
              <div className={`flex`}>
                <div className="flex-1"></div>
                <div className="flex-1 text-3xl font-semibold font-IBM-Thai text-center">
                  บทเรียน
                </div>
                <div className="flex-1 flex justify-end items-center">
                  <X size={32}/>
                </div>
              </div>
              <Input
                size="lg"
                className="font-IBM-Thai-Looped text-lg font-medium mt-3"
                classNames={{
                  input: "font-IBM-Thai-Looped text-lg font-medium",
                }}
                placeholder="ชื่อบทเรียน"
              />
              <Button
                className={`mt-3 text-base font-medium font-IBM-Thai bg-default-foreground text-primary-foreground`}
                fullWidth
              >
                บันทึก
              </Button>
            </div>
          )}
        </ModalContent>
      </Modal>
      <div className="flex items-center gap-3">
        <div className="font-bold text-2xl font-IBM-Thai">หลักสูตร</div>
        <Button size="sm" className="bg-transparent" isIconOnly>
          <ChevronDown size={24} />
        </Button>
      </div>
      {/* error */}
      {lessonError.isError &&
        <div className="mt-2 rounded-lg bg-danger-50 text-danger-500 border-l-4 border-danger-500 flex items-center gap-2 py-2 px-[14px]">
          <Danger variant="Bold" />
          <div className="font-IBM-Thai-Looped font-normal">
            {lessonError.message}
            {/* กรุณาใส่เอกสารในเนื้อหา */}
          </div>
        </div>
      }
      {/* add lesson */}
      <div className={`flex justify-center mt-2`}>
        <Button
          startContent={<Plus />}
          className={`bg-default-foreground text-primary-foreground font-IBM-Thai text-base font-medium`}
          onClick={() => setIsAddLesson(true)}
        >
          บทเรียน
        </Button>
      </div>

      <div className="hidden mt-2 bg-content1 rounded-lg p-2 border-2 border-danger-500">
        <div className="flex justify-between items-center">
          <div className="text-lg font-IBM-Thai-Looped font-medium">
            1. Kinematics of Particles
          </div>
          <Button size="sm" isIconOnly className="bg-transparent">
            <MoreHorizontal size={24} />
          </Button>
        </div>
        <Divider className="mt-2" />
        <div className="mt-2 font-IBM-Thai-Looped">
          <div className="flex p-1 items-center">
            <div className="w-8 flex">
              <Video className="text-foreground-400" size={16} />
              <FileText className="text-foreground-400" size={16} />
            </div>
            <div className="ml-1 flex-1">
              Dynamics - 1.1 Velocity and Acceleration
            </div>
            <div className="text-sm text-foreground-400">99 นาที</div>
          </div>
          <div className="flex p-1 items-center">
            <div className="w-8 flex">
              <Video className="text-foreground-400" size={16} />
              <FileText className="text-foreground-400" size={16} />
            </div>
            <div className="ml-1 flex-1">Dynamics - 1.2 Graphical</div>
            <div className="text-sm text-foreground-400">59 นาที</div>
          </div>
          <div className="flex p-1 items-center">
            <div className="w-8 flex">
              <Video className="text-foreground-400" size={16} />
            </div>
            <div className="ml-1 flex-1">Dynamics - 1.3 X-Y Coordinate</div>
            <div className="text-sm text-foreground-400">74 นาที</div>
          </div>
          <div className="flex justify-center gap-2">
            <Button
              onClick={() => setIsSort(true)}
              className="bg-default-100 font-IBM-Thai font-medium"
              startContent={<ArrowDownUp size={20} />}
            >
              จัดเรียง
            </Button>
            <Button
              className="bg-default-100 font-IBM-Thai font-medium"
              startContent={<VideoLucide size={20} />}
            >
              เพิ่มลด เนื้อหา
            </Button>
          </div>
        </div>
        <Divider className="mt-2" />
        <div className="mt-2 flex flex-col gap-2 items-center">
          <div className="text-danger-500 text-sm font-IBM-Thai-Looped text-center">
            กรุณาใส่เอกสาร
          </div>
          <Button
            className="bg-default-100 font-IBM-Thai font-medium"
            startContent={<Book size={20} />}
          >
            เอกสาร
          </Button>
        </div>
      </div>
      <div className="hidden mt-2 bg-content1 rounded-lg p-2">
        <div className="flex justify-between items-center">
          <div className="text-lg font-IBM-Thai-Looped font-medium">
            2. Force and Acceleration
          </div>
          <Button size="sm" isIconOnly className="bg-transparent">
            <MoreHorizontal size={24} />
          </Button>
        </div>
        <Divider className="mt-2" />
        <div className="mt-2 font-IBM-Thai-Looped">
          <div className="flex p-1 items-center">
            <div className="w-8 flex">
              <Video className="text-foreground-400" size={16} />
              <FileText className="text-foreground-400" size={16} />
            </div>
            <div className="ml-1 flex-1">
              Dynamics - 2.1 Force and Acceleration
            </div>
            <div className="text-sm text-foreground-400">99 นาที</div>
          </div>
          <div className="flex p-1 items-center">
            <div className="w-8 flex">
              <Video className="text-foreground-400" size={16} />
              <FileText className="text-foreground-400" size={16} />
            </div>
            <div className="ml-1 flex-1">Dynamics - 2.2 Friction</div>
            <div className="text-sm text-foreground-400">59 นาที</div>
          </div>
          <div className="flex p-1 items-center">
            <div className="w-8 flex">
              <Video className="text-foreground-400" size={16} />
            </div>
            <div className="ml-1 flex-1">Dynamics - 2.3 Friction Pt2</div>
            <div className="text-sm text-foreground-400">74 นาที</div>
          </div>
          <div className="flex justify-center gap-2">
            <Button
              className="bg-default-100 font-IBM-Thai font-medium"
              startContent={<ArrowDownUp size={20} />}
            >
              จัดเรียง
            </Button>
            <Button
              className="bg-default-100 font-IBM-Thai font-medium"
              startContent={<VideoLucide size={20} />}
            >
              เพิ่มลด เนื้อหา
            </Button>
          </div>
        </div>
        <Divider className="mt-2" />
        <div className="mt-2 flex flex-col gap-2 items-center">
          <div className="text-danger-500 text-sm font-IBM-Thai-Looped text-center">
            กรุณาใส่เอกสาร
          </div>
          <Button
            className="bg-default-100 font-IBM-Thai font-medium"
            startContent={<Book size={20} />}
          >
            เอกสาร
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageLesson;
