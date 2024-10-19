"use client";
import React, { createContext, useMemo, useState } from "react";
// import { useTheme } from "next-themes";
import {
   Button,
   Image,
   Input,
   Pagination,
   Select,
   SelectItem,
   Table,
   TableBody,
   TableCell,
   TableColumn,
   TableHeader,
   TableRow,
} from "@nextui-org/react";
import { ClipboardSignature, Plus, ScrollText, Search } from "lucide-react";
import { courseStatus, tableClassnames } from "../../lib/res/const";
import { Course as CourseT } from "@/lib/model/course";
import { Document } from "@/lib/model/document";
import {
   addCourse,
   deleteCourse,
   listCourseAction,
   listCourseWebapp,
} from "@/lib/actions/course.actions";
import { useQuery } from "@tanstack/react-query";
import { listTutor } from "@/lib/actions/tutor.actions";
import { listPlayList } from "@/lib/actions/playlist.actions";
import { PlayList } from "@/lib/model/playlist";
import ManageLesson from "@/components/ManageLesson";
import ManageCourse from "@/components/ManageCourse";
import ErrorBox from "@/components/ErrorBox";
import DeleteCourseDialog from "@/components/Course/DeleteCourseDialog";
import CourseContext from "./provider";

const Status = ({ course }: { course: CourseT }) => {
   let textColor = "";
   switch (course.status) {
      case "noContent":
         textColor = "text-danger-500";
         break;
      case "hasContent":
         textColor = "text-warning-500";
         break;
      case "uploadWebapp":
         textColor = "text-success-500";
         break;
      case "enterForm":
         textColor = "text-primary-500";
         break;
      default:
         textColor = "text-gray-400";
   }
   return (
      <div
         className={`flex gap-[2px] items-center font-IBM-Thai-Looped ${textColor}`}
      >
         {courseStatus[course.status].icon}
         <div>{courseStatus[course.status].name}</div>
      </div>
   );
};

const DocumentComponent = ({ document }: { document: Document }) => {
   let icon = <></>;
   switch (document.type) {
      case "book":
         icon = (
            <Image
               className="rounded-sm"
               width={16}
               src={`${document.imageUrl}`}
            />
         );
         break;
      case "sheet":
         icon = <ScrollText size={16} />;
         break;
      case "pre-exam":
         icon = <ClipboardSignature size={16} />;
         break;
      default:
         break;
   }
   return (
      <div className="flex items-center gap-2">
         {icon}
         <div>{document.name}</div>
      </div>
   );
};

