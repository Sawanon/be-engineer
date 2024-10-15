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
import {
  ClipboardSignature,
  Plus,
  ScrollText,
  Search,
} from "lucide-react";
import { courseStatus, tableClassnames } from "../../lib/res/const";
import { Course as CourseT } from "@/lib/model/course";
import { Document } from "@/lib/model/document"
import { addCourse, deleteCourse, listCourseAction, listCourseWebapp } from "@/lib/actions/course.actions";
import { useQuery } from "@tanstack/react-query";
import { listTutor } from "@/lib/actions/tutor.actions";
import { listPlayList } from "@/lib/actions/playlist.actions";
import { PlayList } from "@/lib/model/playlist";
import ManageLesson from "@/components/ManageLesson";
import ManageCourse from "@/components/ManageCourse";
import ErrorBox from "@/components/ErrorBox";
import DeleteCourseDialog from "@/components/Course/DeleteCourseDialog";

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
        <Image className="rounded-sm" width={16} src={`${document.imageUrl}`} />
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

export const CourseContext = createContext<[() => Promise<any>] | undefined>(undefined)

const Course = () => {
  const [selectedCourse, setSelectedCourse] = useState<CourseT | undefined>();
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isSort, setIsSort] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDeleteCourse, setIsDeleteCourse] = useState(false)
  const [errorDeleteCourse, setErrorDeleteCourse] = useState({
    isError: false,
    message: "ลบไม่สำเร็จ ดูเพิ่มเติมใน Console"
  })

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
    if(!isRefetching){
      if(selectedCourse){
        // for update delete
        const findCourse = courses?.find(course => course.id === selectedCourse.id)
        if(findCourse) {
          setSelectedCourse(findCourse)
        }
      }
    }
  }, [isRefetching])

  const courseItem = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    console.table({ startIndex, endIndex });
    console.log(courses);

    const currentCourses = courses?.slice(startIndex, endIndex);
    
    if (courses) {
      setPageSize(Math.ceil(courses.length / rowsPerPage));
    }
    return currentCourses;
  }, [page, courses, isLoading]);

  console.log(courseItem);

  const handleCloseManageCourse = () => {
    setIsOpenDrawer(false);
    setSelectedCourse(undefined);
  }

  const confirmDeleteCourse = async () => {
    if(!selectedCourse){
      return
    }
    const res = await deleteCourse(selectedCourse.id)
    console.log(res);
    if(!res) {
      setErrorDeleteCourse(prev => ({...prev, isError: true}))
      return
    }
    setIsDeleteCourse(false)
    handleCloseManageCourse()
    refetchCourse()
  }

  const handleCloseDeleteCourseDialog = () => {
    setErrorDeleteCourse(prev => ({...prev, isError: false}))
    setIsDeleteCourse(false)
  }

  const onAddedCourse = async (courseId: number) => {
    const res = await refetchCourse()
    const course = res.data
    console.log(course);
    if(!course) return
    const findCourse = course.find((course) => course.id === courseId)
    console.log(findCourse);
    setSelectedCourse(findCourse)
  }

  const refreshCourse = async () => {
    if(!selectedCourse) return
    const res = await refetchCourse()
    const course = res.data
    if(!course) return
    const findCourse = course.find((course) => course.id === selectedCourse.id)
    console.log(findCourse);
    setSelectedCourse(findCourse)
  }

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
                  <SelectItem key={index} startContent={courseStatus[key].icon}>
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
                    <SelectItem aria-label={`${tutor.name}`} key={tutor.name}>
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
                <TableRow key={`${course.id}`}>
                  <TableCell
                    onClick={() => {
                      setSelectedCourse(course);
                      setIsOpenDrawer((prev) => !prev);
                    }}
                  >
                    <div className="flex gap-2 items-center">
                      {course.image && (
                        <Image radius="sm" width={40} src={course.image} />
                      )}
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
                    {course.documents?.map((document, index) => (
                      <DocumentComponent
                        key={`documet${index}`}
                        document={document}
                      />
                    ))}
                  </TableCell>
                </TableRow>
              )}
              {/* <TableRow className="hidden" key={"1"}>
                <TableCell className="" onClick={() => setIsOpenDrawer(prev => !prev)}>
                  <div className="flex gap-2 items-center">
                    <Image width={40} src="https://app.odm-engineer.com/media/images/course/course_1726923815_ea6cb7ae-1c1e-43a5-93e7-4bfb6d9ff7fa.jpg" />
                    <div>
                      Dynamics CE (CRMA) midterm
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-success-500">
                    <PlayCircle variant="Bulk" />
                    <div>
                      ลง Web-app แล้ว
                    </div>
                  </div>
                </TableCell>
                <TableCell>อิ้ว</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image className="rounded-sm" width={16} src="https://app.odm-engineer.com/media/images/course/course_1726828605_70ba503e-0c22-4eb0-a227-9788caae9d5d.jpg" />
                    <div>Dynamics midterm 2/2565</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScrollText size={16} />
                    <div>Dynamics - 2566 - 5.1 Rotating Motion</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClipboardSignature size={16} />
                    <div>Dynamics - 2566 - Pre-Midterm</div>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="hidden" key={"2"}>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <div>
                      Dynamics CE (CRMA) midterm
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-warning-500">
                    <Video variant="Bulk" />
                    <div>
                      มีเนื้อหา
                    </div>
                  </div>
                </TableCell>
                <TableCell>อิ้ว</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image className="rounded-sm" width={16} src="https://app.odm-engineer.com/media/images/course/course_1726828605_70ba503e-0c22-4eb0-a227-9788caae9d5d.jpg" />
                    <div>Dynamics midterm 2/2565</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScrollText size={16} />
                    <div>Dynamics - 2566 - 5.1 Rotating Motion</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClipboardSignature size={16} />
                    <div>Dynamics - 2566 - Pre-Midterm</div>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="hidden" key={"3"}>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <div>
                      Dynamics CE (CRMA) midterm
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-danger-500">
                    <ClipboardClose variant="Bulk" />
                    <div>
                      ไม่มีเนื้อหา
                    </div>
                  </div>
                </TableCell>
                <TableCell>อิ้ว</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image className="rounded-sm" width={16} src="https://app.odm-engineer.com/media/images/course/course_1726828605_70ba503e-0c22-4eb0-a227-9788caae9d5d.jpg" />
                    <div>Dynamics midterm 2/2565</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScrollText size={16} />
                    <div>Dynamics - 2566 - 5.1 Rotating Motion</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClipboardSignature size={16} />
                    <div>Dynamics - 2566 - Pre-Midterm</div>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="hidden" key={"4"}>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <Image width={40} src="https://app.odm-engineer.com/media/images/course/course_1726923815_ea6cb7ae-1c1e-43a5-93e7-4bfb6d9ff7fa.jpg" />
                    <div>
                      Dynamics CE (CRMA) midterm
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-primary-500">
                    <TickCircle variant="Bulk" />
                    <div>
                      ใส่แบบประเมิน
                    </div>
                  </div>
                </TableCell>
                <TableCell>อิ้ว</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image className="rounded-sm" width={16} src="https://app.odm-engineer.com/media/images/course/course_1726828605_70ba503e-0c22-4eb0-a227-9788caae9d5d.jpg" />
                    <div>Dynamics midterm 2/2565</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScrollText size={16} />
                    <div>Dynamics - 2566 - 5.1 Rotating Motion</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClipboardSignature size={16} />
                    <div>Dynamics - 2566 - Pre-Midterm</div>
                  </div>
                </TableCell>
              </TableRow> */}
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

