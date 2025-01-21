"use client"
import {
  deleteCourse,
  duplicationCourseAction,
  getCourseById,
  listCourseAction,
  listCourseWebapp,
  revalidateCourse,
  searchImageByCourseName,
} from "@/lib/actions/course.actions";
import React , { useEffect, useMemo, useState } from "react";
import CustomDrawer from "@/components/Drawer";
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
import ManageLesson from "@/components/ManageLesson";
import copy from "copy-to-clipboard";
import { useQuery } from "@tanstack/react-query";
import StatusIcon from "@/components/Course/StatusIcon";
import { CourseVideo } from "@prisma/client";
import ConectWebAppModal from "@/components/Course/ConectWebAppModal";
import LessonAdminMode from "@/components/Course/LessonAdminMode";
import DeleteCourseDialog from "@/components/Course/DeleteCourseDialog";
import AddCourseForm from "@/components/Course/AddCourseForm";
import EditCourseForm from "@/components/Course/EditCourseForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Buttons from "./Buttons";

const ManageCourse = ({
  isOpenDrawer,
  selectedCourse,
  mode,
  // onClose,
  // onConfirmAdd,
  // onFetch,
}: {
  isOpenDrawer: boolean,
  // selectedCourse: Course | undefined | null;
  selectedCourse: Awaited<ReturnType<typeof getCourseById>>,
  mode: string,
  // onClose: () => void;
  // onConfirmAdd: (courseId: number) => Promise<void>;
  // onFetch?: () => Promise<void>;
}) => {
  const route = useRouter()
  const searchParams = useSearchParams()
  // const searchParams = useSearchParams()
  const {
    data: webappBranchCourseList,
    isFetched
  } = useQuery({
    queryKey: [`listCourseWebapp`],
    queryFn: () => listCourseWebapp(),
  });
  const findUniqueDocument = (course: Awaited<ReturnType<typeof getCourseById>>) => {
    if(!course || typeof course === "string") return
    course.CourseLesson.flatMap(lesson => {
      
    })
    const uniqueSheets = Array.from(
      new Map(course.CourseLesson.flatMap(lesson => 
         lesson.LessonOnDocumentSheet.map(sheet => [sheet.DocumentSheet.id, sheet.DocumentSheet])
      )).values()
    )
    const uniquePreExam = Array.from(
      new Map(course.CourseLesson.flatMap(lesson => 
         lesson.LessonOnDocument.map(sheet => [sheet.DocumentPreExam.id, sheet.DocumentPreExam])
      )).values()
    )
    const uniqueBooks = Array.from(
      new Map(course.CourseLesson.flatMap(lesson => 
         lesson.LessonOnDocumentBook.map(sheet => [sheet.DocumentBook.id, sheet.DocumentBook])
      )).values()
    )
    
    return {
      ...course,
      uniqueSheets,
      uniquePreExam,
      uniqueBooks,
    }
  }

  const courseWithUniqueDocuments = findUniqueDocument(selectedCourse)
  
  const sheets = courseWithUniqueDocuments?.uniqueSheets ?? []
  const preExam = courseWithUniqueDocuments?.uniquePreExam ?? []
  const books = courseWithUniqueDocuments?.uniqueBooks ?? []
  const documentNumber = sheets.length + preExam.length + books.length

  const [manageCourseMode, setManageCourseMode] = useState<'add' | 'edit' | 'show'>('show')
  
  const [isDeleteCourse, setIsDeleteCourse] = useState(false);
  const [errorDeleteCourse, setErrorDeleteCourse] = useState({
    isError: false,
    message: "ลบไม่สำเร็จ ดูเพิ่มเติมใน Console",
  });

  // const [mode, setMode] = useState<"tutor" | "admin" | string>("tutor");
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

  // useMemo(() => {
  //   const mode = searchParams.get('mode')
  //   if(mode){
  //     const typeMode = mode === 'admin' ? 'admin' : 'tutor'
  //     setMode(typeMode)
  //   }
  // }, [searchParams.get('mode')])

  useEffect(() => {
    if(!selectedCourse){
      setCourseImageList([])
    }
    // setManageCourseMode(selectedCourse === undefined ? 'add' : 'show')
    if (selectedCourse && typeof selectedCourse !== "string") {
      listImageCourse(selectedCourse.name);
      
      let onlyOneDontExistDoc = false
      selectedCourse.CourseLesson.forEach(lesson => {
        const coundDoc = lesson.LessonOnDocument.length + lesson.LessonOnDocumentBook.length + lesson.LessonOnDocumentSheet.length
        if(coundDoc === 0) onlyOneDontExistDoc = true
      })
      // let mode = selectedCourse.status === "noContent" ? `tutor` : `admin`
      // if(onlyOneDontExistDoc) mode = `tutor`
      // setMode(mode)
    }
  }, [selectedCourse]);

  useMemo(() => {
    if (!selectedCourse || typeof selectedCourse === "string") return;
    if (!webappBranchCourseList) return;
    console.log(webappBranchCourseList);
    const webappCourseList = webappBranchCourseList.find(
      (webappBranch) => webappBranch.branch === selectedCourse.branch
    )?.courses;
    setWebappCourseList(webappCourseList);
  }, [isFetched, selectedCourse]);

  if(typeof selectedCourse === "string" || selectedCourse === null || selectedCourse === undefined){
    return (
      <div>
        Empty
      </div>
    )
  }

  const handleClose = () => {
    const lesson = selectedCourse?.CourseLesson.length ?? 0
    if(lesson > 0){
      const course = selectedCourse!
      if(course.name === "" || !course.detail || !course.Tutor || !course.clueLink || !course.playlist || !course.price){
        return
      }
    }
    // onClose();
    // console.log(`history.state`, history.length);
    // const page = searchParams.get('page')
    // let params = page === "" ? "" : `?page=${page}`
    const params = new URLSearchParams(searchParams.toString())
    params.delete('drawerCourse')
    params.delete('mode')
    route.replace(`/course?${params}`)
    // setMode('tutor')
  };

  const handleDeleteCourse = async () => {
    setIsDeleteCourse(true)
  };

  const handleSwitchMode = () => {
    // setMode((prev) => (prev === "tutor" ? "admin" : "tutor"));
    const ogDrawerCourse = searchParams.get('drawerCourse')
    const ogMode = searchParams.get('mode')
    const mode = ogMode === 'tutor' ? 'admin' : 'tutor'
    const newRoute = `/course?drawerCourse=${ogDrawerCourse}&mode=${mode}`
    route.replace(newRoute)
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
    // handleClose();
    route.replace('/course')
    // refetchCourse();
  };

  const handleCloseDeleteCourseDialog = () => {
    setErrorDeleteCourse((prev) => ({ ...prev, isError: false }));
    setIsDeleteCourse(false);
  };

  const handleOnAddSuccess = async (courseId: number) => {
    // await onConfirmAdd(courseId)
    setManageCourseMode('show')
    await revalidateCourse()
  }

  const handleOnClickDuplicate = async () => {
    try {
      if(selectedCourse){
        setIsLoadingDuplicate(true)
        const responseDuplicate = await duplicationCourseAction(selectedCourse.id)
        if(!responseDuplicate) throw `responseDuplicate is ${responseDuplicate}`
        if(typeof responseDuplicate === "string") throw responseDuplicate
        // handleClose()
        route.replace('/course')
        // if(onFetch) onFetch()
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
        onSuccess={revalidateCourse}
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
                <div className={`min-w-5`}>
                  <StatusIcon status={selectedCourse?.status!} />
                </div>
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
                    <div className="px-1 py-2 font-serif">Copied</div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className={`mt-2 flex gap-2 overflow-auto scrollbar-hide`}>
                {courseImageList.map((imageUrl, index) => {
                  return (
                    <Link key={`imageCourse${index}`} href={`${imageUrl}`} target="_blank">
                      <div
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
                  <div className="px-1 py-2 font-serif">Copied</div>
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
                  tooltipProps={{
                    className: `font-serif`,
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
                  codeString={selectedCourse?.Tutor?.tutorLink!}
                  hideSymbol
                  variant="flat"
                  className={`p-0 gap-0 bg-default-100 text-default-foreground`}
                  copyIcon={<Copy size={24} />}
                  classNames={{
                    base: ["p-0"],
                    symbol: [`p-0 hidden`],
                  }}
                  tooltipProps={{
                    className: `font-serif`,
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
                    <div className="px-1 py-2 font-serif">Copied</div>
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
                    <div className="px-1 py-2 font-serif">Copied</div>
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
                    <div className="px-1 py-2 font-serif">Copied</div>
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
                      // alert(link)
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
            // if (onFetch) {
            //   await onFetch();
            // }
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
      </div>
    </CustomDrawer>
  );
};

export default ManageCourse;