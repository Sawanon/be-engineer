"use client";
import React, { createContext, Key, useEffect, useMemo, useState } from "react";
import {
   Button,
   Image,
   Input,
   Pagination,
   Select,
   SelectItem,
   Spinner,
   Table,
   TableBody,
   TableCell,
   TableColumn,
   TableHeader,
   TableRow,
} from "@nextui-org/react";
import { ChevronDown, ClipboardSignature, Plus, ScrollText, Search } from "lucide-react";
import { courseStatus, tableClassnames } from "../../lib/res/const";
import { Course as CourseT } from "@/lib/model/course";
import {
   deleteCourse,
   listCourseAction,
} from "@/lib/actions/course.actions";
import { useQuery } from "@tanstack/react-query";
import { listTutor } from "@/lib/actions/tutor.actions";
import { CourseLesson, Course as CoursePrisma, DocumentBook, DocumentPreExam, DocumentSheet, LessonOnDocument, LessonOnDocumentBook, LessonOnDocumentSheet, Prisma} from '@prisma/client'
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import _ from 'lodash'
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";

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
         textColor = "text-primary_blue-500";
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

const CourseComponent = ({
  courses,
}:{
  courses: Awaited<ReturnType<typeof listCourseAction>>
}) => {
  const route = useRouter()
  //  const [selectedCourse, setSelectedCourse] = useState<CourseT | undefined>();
  //  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  //  const [isSort, setIsSort] = useState(false);
   const [page, setPage] = useState(1);
   const [pageSize, setPageSize] = useState(30);
  //  const [isDeleteCourse, setIsDeleteCourse] = useState(false);
  //  const [errorDeleteCourse, setErrorDeleteCourse] = useState({
  //     isError: false,
  //     message: "ลบไม่สำเร็จ ดูเพิ่มเติมใน Console",
  //  });
   const [preSearchCourse, setPreSearchCourse] = useState("")
   const [searchCourse, setSearchCourse] = useState("")
   const [filterStatusCourse, setFilterStatusCourse] = useState<Key[] | undefined>()
   const [searchCourseByTutorId, setSearchCourseByTutorId] = useState<any | undefined>()

   const rowsPerPage = 5;
  //  const {
  //     data: courses,
  //     isLoading,
  //     status,
  //     error,
  //     isRefetching,
  //     refetch: refetchCourse,
  //  } = useQuery({
  //     queryKey: ["listCourseAction"],
  //     queryFn: () => listCourseAction(),
  //  });

   const { data: tutorList } = useQuery({
      queryKey: ["listTutor"],
      queryFn: () => listTutor(),
   });
   
  //  const searchParam = useSearchParams()
  //  const pathName = usePathname()

  //  const findUniqueDocument = (course: any) => {
  //   const uniqueSheets = Array.from(
  //     new Map(course.CourseLesson.flatMap((lesson: CourseLesson & {
  //       LessonOnDocumentSheet: LessonOnDocumentSheet &{
  //         DocumentSheet: DocumentSheet,
  //       }[]
  //     }) => 
  //        lesson.LessonOnDocumentSheet.map(sheet => [sheet.DocumentSheet.id, sheet.DocumentSheet])
  //     )).values()
  //   )
  //   const uniquePreExam = Array.from(
  //     new Map(course.CourseLesson.flatMap((lesson: CourseLesson & {
  //       LessonOnDocument: LessonOnDocument & {
  //         DocumentPreExam: DocumentPreExam,
  //       }[]
  //     }) => 
  //        lesson.LessonOnDocument.map(sheet => [sheet.DocumentPreExam.id, sheet.DocumentPreExam])
  //     )).values()
  //   )
  //   const uniqueBooks = Array.from(
  //     new Map(course.CourseLesson.flatMap((lesson: CourseLesson & {
  //       LessonOnDocumentBook: LessonOnDocumentBook &{
  //         DocumentBook: DocumentBook,
  //       }[]
  //     }) => 
  //        lesson.LessonOnDocumentBook.map(sheet => [sheet.DocumentBook.id, sheet.DocumentBook])
  //     )).values()
  //   )
    
  //   return {
  //     ...course,
  //     uniqueSheets,
  //     uniquePreExam,
  //     uniqueBooks,
  //   }
  //  }

  //  useMemo(() => {
  //   //TODO: check mode admin
  //    if(courses){
  //     const courseId = searchParam.get('drawerCourse')
  //     if(!courseId) return
  //     const course = courses.find(course => course.id === parseInt(courseId))
  //     const courseWithUniqueDocuments = findUniqueDocument(course)
  //     setSelectedCourse(courseWithUniqueDocuments)
  //     if(course){
  //       setIsOpenDrawer(true)
  //     }
  //   }
  //  }, [searchParam.get('drawerCourse'), courses])

  //  useMemo(() => {
  //     if (!isRefetching) {
  //        if (selectedCourse) {
  //           // for update delete
  //           const findCourse = courses?.find(
  //              (course) => course.id === selectedCourse.id
  //           );
  //           if (findCourse) {
  //             const courseWithUniqueDocuments = findUniqueDocument(findCourse)
  //             setSelectedCourse(courseWithUniqueDocuments);
  //           }
  //        }
  //     }
  //  }, [isRefetching]);

  const courseItem = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

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
    // const currentCourses = courseWithUniqueBooks?.slice(startIndex, endIndex);
    // const currentCourses = courseWithUniqueBooks
    
    let courseFromSearch = courseWithUniqueBooks
    if(searchCourse !== ""){
      courseFromSearch = courseFromSearch?.filter(course => course.name.toLowerCase().startsWith(searchCourse))
    }
    if(filterStatusCourse && filterStatusCourse.length > 0){
      courseFromSearch = courseFromSearch?.filter(course => filterStatusCourse.includes(course.status))
    }
    
    if(searchCourseByTutorId && searchCourseByTutorId.size > 0) {
      courseFromSearch = courseFromSearch?.filter(course => course.Tutor?.id === parseInt(searchCourseByTutorId.currentKey))
    }
    
    if (courseFromSearch) {
      setPageSize(Math.ceil(courseFromSearch.length / rowsPerPage));
    }
    return courseFromSearch?.slice(startIndex, endIndex);
  }, [page, courses, /*isLoading*/, searchCourse, filterStatusCourse, searchCourseByTutorId]);

  // const replacePath = () => {
  //   const newPath = `/course`;
  //   window.history.replaceState(null, "", newPath);
  // };

  // const handleCloseManageCourse = () => {
  //   setIsOpenDrawer(false);
  //   setSelectedCourse(undefined);
  //   replacePath()
  // };

  // const confirmDeleteCourse = async () => {
  //   if (!selectedCourse) {
  //       return;
  //   }
  //   const res = await deleteCourse(selectedCourse.id);
  //   console.log(res);
  //   if (!res) {
  //       setErrorDeleteCourse((prev) => ({ ...prev, isError: true }));
  //       return;
  //   }
  //   setIsDeleteCourse(false);
  //   handleCloseManageCourse();
  //   // refetchCourse();
  // };

  // const handleCloseDeleteCourseDialog = () => {
  //   setErrorDeleteCourse((prev) => ({ ...prev, isError: false }));
  //   setIsDeleteCourse(false);
  // };

  // const onAddedCourse = async (courseId: number) => {
  //   // const res = await refetchCourse();
  //   // const course = res.data;
  //   // console.log(course);
  //   // if (!course) return;
  //   // const findCourse = course.find((course) => course.id === courseId);
  //   // console.log(findCourse);
  //   // setSelectedCourse(findCourse);
  // };

  // const refreshCourse = async () => {
  //   if (!selectedCourse) return;
  //   const res = await refetchCourse();
  //   const course = res.data;
  //   if (!course) return;
  //   const findCourse = course.find(
  //      (course) => course.id === selectedCourse.id
  //   );
  //   console.log(findCourse);
  //   setSelectedCourse(findCourse);
  // };

  const handleSearch = (value: string) => {
    console.log("search !", value);

    setSearchCourse(value)
  }

  const debouncedSearch = _.debounce(handleSearch, 3000);
  useEffect(() => {
    debouncedSearch(preSearchCourse)
    return () => {
      debouncedSearch.cancel()
    }
  }, [preSearchCourse])

  // const handleOnClickCourse = (course:any) => {
  //   const _course:NonNullable<Awaited<ReturnType<typeof listCourseAction>>>[0] = course
    
  //   let onlyOneDontExistDoc = false
  //   _course.CourseLesson.forEach(lesson => {
  //     const coundDoc = lesson.LessonOnDocument.length + lesson.LessonOnDocumentBook.length + lesson.LessonOnDocumentSheet.length
  //     if(coundDoc === 0) onlyOneDontExistDoc = true
  //   })
  //   setSelectedCourse(course);
  //   setIsOpenDrawer((prev) => !prev);
  //   let mode = course.status === "noContent" ? `tutor` : `admin`
  //   if(onlyOneDontExistDoc) mode = `tutor`
  //   const newPath = `${pathName}?drawerCourse=${course.id}&mode=${mode}`;
  //   window.history.replaceState(null, "", newPath);
  // }

  return (
    // <div className="flex flex-col pt-6 px-4 bg-background relative md:h-screenDevice bg-red-400 md:bg-green-400">
    // <CourseContext.Provider value={[refreshCourse]}>
      <div className="flex flex-col pt-6 px-app bg-background relative h-screenDevice bg-default-50">
        {/* Drawer */}
        {/* <DeleteCourseDialog
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
        /> */}
        {/* <ManageCourse
          isOpenDrawer={isOpenDrawer}
          selectedCourse={selectedCourse}
          onClose={handleCloseManageCourse}
          onFetch={async () => {
            // await refetchCourse()
          }}
          onConfirmAdd={async (courseId) => {
            await onAddedCourse(courseId)
            // console.log("refrest !!");
            // // setSelectedCourse(res)
            // setAddedCourseId(courseId)
            // await refetchCourse()
          }}
        /> */}
        <div className="font-IBM-Thai text-3xl font-bold py-2 hidden md:block">
          คอร์สเรียน
        </div>
        <div className="block md:flex gap-2">
          <Input
            className="font-IBM-Thai-Looped"
            type="text"
            classNames={{
              input: "text-[1em]",
            }}
            placeholder="ค้นหา...คอร์สเรียน"
            startContent={<Search className="text-foreground-400" />}
            fullWidth
            onChange={e => setPreSearchCourse(e.target.value)}
          />
          <div className="flex gap-2 mt-2 md:mt-0">
            <Select
              selectionMode="multiple"
              placeholder={`สถานะ`}
              aria-label="สถานะ"
              // color="default"
              // variant="flat"
              // className="flex-shrink-0 hidden md:flex text-base font-medium"
              className="font-sans md:w-max text-default-foreground"
              classNames={{
                value: ["text-default-foreground font-medium font-sans"],
                popoverContent: [`w-max right-0 absolute`],
                trigger: [`justify-center py-[7px] px-4 gap-3`],
                innerWrapper: [`w-max`],
                selectorIcon: [`relative end-0 w-6 h-6`]
              }}
              selectorIcon={<ChevronDown size={24} />}
              renderValue={(items) => <div className={`text-default-foreground font-sans`}>สถานะ</div>}
              onSelectionChange={(key) => {
                setFilterStatusCourse(Array.from(key))
              }}
            >
              {Object.keys(courseStatus).map((key, index) => {
                return (
                  <SelectItem className={`font-serif`} key={`${key}`} startContent={courseStatus[key].icon}>
                    {courseStatus[key].name}
                  </SelectItem>
                );
              })}
            </Select>
            <Select
              selectionMode="single"
              placeholder={`ติวเตอร์`}
              aria-label="ติวเตอร์"
              // color="default"
              // variant="flat"
              // className="flex-shrink-0 hidden md:flex text-base font-medium"
              className="font-sans md:w-max"
              classNames={{
                value: ["text-default-foreground font-medium font-sans"],
                trigger: [`justify-center py-[7px] px-4 gap-3`],
                popoverContent: [`w-max right-0 absolute`],
                innerWrapper: [`w-max`],
                selectorIcon: [`relative end-0 w-6 h-6`],
              }}
              // renderValue={(items) => <div>ติวเตอร์</div>}
              selectorIcon={<ChevronDown size={24} />}
              disabled={tutorList === undefined}
              onSelectionChange={(key) => {
                console.log("onchange tutor", key);
                setSearchCourseByTutorId(key)
              }}
            >
              {tutorList ? (
                tutorList.map((tutor, index) => {
                  return (
                    <SelectItem aria-label={`${tutor.name}`} key={`${tutor.id}`}>
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
            className="flex mt-2 md:mt-0 w-full md:w-auto font-sans text-base font-medium bg-default-foreground text-primary-foreground"
            endContent={<Plus className={`min-w-5 min-h-5`} size={20} />}
            onClick={() => {
              // setIsOpenDrawer(true);
              route.push(`/course?drawerCourse=add`)
            }}
          >
            <div className={`mt-1`}>เพิ่ม</div>
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
            <TableBody
              // isLoading={isLoading}
              loadingContent={<Spinner />}
              items={courseItem ?? []}
            >
              {/* {courses.map((course, index) => ( */}
              {(course) => (
                <TableRow key={`courseRow${course.id}`}>
                  <TableCell
                    // onClick={() => handleOnClickCourse(course)}
                    onClick={() => {
                      route.push(`/course?drawerCourse=${course.id}`)
                    }}
                  >
                    <div className="flex gap-2 items-center">
                      {course.imageUrl && (
                        <Image radius="sm" width={40} src={course.imageUrl} />
                      )}
                      <div className="font-IBM-Thai-Looped">
                        {course.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Status course={course} />
                  </TableCell>
                  <TableCell className="font-IBM-Thai-Looped">
                    {course.Tutor?.name}
                  </TableCell>
                  <TableCell className="font-IBM-Thai-Looped space-y-1">
                    {course.uniqueBooks.map((book, index) => (
                      <div key={`book${index}${book.id}`} className={`flex items-center gap-2`}>
                        <Image className={`w-4 rounded`} src={book.image!} alt="book image" />
                        <div className={`text-xs font-IBM-Thai-Looped text-default-foreground`}>
                          {book.name}
                        </div>
                      </div>
                    ))}
                    {course.uniqueSheets.map((sheet, index) => (
                      <div key={`sheet${index}${sheet.id}`} className={`flex items-center gap-2`}>
                        <ScrollText className={`text-content4-foreground min-w-4`} size={16} />
                        <div className={`text-xs font-IBM-Thai-Looped text-default-foreground`}>
                          {sheet.name}
                        </div>
                      </div>
                    ))}
                    {course.uniquePreExam.map((preExam, index) => (
                      <div key={`sheet${index}${preExam.id}`} className={`flex items-center gap-2`}>
                        <ClipboardSignature className={`text-content4-foreground min-w-4`} size={16} />
                        <div className={`text-xs font-IBM-Thai-Looped text-default-foreground`}>
                          {preExam.name}
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
            className={`p-0 m-0 font-serif`}
            classNames={{
              cursor: "bg-default-foreground",
            }}
            onChange={(page) => setPage(page)}
          />
        </div>
      </div>
    // </CourseContext.Provider>
  );
};

export default CourseComponent;
