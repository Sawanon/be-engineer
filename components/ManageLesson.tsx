"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Divider,
  Input,
  Modal,
  ModalContent,
} from "@nextui-org/react";
import React, { Key, useMemo, useState } from "react";
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
import { addDocumentToLesson, addLessonToDB } from "@/lib/actions/lesson.actions";
import { CourseLesson, CourseVideo } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  getDetailPlayList,
  listPlayList,
} from "@/lib/actions/playlist.actions";
import { addCourseVideo, changePositionVideoAction, deleteCourseVideo, swapPositionVideo } from "@/lib/actions/video.actions";
import ManageContent from "./Course/ManageContent";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useCourse } from "./Course/courseHook";
import { listDocument } from "@/lib/actions/document.action";

// export type CourseLessonAndContent = CourseLesson & {
//   CourseVideo: CourseVideo,
// }

const ManageLesson = ({
  courseId,
  lessons,
  onFetch,
  mode,
  className,
}: {
  courseId: number;
  lessons?: any[];
  onFetch?: () => Promise<void>;
  mode: "tutor" | "admin"
  className: string
}) => {
  // const [lessons, setLessons] = useState([
  //   { id: 1, title: "Dynamics - 1.1 Velocity and Acceleration" },
  //   { id: 2, title: "Dynamics - 1.2 Graphical" },
  //   { id: 3, title: "Dynamics - 1.3 X-Y Coordinate" },
  // ]);
  const [refetchCourse] = useCourse()
  const [isSort, setIsSort] = useState(false);
  const [lessonError, setLessonError] = useState({
    isError: false,
    message: "",
  });
  const [isAddLesson, setIsAddLesson] = useState(false);
  const [lessonName, setLessonName] = useState<string | undefined>();
  const [editLessonContent, setEditLessonContent] = useState(false);
  const [videoList, setVideoList] = useState([]);
  const [selectedVideoPlaylist, setSelectedVideoPlaylist] = useState<any>();
  const [videoListInLesson, setVideoListInLesson] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<any | undefined>();

  const { data: documentList } = useQuery({
    queryKey: ['listDocument'],
    queryFn: () => listDocument()
  })
  const [isOpenAddDocument, setIsOpenAddDocument] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<number | undefined>()

  const handleOnChangeLessonName = (value: string) => {
    setLessonName(value);
  };

  const addLesson = async () => {
    console.log("courseId", courseId);
    console.log("lessonName", lessonName);
    if (!lessonName) {
      return;
    }
    const position = lessons ? lessons.length + 1 : 1;
    await addLessonToDB(courseId, {
      name: lessonName,
      position: position,
    });
    setIsAddLesson(false);
    if(onFetch){
      onFetch()
    }
  };

  const handleOnCloseEditLessonVideo = () => {
    setSelectedLesson(undefined);
    setEditLessonContent(false);
    setVideoListInLesson([])
  };

  const handleClickManageContent = async (lesson: any) => {
    setSelectedLesson(lesson);
    setEditLessonContent(true);
    setVideoListInLesson(lesson.CourseVideo)
  }

  const changePositionVideo = async (firstVideoId: UniqueIdentifier, secondVideoId: UniqueIdentifier) => {
    console.table({firstVideoId, secondVideoId})
      
    // const firstVideo = selectedLesson.CourseVideo.find((video: any) => video.id === firstVideoId)
    // const secondVideo = selectedLesson.CourseVideo.find((video: any) => video.id === secondVideoId)
    // console.table({firstVideo, secondVideo})
    // const response = await swapPositionVideo(firstVideo, secondVideo)
    // console.log("swapPositionVideo", response);
    // await refetchCourse()
  }

  const submitChangePositionVideo = async () => {
    for (let i = 0; i < selectedLesson.CourseVideo.length; i++) {
      const video = selectedLesson.CourseVideo[i];
      console.log(video.name);
      const response = await changePositionVideoAction(video.id, i)
      console.log(response);
    }
    await refetchCourse()
  }

  useMemo(() => {
    if(!selectedLesson) return
    setSelectedLesson(lessons?.find(lesson => lesson.id === selectedLesson.id))
  }, [lessons])

  const handleOnClickAddDocument = (lesson: any) => {
    setSelectedLesson(lesson)
    setIsOpenAddDocument(true)
  }

  const handleOnCloseAddDocument = () => {
    setSelectedLesson(undefined)
    setIsOpenAddDocument(false)
  }

  const handleOnChangeDocument = (key : Key | null) => {
    if(!key)return
    setSelectedDocument(parseInt(key.toString()))
  }

  const submitAddDocumentToLesson = async () => {
    if(!selectedDocument) return
    const response = await addDocumentToLesson(selectedDocument, selectedLesson.id)
    console.log(response)
    handleOnCloseAddDocument()
    refetchCourse()
  }

  return (
    <div className={`bg-default-100 p-[14px] md:min-w-[469px] md:w-[469px] overflow-y-auto ${className}`}>
      <Modal
        isOpen={isOpenAddDocument}
      >
        <ModalContent className={`p-app`} >
          <div className={`flex items-center`}>
            <div className={`flex-1`}></div>
            <div className={`flex-1 text-center text-3xl font-semibold font-IBM-Thai`}>เอกสาร</div>
            <div className={`flex-1 flex items-center justify-end`}>
                <Button onClick={handleOnCloseAddDocument} className={`min-w-0 w-8 max-w-8 max-h-8 bg-primary-foreground`} isIconOnly><X /></Button>
            </div>
          </div>
          <div className={`mt-app`}>
            {/* <Input
                placeholder={`ชื่อเอกสาร`}
                aria-label={`ชื่อเอกสาร`}
                // onChange={(e) => setDocumentName(e.target.value)}
            /> */}
            <Autocomplete
              onSelectionChange={handleOnChangeDocument}
            >
              {
                documentList?
              documentList?.map((document, index) => {
                return (
                  <AutocompleteItem key={document.id}>
                    {document.name}
                  </AutocompleteItem>
                )
              })
            : (
              <AutocompleteItem key={`loading`}>
                loading...
              </AutocompleteItem>
            )}
            </Autocomplete>
          </div>
          <Button
            onClick={submitAddDocumentToLesson}
            className={`mt-[22px] bg-default-foreground text-primary-foreground font-IBM-Thai font-medium text-base`}
          >
            บันทึก
          </Button>
        </ModalContent>
      </Modal>
      <Modal
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
                  courseVideoList={selectedLesson.CourseVideo}
                  onDragEnd={(event) => {
                    // console.log(`event.collisions`, event.collisions);
                    const cloneVideo = [...selectedLesson.CourseVideo]
                    const { active, over } = event;
                    console.table({ active, over })
                    const originalPos = cloneVideo.findIndex(
                      (video: any) => video.id === active.id
                    );
                    console.log("🚀 ~ originalPos:", originalPos)
                    const newPos = cloneVideo.findIndex(
                      (lesson: any) => lesson.id === over!.id
                    );
                    const newPosition = arrayMove(cloneVideo, originalPos, newPos)
                    console.log(newPosition);
                    setSelectedLesson((prev: any) => ({
                      ...prev,
                      CourseVideo: newPosition,
                    }))
                    // if(!over) return
                    // changePositionVideo(active.id, over.id)
                    // setLessons((lessons) => {
                    //   const originalPos = lessons.findIndex(
                    //     (lesson) => lesson.id === active.id
                    //   );
                    //   const newPos = lessons.findIndex(
                    //     (lesson) => lesson.id === over!.id
                    //   );
                    //   return arrayMove(lessons, originalPos, newPos);
                    // });
                    // setLessons(event.collisions)
                  }}
                />
              </div>
              <div className={`mt-app`}>
                <Button onClick={submitChangePositionVideo} fullWidth className={`bg-default-foreground text-primary-foreground font-medium text-base font-IBM-Thai`}>
                  ตกลง
                </Button>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
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
                <div
                  onClick={() => setIsAddLesson(false)}
                  className="cursor-pointer flex-1 flex justify-end items-center"
                >
                  <X size={32} />
                </div>
              </div>
              <Input
                size="lg"
                className="font-IBM-Thai-Looped text-lg font-medium mt-3"
                classNames={{
                  input: "font-IBM-Thai-Looped text-lg font-medium",
                }}
                placeholder="ชื่อบทเรียน"
                onChange={(e) => handleOnChangeLessonName(e.target.value)}
              />
              <Button
                className={`mt-3 text-base font-medium font-IBM-Thai bg-default-foreground text-primary-foreground`}
                fullWidth
                onClick={() => addLesson()}
              >
                บันทึก
              </Button>
            </div>
          )}
        </ModalContent>
      </Modal>
      <ManageContent
        isOpen={editLessonContent}
        onConfirm={() => {
          handleOnCloseEditLessonVideo()
        }}
        onCancel={handleOnCloseEditLessonVideo}
        lesson={selectedLesson}
        onSuccess={() => {

        }}
      />
      <div className="flex items-center gap-3">
        <div className="font-bold text-2xl font-IBM-Thai">หลักสูตร</div>
        <Button size="sm" className="bg-transparent" isIconOnly>
          <ChevronDown size={24} />
        </Button>
      </div>
      {/* error */}
      {lessonError.isError && (
        <div className="mt-2 rounded-lg bg-danger-50 text-danger-500 border-l-4 border-danger-500 flex items-center gap-2 py-2 px-[14px]">
          <Danger variant="Bold" />
          <div className="font-IBM-Thai-Looped font-normal">
            {lessonError.message}
            {/* กรุณาใส่เอกสารในเนื้อหา */}
          </div>
        </div>
      )}
      {/* add lesson */}
      {lessons?.length === 0 &&
        <div className={`flex justify-center mt-2`}>
          <Button
            startContent={<Plus />}
            className={`bg-default-foreground text-primary-foreground font-IBM-Thai text-base font-medium`}
            onClick={() => setIsAddLesson(true)}
          >
            บทเรียน
          </Button>
        </div>
      }
      {lessons?.map((lesson, index) => {
        return (
          <div key={`lesson${index}`} className="mt-2 bg-content1 rounded-lg p-2 border-2 border-danger-500">
            <div className="flex justify-between items-center">
              <div className="text-lg font-IBM-Thai-Looped font-medium">
                {lesson.name}
              </div>
              <Button size="sm" isIconOnly className="bg-transparent">
                <MoreHorizontal size={24} />
              </Button>
            </div>
            <Divider className="mt-2" />
            <div className=" mt-2 font-IBM-Thai-Looped">
              {lesson.CourseVideo.sort((a: any, b: any) => a.position - b.position).map((courseVideo: any, index: number) => {
                return (
                  <div key={`video${index}`} className="flex p-1 items-center">
                    <div className="w-8 flex">
                      <Video className="text-foreground-400" size={16} />
                      <FileText className="text-foreground-400" size={16} />
                    </div>
                    <div className="ml-1 flex-1">
                      {/* Dynamics - 1.1 Velocity and Acceleration */}
                      {courseVideo.name}
                    </div>
                    <div className="text-sm text-foreground-400">{(courseVideo.hour * 60) + courseVideo.minute} นาที</div>
                  </div>
                );
              })}
              {/* <div className="flex p-1 items-center">
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
              </div> */}
              {/* manage lesson content */}
              <div className="flex justify-center gap-2">
                <Button
                  onClick={() => {
                    setSelectedLesson(lesson)
                    setIsSort(true)
                  }}
                  className="bg-default-100 font-IBM-Thai font-medium"
                  startContent={<ArrowDownUp size={20} />}
                >
                  จัดเรียง
                </Button>
                <Button
                  className="bg-default-100 font-IBM-Thai font-medium"
                  startContent={<VideoLucide size={20} />}
                  onClick={() => handleClickManageContent(lesson)}
                >
                  เพิ่มลด เนื้อหา
                </Button>
              </div>
            </div>
            <Divider className="mt-2" />
            <div className="mt-2 flex flex-col gap-2 items-center">
              {lesson.LessonOnDocumentSheet.length === 0
              ?
              <div className="text-danger-500 text-sm font-IBM-Thai-Looped text-center">
                กรุณาใส่เอกสาร
              </div>
              :
              lesson.LessonOnDocumentSheet.map((documentSheet: any, index: number) => {
                return (
                  <div className={`flex gap-2 font-IBM-Thai-Looped`} key={documentSheet.id}>
                    <ClipboardSignature size={20} />
                    <div>
                      {documentSheet.DocumentSheet.name}
                    </div>
                  </div>
                )
              })
              }
              <Button
                className="bg-default-100 font-IBM-Thai font-medium"
                startContent={<Book size={20} />}
                onClick={() => handleOnClickAddDocument(lesson)}
              >
                เอกสาร
              </Button>
            </div>
          </div>
        );
      })}

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
