"use client";
import {
  deleteCourse,
  duplicationCourseAction,
  listCourseAction,
  listCourseWebapp,
  searchImageByCourseName,
} from "@/lib/actions/course.actions";
import { PlayList } from "@/lib/model/playlist";
import { Course } from "@/lib/model/course";
import React , { useMemo, useState } from "react";
import CustomDrawer from "./Drawer";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  RefreshCcw,
} from "lucide-react";
import {
  Button,
  Divider,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Snippet,
} from "@nextui-org/react";
import ManageLesson from "./ManageLesson";
import copy from "copy-to-clipboard";
import { useQuery } from "@tanstack/react-query";
import StatusIcon from "./Course/StatusIcon";
import { CourseVideo } from "@prisma/client";
import ConectWebAppModal from "./Course/ConectWebAppModal";
import LessonAdminMode from "./Course/LessonAdminMode";
import DeleteCourseDialog from "./Course/DeleteCourseDialog";
import AddCourseForm from "./Course/AddCourseForm";
import EditCourseForm from "./Course/EditCourseForm";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const ManageCourse = ({
  isOpenDrawer,
  selectedCourse,
  onClose,
  onConfirmAdd,
  onFetch,
}: {
  isOpenDrawer: boolean;
  selectedCourse: Course | undefined | null;
  onClose: () => void;
  onConfirmAdd: (courseId: number) => Promise<void>;
  onFetch?: () => Promise<void>;
}) => {
  const searchParams = useSearchParams()
  const { data: webappBranchCourseList, isFetched } = useQuery({
    queryKey: [`listCourseWebapp`],
    queryFn: () => listCourseWebapp(),
  });
  const sheets = (selectedCourse as any)?.uniqueSheets as any[] ?? []
  const preExam = (selectedCourse as any)?.uniquePreExam as any[] ?? []
  const books = (selectedCourse as any)?.uniqueBooks as any[] ?? []
  const documentNumber = sheets.length + preExam.length + books.length
  // const [refetchCourse] = useCourse();
  const {
    refetch: refetchCourse,
 } = useQuery({
    queryKey: ["listCourseAction"],
    queryFn: () => listCourseAction(),
 });
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [manageCourseMode, setManageCourseMode] = useState<'add' | 'edit' | 'show'>('add')
  
  const [isDelete, setIsDelete] = useState(false);
  const [isDeleteCourse, setIsDeleteCourse] = useState(false);
  const [errorDeleteCourse, setErrorDeleteCourse] = useState({
    isError: false,
    message: "ลบไม่สำเร็จ ดูเพิ่มเติมใน Console",
  });

  const [isSort, setIsSort] = useState(false);
  const [courseName, setCourseName] = useState<string | undefined>();
  const [courseDetail, setCourseDetail] = useState<string | undefined>();
  const [courseTutorId, setCourseTutorId] = useState<number | undefined>();
  const [clueLink, setCourseLink] = useState<string | undefined>();
  const [playlist, setPlaylist] = useState<string | undefined>();
  const [price, setPrice] = useState<number | undefined>();
  const [addCourseError, setAddCourseError] = useState({
    isError: false,
    message: "",
  });
  const [mode, setMode] = useState<"tutor" | "admin">("tutor");
  const [courseImageList, setCourseImageList] = useState<string[]>([]);
  const [webappCourseList, setWebappCourseList] = useState<
    | { id: number; name: string; image: string; hasFeedback: boolean; term: string; }[]
    | undefined
  >();
  const [isOpenConectWebapp, setIsOpenConectWebapp] = useState(false)
  const [isLoadingDuplicate, setIsLoadingDuplicate] = useState(false)

  const listImageCourse = async (courseName: string) => {
    const response = await searchImageByCourseName(courseName);
    setCourseImageList(response);
  };

  useMemo(() => {
    const mode = searchParams.get('mode')
    if(mode){
      const typeMode = mode === 'admin' ? 'admin' : 'tutor'
      setMode(typeMode)
    }
  }, [searchParams.get('mode')])

  useMemo(() => {
    if(!selectedCourse){
      setCourseImageList([])
    }
    setIsAdd(selectedCourse === undefined);
    setManageCourseMode(selectedCourse === undefined ? 'add' : 'show')
    if (selectedCourse) {
      listImageCourse(selectedCourse.name);
    }
  }, [selectedCourse]);

  useMemo(() => {
    if (!selectedCourse) return;
    if (!webappBranchCourseList) return;
    console.log(webappBranchCourseList);
    const webappCourseList = webappBranchCourseList.find(
      (webappBranch) => webappBranch.branch === selectedCourse.branch
    )?.courses;
    setWebappCourseList(webappCourseList);
  }, [isFetched, selectedCourse]);

  const handleClose = () => {
    setIsEdit(false);
    setIsDelete(false);
    setIsAdd(true);
    clearData();
    onClose();
  };

  const clearData = () => {
    setCourseName(undefined);
    setCourseDetail(undefined);
    setCourseTutorId(undefined);
    setCourseLink(undefined);
    setPlaylist(undefined);
    setPrice(undefined);
  };

  const handleDeleteCourse = async () => {
    setIsDeleteCourse(true)
  };

  const handleSwitchMode = () => {
    setMode((prev) => (prev === "tutor" ? "admin" : "tutor"));
  };

  const renderHourCourse = () => {
    if(!selectedCourse) return {hour: 0, minute: 0, totalHour: 0}
    let totalMinute = 0
    selectedCourse.CourseLesson.forEach((lesson:any) => {
      const courseVideoList: CourseVideo[] = lesson.CourseVideo
      courseVideoList.forEach(courseVideo => {
        totalMinute += (courseVideo.hour*60) + (courseVideo.minute)
      })
    })
    const hour = Math.floor(totalMinute / 60)
    const minute = totalMinute % 60
    let totalHour = 0
    if(hour < 20){
      totalHour = Math.round((hour + (minute / 60)) * 1.5)
    }else if(hour >= 20) {
      totalHour = Math.round(hour + (minute / 60)) + 10
    }
    return {
      hour,
      minute,
      totalHour,
    }
  }
  const {hour, minute, totalHour} = renderHourCourse()

  const handleOnClickConectionWebapp = () => {
    setIsOpenConectWebapp(true)
  }

  const handleOnCloseConectionWebapp = () => {
    setIsOpenConectWebapp(false)
  }

  const renderWebappCourse = (courseId: number) => {
    if(!webappCourseList) return <div>Loading...</div>
    const webappCourse = webappCourseList.find(course => course.id === courseId)
    return (
      <div className={`flex items-center py-[6px] px-2 gap-1 flex-1`}>
        <Image src={`${webappCourse?.image}`} className={`h-10 w-10 rounded`} />
        <div className={`flex-1 font-IBM-Thai-Looped text-start`}>
          <div className={`font-normal text-base text-default-foreground`}>
            {webappCourse?.name}
          </div>
          <div className={`text-xs text-default-500`}>
            {webappCourse?.term}
          </div>
          {selectedCourse?.branch === "KMITL" &&
            <div className={`text-xs font-normal text-default-500 rounded bg-default-200 w-max px-1 py-[2px]`}>
              KMITL
            </div>
          }
        </div>
      </div>
    )
  }

  const confirmDeleteCourse = async () => {
    if (!selectedCourse) {
        return;
    }
    const res = await deleteCourse(selectedCourse.id);
    console.log(res);
    if (!res) {
        setErrorDeleteCourse((prev) => ({ ...prev, isError: true }));
        return;
    }
    setIsDeleteCourse(false);
    handleClose();
    refetchCourse();
  };

  const handleCloseDeleteCourseDialog = () => {
    setErrorDeleteCourse((prev) => ({ ...prev, isError: false }));
    setIsDeleteCourse(false);
  };

  const handleOnAddSuccess = async (courseId: number) => {
    await onConfirmAdd(courseId)
    setManageCourseMode('show')
  }

  const handleOnClickDuplicate = async () => {
    try {
      if(selectedCourse){
        setIsLoadingDuplicate(true)
        const responseDuplicate = await duplicationCourseAction(selectedCourse.id)
        if(!responseDuplicate) throw `responseDuplicate is ${responseDuplicate}`
        if(typeof responseDuplicate === "string") throw responseDuplicate
        handleClose()
        if(onFetch) onFetch()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoadingDuplicate(false)
    }
  }

  return (
    <CustomDrawer
      isOpen={isOpenDrawer}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DeleteCourseDialog
        isOpen={isDeleteCourse}
        title={`แน่ใจหรือไม่ ?`}
        error={errorDeleteCourse}
        onConfirm={async () => {
          await confirmDeleteCourse()
        }}
        onCancel={handleCloseDeleteCourseDialog}
        detail={
          <>
            <div>
              คุณแน่ใจหรือไม่ที่จะลบ
            </div>
            <div>
              คอร์ส {selectedCourse?.name}
            </div>
          </>
        }
      />
      <ConectWebAppModal
        isOpen={isOpenConectWebapp}
        onClose={handleOnCloseConectionWebapp}
        branch={selectedCourse?.branch}
        webappCourseId={selectedCourse?.webappCourseId}
        courseId={selectedCourse?.id}
        books={books}
        onSuccess={refetchCourse}
      />
      {/* <div className="block md:flex h-full w-auto overflow-auto"> */}
      <div className="block md:flex w-auto overflow-auto md:h-full">
        <div className="min-w-[342px] md:w-[342px] p-[14px]">
          {/* TODO: add course */}
          <div className="flex justify-between">
            <Button onClick={handleClose} className="bg-default-100" isIconOnly>
              <ArrowLeft size={24} />
            </Button>
            <Button
              className="bg-default-100 font-IBM-Thai"
              endContent={<RefreshCcw size={20} />}
              onClick={handleSwitchMode}
            >
              {mode === "tutor" ? `แอดมิน` : `ติวเตอร์`}
            </Button>
          </div>
          {mode === "admin" ? (
            // admin mode
            <div className={`mt-app`}>
              <div className={`flex gap-1 items-center`}>
                <StatusIcon status={selectedCourse?.status!} />
                <Popover placement="top">
                  <PopoverTrigger className={`cursor-pointer`}>
                    <div
                      className={`rounded-lg px-1 bg-default-50 text-lg font-bold font-IBM-Thai-Looped text-content4-foreground`}
                      tabIndex={0}
                      onClick={() => copy(selectedCourse?.name ?? "")}
                    >
                      {selectedCourse?.name}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2">Copied</div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className={`mt-2 flex gap-2 overflow-auto scrollbar-hide`}>
                {courseImageList.map((imageUrl, index) => {
                  return (
                    <Link href={`${imageUrl}`} target="_blank">
                      <div
                        key={`imageCourse${index}`}
                        className={`min-w-[100px] w-[100px] h-[100px]`}
                      >
                        <Image
                          key={`courseImage${index}`}
                          src={`${imageUrl}`}
                          width={100}
                          height={100}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
              <Popover placement="top">
                <PopoverTrigger className={`cursor-pointer`}>
                  <div
                    className={`mt-2 px-1 rounded-lg bg-default-50 text-base font-normal font-IBM-Thai-Looped`}
                    onClick={() => copy(selectedCourse?.detail ?? "")}
                  >
                    {selectedCourse?.detail}
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2">Copied</div>
                </PopoverContent>
              </Popover>
              <div className={`mt-2 flex gap-2 items-center`}>
                <div
                  className={`font-IBM-Thai-Looped text-base font-normal text-default-foreground`}
                >
                  Link เฉลย
                </div>
                <Snippet
                  codeString={selectedCourse?.clueLink!}
                  hideSymbol
                  variant="flat"
                  className={`p-0 gap-0 bg-default-100 text-default-foreground`}
                  copyIcon={<Copy size={24} />}
                  classNames={{
                    base: "p-0",
                    symbol: `p-0 hidden`,
                  }}
                />
              </div>
              <div className={`mt-2 flex gap-2 items-center`}>
                <div
                  className={`font-IBM-Thai-Looped text-base font-normal text-default-foreground`}
                >
                  Link ติวเตอร์: {selectedCourse?.Tutor?.name}
                </div>
                <Snippet
                  codeString={selectedCourse?.tutorLink!}
                  hideSymbol
                  variant="flat"
                  className={`p-0 gap-0 bg-default-100 text-default-foreground`}
                  copyIcon={<Copy size={24} />}
                  classNames={{
                    base: "p-0",
                    symbol: `p-0 hidden`,
                  }}
                />
              </div>
              <div className={`mt-2 flex gap-1 font-IBM-Thai-Looped`}>
                <div>ชั่วโมงเรียน:</div>
                <Popover placement="right">
                  <PopoverTrigger className={`cursor-pointer`}>
                    <div
                      tabIndex={0}
                      className={`px-1 bg-default-50 rounded-lg`}
                      onClick={() => {
                        copy(`${totalHour}`);
                      }}
                    >
                      {totalHour}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2">Copied</div>
                  </PopoverContent>
                </Popover>
                <div>ชั่วโมง</div>
              </div>
              <div className={`mt-2 flex gap-1 font-IBM-Thai-Looped`}>
                <div>วิดีโอเพล์ลิส:</div>
                <Popover placement="right">
                  <PopoverTrigger className={`cursor-pointer`}>
                    <div
                      tabIndex={0}
                      className={`px-1 bg-default-50 rounded-lg`}
                      onClick={() => {
                        copy(selectedCourse?.playlist!);
                      }}
                    >
                      {selectedCourse?.playlist}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2">Copied</div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className={`mt-2 flex gap-1 font-IBM-Thai-Looped`}>
                <div>ราคา:</div>
                <Popover placement="right">
                  <PopoverTrigger className={`cursor-pointer`}>
                    <div
                      tabIndex={0}
                      className={`px-1 bg-default-50 rounded-lg`}
                      onClick={() => {
                        if (!selectedCourse) return;
                        copy(selectedCourse.price?.toString() ?? "");
                      }}
                    >
                      {selectedCourse?.price?.toLocaleString()}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2">Copied</div>
                  </PopoverContent>
                </Popover>
              </div>
              <Divider className={`mt-app bg-default-200`} />
              <div className={`mt-app font-IBM-Thai-Looped`}>
                <div className={`text-base font-bold`}>Web-app:</div>
                <Button
                  className={`min-h-11 p-0 h-max bg-default-100 hover:bg-default-200 rounded-lg`}
                  fullWidth
                  onClick={handleOnClickConectionWebapp}
                >
                  {selectedCourse?.webappCourseId
                  ?
                  renderWebappCourse(selectedCourse.webappCourseId)
                  :
                  "เลือกคอร์สใน Web-app"
                  }
                </Button>
                <div className={`mt-2 flex gap-2 font-IBM-Thai`}>
                  <Button
                    className={`bg-default-100 font-medium`}
                    endContent={<ExternalLink size={20} />}
                    fullWidth
                    onClick={() => {
                      const branch = selectedCourse?.branch
                      let link = ""
                      if(branch?.toLowerCase() === "odm"){
                        const courseName = selectedCourse?.name.split(" ").join("-")
                        link = `https://www.odm-engineer.com/course/${courseName}-${selectedCourse?.webappCourseId}`
                      }else if(branch?.toLowerCase() === "kmitl"){
                        link = `https://www.inclass.me/kmitl/store/detail/${selectedCourse?.webappCourseId}`
                      }
                      window.open(link, '_blank')
                    }}
                  >
                    Salepage
                  </Button>
                  <Button
                    className={`bg-default-100 font-medium`}
                    endContent={<ExternalLink size={20} />}
                    fullWidth
                    onClick={() => {
                      const branch = selectedCourse?.branch
                      let link = ""
                      if(branch?.toLowerCase() === "odm"){
                        link = `https://app.odm-engineer.com/admin/course/course/${selectedCourse?.webappCourseId}`
                      }else if(branch?.toLowerCase() === "kmitl"){
                        link = `https://www.inclass.me/kmitl/admin/course/course/${selectedCourse?.webappCourseId}`
                      }
                      alert(link)
                      window.open(link, '_blank')
                    }}
                  >
                    เว็บ Admin
                  </Button>
                </div>
              </div>
            </div>
          ) : manageCourseMode === "show" ? (
            <div className="mt-4">
              <div className="text-2xl font-bold font-IBM-Thai">
                {/* Dynamics (CU) midterm */}
                {selectedCourse?.name}
              </div>
              <div className="text-base mt-2 font-IBM-Thai-Looped">
                {selectedCourse?.detail ?? "-"}
                {/* วิชา MEE000 Engineering Mechanics II สำหรับ ม. พระจอมเกล้าธนบุรี เนื้อหา midterm */}
              </div>
              <div className="space-x-1 mt-2 font-IBM-Thai-Looped">
                <span className={`font-bold`}>ผู้สอน:</span>
                <span>{selectedCourse?.Tutor?.name ?? "-"}</span>
              </div>
              <div
                className="space-x-1 mt-2 font-IBM-Thai-Looped"
                style={{ overflowWrap: "break-word" }}
              >
                <span className={`font-bold`}>เฉลย:</span>
                <span>
                  {selectedCourse?.clueLink ?? "-"}
                  {/* www.facebook.com/groups/cudynamics167middsfsdfsdf */}
                </span>
              </div>
              <div
                className="space-x-1 mt-2 font-IBM-Thai-Looped"
                style={{ overflowWrap: "break-word" }}
              >
                <span className={`font-bold`}>Playlist:</span>
                <span>{selectedCourse?.playlist}</span>
              </div>
              <div
                className="space-x-1 mt-2 font-IBM-Thai-Looped"
                style={{ overflowWrap: "break-word" }}
              >
                <span className={`font-bold`}>ราคา:</span>
                <span>
                  {selectedCourse?.price ?? "-"}
                </span>
              </div>
              <div className={`flex gap-2 mt-2 pt-[6px]`}>
                <Button
                  className={`bg-default-100 font-sans font-medium px-4 py-2 min-w-0 text-base`}
                  isLoading={isLoadingDuplicate}
                  onClick={handleOnClickDuplicate}
                >
                  ทำซ้ำ
                </Button>
                <Button
                  onClick={() => setManageCourseMode('edit')}
                  className="bg-default-100 font-sans font-medium text-base"
                  fullWidth
                >
                  แก้ไข
                </Button>
              </div>
            </div>
          ) : (
            manageCourseMode === "add" ?
            <AddCourseForm
              onConfirm={handleOnAddSuccess}
            />
            :
            <EditCourseForm
              onConfirm={handleOnAddSuccess}
              course={selectedCourse as any}
              onClickDelete={handleDeleteCourse}
            />
          )}
        </div>
        {/* lesson */}
        <ManageLesson
          courseId={selectedCourse?.id ?? 0}
          className={`${mode === "admin" ? `hidden` : ``}`}
          lessons={selectedCourse?.CourseLesson}
          onFetch={async () => {
            if (onFetch) {
              await onFetch();
            }
          }}
          mode={mode}
        />
        <LessonAdminMode
          books={books}
          sheets={sheets}
          preExam={preExam}
          documentNumber={documentNumber}
          mode={mode}
          lessons={selectedCourse?.CourseLesson}
        />
        {/* <div
          className={`${
            mode === "tutor" ? `hidden` : ``
          } bg-default-100 p-[14px] md:min-w-[469px] md:w-[469px] overflow-y-auto hidden`}
        >
          <div className={`text-2xl font-bold font-IBM-Thai`}>สารบัญ</div>
          <div className={`mt-2 bg-content1 p-2 rounded-lg shadow space-y-2`}>
            {selectedCourse?.CourseLesson.map((lesson, index) => {
              // selectedCourse?.CourseLesson.length
              if(lesson.name.toLowerCase().includes(`pre-exam`)){
                return <React.Fragment key={`sarabun${index}`}></React.Fragment>
              }
              return (
                <Popover key={`sarabun${index}`} placement="top">
                  <PopoverTrigger className={`cursor-pointer`}>
                    <div
                      tabIndex={0}
                      className={`px-1 w-max rounded-lg bg-default-100`}
                    >
                      {lesson.name}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className={`rounded-full py-1 h-6`}>
                    <div className="px-1 py-2">Copied</div>
                  </PopoverContent>
                </Popover>
              );
            })}
          </div>
          <div className={`mt-3 font-IBM-Thai space-x-1`}>
            <span className={`font-bold text-2xl`}>เนื้อหา</span>
            <span>({hour} ชม {minute} นาที)</span>
          </div>
          <div className={`mt-2`}>
            {!selectedCourse ? (
              <></>
            ) : (
              <Accordion variant="splitted" className={`px-0`}>
                {selectedCourse?.CourseLesson.map((lesson: any, index) => {
                  return (
                    <AccordionItem
                      key={`lessonAccord${lesson.id}`}
                      aria-label={`${lesson.name}`}
                      title={(
                        <div className={`text-default-foreground text-sm font-IBM-Thai-Looped space-x-1`}>
                          <span className={`font-bold`}>
                            {lesson.name}
                          </span>
                          <span>
                            {renderLessonTime(lesson)}
                          </span>
                        </div>
                      )}
                      className={`p-0 shadow`}
                      classNames={{
                        trigger: 'p-2 items-center',
                        title: 'text-sm',
                        content: 'px-2 pb-2 pt-0 rounded-lg',
                      }}
                      indicator={<ChevronLeft />}
                    >
                      <div className={`bg-content1`}>
                        {lesson.CourseVideo.map((courseVideo: any, index: number) => {
                          return (
                            <div className={`p-1 last:rounded-b odd:bg-content1 even:bg-content2 space-y-1 font-IBM-Thai-Looped`} key={`courseVideo${index}`}>
                              <div className={`flex items-center gap-2`}>
                                <Tag size={16} className={`text-foreground-400`} />
                                <Popover placement="top">
                                  <PopoverTrigger onClick={() => copy(courseVideo.name)} className={`cursor-pointer`}>
                                    <div className={`px-1 bg-default-50 rounded`}>
                                      {courseVideo.name}
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    <div className="px-1 py-2">Copied</div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <div className={`flex items-center gap-2`}>
                                <VideoLucide size={16} className={`text-foreground-400`} />
                                <Popover placement="top">
                                  <PopoverTrigger onClick={() => copy(courseVideo.videoLink)} className={`cursor-pointer`}>
                                    <div className={`px-1 bg-default-50 rounded flex gap-2 items-center`}>
                                      <div>
                                        Video Link
                                      </div>
                                      <Copy size={16} />
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    <div className="px-1 py-2">Copied</div>
                                  </PopoverContent>
                                </Popover>
                                <div className={`text-foreground-400`}>
                                  ชั่วโมง:
                                </div>
                                <Popover placement="top">
                                  <PopoverTrigger onClick={() => copy(courseVideo.hour)} className={`cursor-pointer`}>
                                    <div className={`w-10 bg-default-50 rounded flex justify-center items-center`}>
                                      {courseVideo.hour}
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    <div className="px-1 py-2">Copied</div>
                                  </PopoverContent>
                                </Popover>
                                <div className={`text-foreground-400`}>
                                  นาที:
                                </div>
                                <Popover placement="top">
                                  <PopoverTrigger onClick={() => copy(courseVideo.minute)} className={`cursor-pointer`}>
                                    <div className={`w-10 bg-default-50 rounded flex justify-center items-center`}>
                                      {courseVideo.minute}
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    <div className="px-1 py-2">Copied</div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <div className={`flex items-center gap-2`}>
                                <FileText size={16} className={`text-foreground-400`} />
                                <Popover placement="top">
                                  <PopoverTrigger onClick={() => copy(courseVideo.contentName)} className={`cursor-pointer`}>
                                    <div className={`bg-default-50 rounded flex px-1`}>
                                      {courseVideo.contentName}
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    <div className="px-1 py-2">Copied</div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </div>
          <div className={`mt-3`}>
            <div className={`font-IBM-Thai flex items-center gap-2`}>
              <div className={`text-2xl font-bold`}>
                เอกสาร
              </div>
              <div className={`text-base font-normal`}>
                ({documentNumber} ชิ้น)
              </div>
            </div>
            <div className={`mt-2 space-y-2 bg-content1 shadow-neutral-base rounded-lg p-2 font-IBM-Thai-Looped`}>
              {books.length > 0 &&
                <div>
                  <div className={`text-sm font-bold text-foreground-400`}>
                    หนังสือ
                  </div>
                  <div className={`space-y-1 mt-2`}>
                    {books.map((book, index) => (
                      <div className={`flex gap-2 items-center`} key={`bookadmin${index}`}>
                        <Image src={book.image} className={`h-10 rounded`} classNames={{wrapper: 'rounded'}} />
                        {book.name}
                      </div> 
                    ))}
                  </div>
                </div>
              }
              {sheets.length > 0 &&
                <div>
                  <div className={`text-sm font-bold text-foreground-400`}>
                    เอกสาร
                  </div>
                  <div className={`space-y-1 mt-2`}>
                    {sheets.map((sheet, index) => (
                      <div className={`flex items-center gap-2`} key={`sheetadmin${index}`}>
                        <ScrollText size={20} className={`text-default-foreground`} />
                        <div>
                          {sheet.name}
                        </div>
                        <Button
                          onClick={() => {
                            window.open(sheet.url, '_blank')
                          }}
                          isIconOnly
                          className={`min-w-0 w-8 h-8 rounded-lg bg-default-100`}
                        >
                          <ExternalLink size={24} className={`text-default-foreground`} />
                        </Button>
                      </div> 
                    ))}
                  </div>
                </div>
              }
              {preExam.length > 0 &&
                <div>
                  <div className={`text-sm font-bold text-foreground-400`}>
                    Pre-Exam
                  </div>
                  <div className={`space-y-1 mt-2`}>
                    {preExam.map((preExam, index) => (
                      <div className={`flex items-center gap-2`} key={`preExamadmin${index}`}>
                        <FileSignature size={20} className={`text-default-foreground`} />
                        <div>
                          {preExam.name}
                        </div>
                        <Button
                          onClick={() => {
                            window.open(preExam.url, '_blank')
                          }}
                          isIconOnly
                          className={`min-w-0 w-8 h-8 rounded-lg bg-default-100`}
                        >
                          <ExternalLink size={24} className={`text-default-foreground`} />
                        </Button>
                      </div> 
                    ))}
                  </div>
                </div>
              }
            </div>
          </div>
        </div> */}
      </div>
    </CustomDrawer>
  );
};

export default ManageCourse;