const Course = () => {
   const [selectedCourse, setSelectedCourse] = useState<CourseT | undefined>();
   const [isOpenDrawer, setIsOpenDrawer] = useState(false);
   const [isSort, setIsSort] = useState(false);
   const [page, setPage] = useState(1);
   const [pageSize, setPageSize] = useState(10);
   const [isDeleteCourse, setIsDeleteCourse] = useState(false);
   const [errorDeleteCourse, setErrorDeleteCourse] = useState({
      isError: false,
      message: "ลบไม่สำเร็จ ดูเพิ่มเติมใน Console",
   });

   const rowsPerPage = 5;
   const {
      data: courses,
      isLoading,
      status,
      error,
      isRefetching,
      refetch: refetchCourse,
   } = useQuery({
      queryKey: ["listCourseAction"],
      queryFn: () => listCourseAction(),
   });

   const { data: tutorList } = useQuery({
      queryKey: ["listTutor"],
      queryFn: () => listTutor(),
   });

   const { data: playList } = useQuery({
      queryKey: ["listPlayList"],
      queryFn: () => listPlayList(),
   });

   useMemo(() => {
      if (!isRefetching) {
         if (selectedCourse) {
            // for update delete
            const findCourse = courses?.find(
               (course) => course.id === selectedCourse.id
            );
            if (findCourse) {
               setSelectedCourse(findCourse);
            }
         }
      }
   }, [isRefetching]);

  const courseItem = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    console.table({ startIndex, endIndex });

    const courseWithUniqueBooks = courses?.map(course => {
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
    })
    const currentCourses = courseWithUniqueBooks?.slice(startIndex, endIndex);
    console.log("🚀 ~ courseItem ~ currentCourses:", currentCourses)
    
    if (courses) {
      setPageSize(Math.ceil(courses.length / rowsPerPage));
    }
    return currentCourses;
  }, [page, courses, isLoading]);

  const handleCloseManageCourse = () => {
    setIsOpenDrawer(false);
    setSelectedCourse(undefined);
  };

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
    handleCloseManageCourse();
    refetchCourse();
  };

  const handleCloseDeleteCourseDialog = () => {
    setErrorDeleteCourse((prev) => ({ ...prev, isError: false }));
    setIsDeleteCourse(false);
  };

  const onAddedCourse = async (courseId: number) => {
    const res = await refetchCourse();
    const course = res.data;
    console.log(course);
    if (!course) return;
    const findCourse = course.find((course) => course.id === courseId);
    console.log(findCourse);
    setSelectedCourse(findCourse);
  };

  const refreshCourse = async () => {
    if (!selectedCourse) return;
    const res = await refetchCourse();
    const course = res.data;
    if (!course) return;
    const findCourse = course.find(
       (course) => course.id === selectedCourse.id
    );
    console.log(findCourse);
    setSelectedCourse(findCourse);
  };

  return (
    // <div className="flex flex-col pt-6 px-4 bg-background relative md:h-screenDevice bg-red-400 md:bg-green-400">
    <CourseContext.Provider value={[refreshCourse]}>
      <div className="flex flex-col pt-6 px-app bg-background relative h-screenDevice bg-default-50">
        {/* Drawer */}
        <DeleteCourseDialog
          isOpen={isDeleteCourse}
          title={`แน่ใจหรือไม่ ?`}
          error={errorDeleteCourse}
          onConfirm={() => {
            confirmDeleteCourse()
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
        <ManageCourse
          isOpenDrawer={isOpenDrawer}
          selectedCourse={selectedCourse}
          onDeleteCourse={async () => {
            setIsDeleteCourse(true)
          }}
          onClose={handleCloseManageCourse}
          onFetch={async () => {
            await refetchCourse()
          }}
          onConfirmAdd={async (courseId) => {
            await onAddedCourse(courseId)
            // console.log("refrest !!");
            // // setSelectedCourse(res)
            // setAddedCourseId(courseId)
            // await refetchCourse()
          }}
          tutorList={tutorList}
          playList={playList}
        />
        <div className="font-IBM-Thai text-3xl font-bold py-2 hidden md:block">
          คอร์สเรียน
        </div>
        <div className="block md:flex gap-2">
          <Input
            className="font-IBM-Thai-Looped"
            type="text"
            placeholder="ค้นหา...คอร์สเรียน"
            startContent={<Search className="text-foreground-400" />}
            fullWidth
          />
          <div className="flex gap-2 mt-2 md:mt-0">
            <Select
              selectionMode="multiple"
              placeholder={`สถานะ`}
              aria-label="สถานะ"
              className="font-IBM-Thai md:w-[113px]"
              classNames={{
                value: ["font-bold"],
                popoverContent: [`w-max right-0 absolute`],
              }}
              renderValue={(items) => <div>สถานะ</div>}
            >
              {Object.keys(courseStatus).map((key, index) => {
                return (
                  <SelectItem key={`selectStatus${index}`} startContent={courseStatus[key].icon}>
                    {courseStatus[key].name}
                  </SelectItem>
                );
              })}
            </Select>
            <Select
              selectionMode="multiple"
              placeholder={`ติวเตอร์`}
              aria-label="ติวเตอร์"
              className="font-IBM-Thai md:w-[113px]"
              classNames={{
                value: ["font-bold"],
              }}
              renderValue={(items) => <div>ติวเตอร์</div>}
              disabled={tutorList === undefined}
            >
              {tutorList ? (
                tutorList.map((tutor, index) => {
                  return (
                    <SelectItem aria-label={`${tutor.name}`} key={`tutor${index}`}>
                      {tutor.name}
                    </SelectItem>
                  );
                })
              ) : (
                <SelectItem aria-label={`loading`} key={"loading"}>
                  loading...
                </SelectItem>
              )}
              {/* {["กล้า", "จุ๊"].map((value) => {
                return (
                  <SelectItem aria-label={`${value}`} key={value}>
                    {value}
                  </SelectItem>
                );
              })} */}
            </Select>
          </div>
          <Button
            className="mt-2 md:mt-0 w-full md:w-auto font-IBM-Thai text-base font-medium bg-default-foreground text-primary-foreground"
            endContent={<Plus strokeWidth={4} />}
            onClick={() => {
              setIsOpenDrawer(true);
            }}
          >
            <div className={`mt-[2px]`}>เพิ่ม</div>
          </Button>
        </div>
        <div className="mt-4 flex-1">
          <Table isStriped aria-label="course-table" classNames={tableClassnames}>
            <TableHeader>
              <TableColumn className="font-IBM-Thai">คอร์ส</TableColumn>
              <TableColumn className="font-IBM-Thai">สถานะ</TableColumn>
              <TableColumn className="font-IBM-Thai">ติวเตอร์</TableColumn>
              <TableColumn className="font-IBM-Thai">เอกสาร</TableColumn>
            </TableHeader>
            <TableBody items={courseItem ?? []}>
              {/* {courses.map((course, index) => ( */}
              {(course) => (
                <TableRow key={`courseRow${course.id}`}>
                  <TableCell
                    onClick={() => {
                      setSelectedCourse(course);
                      setIsOpenDrawer((prev) => !prev);
                    }}
                  >
                    <div className="flex gap-2 items-center">
                      {/* {course.image && (
                        <Image radius="sm" width={40} src={course.image} />
                      )} */}
                      <div className="font-IBM-Thai-Looped">
                        {course.name} {course.id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Status course={course} />
                  </TableCell>
                  <TableCell className="font-IBM-Thai-Looped">
                    {course.Tutor?.name}
                  </TableCell>
                  <TableCell className="font-IBM-Thai-Looped">
                    {course.uniqueSheets.map((sheet, index) => (
                      <div key={`sheet${index}${course.id}`} className={`flex items-center gap-2`}>
                        <ScrollText className={`text-content4-foreground`} size={16} />
                        <div className={`text-xs font-IBM-Thai-Looped text-default-foreground`}>
                          {sheet.name}
                        </div>
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="py-2 flex justify-center">
          <Pagination
            total={pageSize}
            initialPage={page}
            className="p-0 m-0"
            classNames={{
              cursor: "bg-default-foreground",
            }}
            onChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </CourseContext.Provider>
  );
};

export default Course;
