"use client";
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
} from "@nextui-org/react";
import React, { useMemo, useState } from "react";
import {
  ArrowDownUp,
  Book,
  ChevronDown,
  ClipboardSignature,
  FileText,
  MoreHorizontal,
  PenSquare,
  Plus,
  ScrollText,
  Trash2,
  Video as VideoLucide,
  X,
} from "lucide-react";
import { Danger, Video } from "iconsax-react";
import { addLessonToDB, changePositionLesson } from "@/lib/actions/lesson.actions";
import { CourseLesson, CourseVideo, DocumentBook, DocumentPreExam, DocumentSheet } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { changePositionVideoAction } from "@/lib/actions/video.actions";
import ManageContent from "./Course/ManageContent";
import SortLessonModal from "./Course/Lesson/SortLessonModal";
import SortContentModal from "./Course/Lesson/SortContentModal";
import AddDocumentToLesson from "./Course/Lesson/AddDocumentToLesson";
import { listCourseAction } from "@/lib/actions/course.actions";
import EditVideoDetail from "./Course/CourseVideo/EditVideoDetail";
import EditLessonName from "./Course/Lesson/EditLessonName";
import DeleteLesson from "./Course/Lesson/DeleteLesson";
import AddLesson from "./Course/Lesson/AddLesson";
import EditDocument from "./Course/Document/EditDocument";
import { listBooksAction } from "@/lib/actions/book.actions";

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
  const {
    refetch: refetchCourse,
  } = useQuery({
      queryKey: ["listCourseAction"],
      queryFn: () => listCourseAction(),
  });

  const {
    refetch: refetchBookList,
  } = useQuery({
    queryKey: ["listBooksAction"],
    queryFn: () => listBooksAction(),
 })

  const [isSort, setIsSort] = useState(false);
  const [lessonError, setLessonError] = useState({
    isError: false,
    message: "",
  });
  const [isAddLesson, setIsAddLesson] = useState(false);
  const [isEditLesson, setIsEditLesson] = useState(false);
  const [isDeleteLesson, setIsDeleteLesson] = useState(false);
  const [editLessonContent, setEditLessonContent] = useState(false);
  const [videoListInLesson, setVideoListInLesson] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<any | undefined>();
  
  const [isOpenAddDocument, setIsOpenAddDocument] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any | undefined>()
  const [isOpenSortLesson, setIsOpenSortLesson] = useState(false)

  const [selectedVideo, setSelectedVideo] = useState<CourseVideo| undefined>()
  const [isOpenVideoDetail, setIsOpenVideoDetail] = useState(false)
  const [isOpenEditDocument, setIsOpenEditDocument] = useState(false)

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

  const submitChangePositionVideo = async (newCourseVideoList: CourseVideo[]) => {
    for (let i = 0; i < newCourseVideoList.length; i++) {
      const video = newCourseVideoList[i];
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

  const handleOnCloseSortLesson = () => {
    setIsOpenSortLesson(false)
  }

  const submitSortLesson = async (newLessonList: CourseLesson[]) => {
    for (let i = 0; i < newLessonList.length; i++) {
      const lesson = newLessonList[i];
      const response = await changePositionLesson(lesson.id, i)
      console.log(response);
    }
    await refetchCourse()
    handleOnCloseSortLesson()
  }

  const handleOnClickSortContent = (lesson: CourseLesson) => {
    setSelectedLesson(lesson)
    setIsSort(true)
  }

  const handleOnCloseSortContent = () => {
    setSelectedLesson(undefined)
    setIsSort(false)
  }

  const handleOnConfirmAddDocument = (type: string) => {
    setSelectedLesson(undefined)
    refetchCourse()
    if(type === "book"){
      refetchBookList()
    }
  }

  const handleOnOpenVideoDetail = (courseVideo: CourseVideo) => {
    console.log("courseVideo", courseVideo);
    setIsOpenVideoDetail(true)
    setSelectedVideo(courseVideo)
  }

  const handleOnCloseVideoDetail = () => {
    setIsOpenVideoDetail(false)
    setSelectedVideo(undefined)
  }

  const handleOnClickChangeLessonName = (lesson: any) => {
    setSelectedLesson(lesson)
    setIsEditLesson(true)
  }

  const handleOnClickDeleteLesson = (lesson: any) => {
    setSelectedLesson(lesson)
    setIsDeleteLesson(true)
  }

  const handleOnClickEditDocument = (document: any, lesson: any) => {
    console.log("document", document);
    setSelectedDocument(document)
    setSelectedLesson(lesson)
    setIsOpenEditDocument(true)
  }

  const handleOnEditDocumentSuccess = (type: string) => {
    refetchCourse()
    if(type === "book"){
      refetchBookList()
    }
  }

  return (
    <div className={`bg-default-100 p-app md:min-w-[469px] md:w-[469px] overflow-y-auto ${className}`}>
      <EditVideoDetail
        isOpen={isOpenVideoDetail}
        onClose={handleOnCloseVideoDetail}
        video={selectedVideo}
      />
      <EditDocument
        isOpen={isOpenEditDocument}
        document={selectedDocument}
        onClose={() => setIsOpenEditDocument(false)}
        onConfirm={handleOnEditDocumentSuccess}
        lessonId={selectedLesson?.id}
      />
      <AddDocumentToLesson
        open={isOpenAddDocument}
        onClose={handleOnCloseAddDocument}
        onConfirm={handleOnConfirmAddDocument}
        lessonId={selectedLesson?.id}
      />
      <SortLessonModal
        isOpen={isOpenSortLesson}
        lessonList={lessons as CourseLesson[]}
        onClose={handleOnCloseSortLesson}
        onConfirm={submitSortLesson}
      />
      {/* sort video content */}
      {selectedLesson &&
        <SortContentModal
          courseVideoList={selectedLesson.CourseVideo}
          open={isSort}
          onClose={handleOnCloseSortContent}
          onConfirm={submitChangePositionVideo}
        />
      }
      {/* Delete lesson */}
      <DeleteLesson
        isOpen={isDeleteLesson}
        onClose={() => setIsDeleteLesson(false)}
        lesson={selectedLesson}
      />
      {/* Edit lesson name */}
      <EditLessonName
        isOpen={isEditLesson}
        lesson={selectedLesson}
        onClose={() => setIsEditLesson(false)}
      />
      {/* add lesson modal */}
      <AddLesson
        isOpen={isAddLesson}
        courseId={courseId}
        onClose={() => setIsAddLesson(false)}
        position={lessons?.length ?? 1}
      />
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
        <Button
          size="sm"
          className="bg-transparent"
          isIconOnly
          onClick={() => setIsOpenSortLesson(true)}
        >
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
      {lessons?.sort((a, b) => a.position - b.position).map((lesson, index) => {
        const hasDocument = lesson.LessonOnDocumentSheet.length > 0 || lesson.LessonOnDocument.length > 0 || lesson.LessonOnDocumentBook.length > 0
        const documentList = [
          ...lesson.LessonOnDocumentSheet.map((sheet: DocumentSheet) => ({...sheet, type: 'sheet'})),
          ...lesson.LessonOnDocumentBook.map((book: DocumentBook) => ({...book, type: 'book'})),
          ...lesson.LessonOnDocument.map((preExam: DocumentPreExam) => ({...preExam, type: 'preExam'})),
        ]
        return (
          <div key={`lesson${index}`} className={`mt-2 bg-content1 rounded-lg p-2 ${hasDocument ? '' : 'border-2 border-danger-500'}`}>
            <div className="flex justify-between items-center">
              <div className="text-lg font-IBM-Thai-Looped font-medium">
                {lesson.name}
              </div>
              <Dropdown
                classNames={{
                  content: 'w-max min-w-[158px]'
                }}
              >
                <DropdownTrigger>
                  <Button size="sm" isIconOnly className="bg-transparent">
                    <MoreHorizontal size={24} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="lesson action" onAction={(key) => {
                  if(key === "changeName"){
                    handleOnClickChangeLessonName(lesson)
                  }else if(key === "delete"){
                    handleOnClickDeleteLesson(lesson)
                  }
                }}>
                  <DropdownItem className={`text-default-foreground font-serif`} startContent={<PenSquare size={16} />} key={`changeName`}>
                    เปลี่ยนชื่อ
                  </DropdownItem>
                  <DropdownItem className={`text-danger-500 font-serif`} key={`delete`} startContent={<Trash2 size={16} />}>
                    ลบ
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <Divider className="mt-2" />
            <div className=" mt-2 font-IBM-Thai-Looped">
              {lesson.CourseVideo.sort((a: any, b: any) => a.position - b.position).map((courseVideo: CourseVideo, index: number) => {
                return (
                  <div onClick={() => handleOnOpenVideoDetail(courseVideo)} key={`video${index}`} className="flex p-1 items-center cursor-pointer">
                    <div className="w-8 flex">
                      <Video className="text-foreground-400" size={16} />
                      {courseVideo.descriptionId &&
                        <FileText className="text-foreground-400" size={16} />
                      }
                    </div>
                    <div className="ml-1 flex-1">
                      {/* Dynamics - 1.1 Velocity and Acceleration */}
                      {courseVideo.name}
                    </div>
                    <div className="text-sm text-foreground-400">{(courseVideo.hour * 60) + courseVideo.minute} นาที</div>
                  </div>
                );
              })}
              {/* manage lesson content */}
              <div className="flex justify-center gap-2">
                <Button
                  onClick={() => handleOnClickSortContent(lesson)}
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
            <div>
              {documentList.map((document) => {
                if(document.type === "sheet"){
                  return (
                    <div onClick={() => handleOnClickEditDocument(document, lesson)} className={`cursor-pointer mt-2 flex gap-2 font-IBM-Thai-Looped`} key={`documentSheet${document.id}${lesson.id}`}>
                      <ClipboardSignature size={20} />
                      <div>
                        {document.DocumentSheet.name}
                      </div>
                    </div>
                  )
                }else if(document.type === "book"){
                  return (
                    <div onClick={() => handleOnClickEditDocument(document, lesson)} className={`cursor-pointer mt-2 flex items-center gap-2 font-IBM-Thai-Looped`} key={`documentBook${document.id}${lesson.id}`}>
                      <Image className={`h-10 rounded`} src={document.DocumentBook.image} alt="book image" />
                      <div>
                        {document.DocumentBook.name}
                      </div>
                    </div>
                  )
                }else if(document.type === "preExam"){
                  return (
                    <div onClick={() => handleOnClickEditDocument(document, lesson)} className={`cursor-pointer mt-2 flex gap-2 font-IBM-Thai-Looped`} key={`documentPreExam${document.id}${lesson.id}`}>
                      <ScrollText size={20} />
                      <div>
                        {document.DocumentPreExam.name}
                      </div>
                    </div>
                  )
                }else{
                  return <div key={`unknowDocument${index}`}></div>
                }
              })}
            </div>
            <div className="mt-2 flex flex-col gap-2 items-center">
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
    </div>
  );
};

export default ManageLesson;
