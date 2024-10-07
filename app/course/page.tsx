"use client"
import React, { useMemo, useState } from "react";
// import { useTheme } from "next-themes";
import { Button, Divider, Image, Input, Modal, ModalContent, Pagination, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Textarea } from "@nextui-org/react";
import { ArrowDownUp, ArrowLeft, Book, ChevronDown, ClipboardSignature, FileText, MoreHorizontal, Plus, RefreshCcw, ScrollText, Search, Video as VideoLucide, X } from "lucide-react";
import { Danger, Video } from "iconsax-react";
import { courseStatus, tableClassnames } from "../../lib/res/const";
import CustomDrawer from "@/components/Drawer";
import { Course as CourseT } from "@/lib/model/course";
import { Document } from "@/lib/model/document";
import SortableComponent from "@/components/Sortable";
import { arrayMove } from "@dnd-kit/sortable";
import axios from "axios";
import { listCourseAction } from "@/lib/actions/course.actions";
import { useQuery } from "@tanstack/react-query";

const Status = ({course}: {course: CourseT}) => {
  let textColor = ""
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
    <div className={`flex gap-[2px] items-center font-IBM-Thai-Looped ${textColor}`}>
      {courseStatus[course.status].icon}
      <div>
        {courseStatus[course.status].name}
      </div>
    </div>
  )
}

const DocumentComponent = ({document}: {document: Document}) => {
  let icon = <></>
  switch (document.type) {
    case "book":
      icon = <Image className="rounded-sm" width={16} src={`${document.imageUrl}`} />;
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
      <div>
        {document.name}
      </div>
    </div>
  )
}


const Course = () => {
  // const {theme, setTheme } = useTheme();
  // const [courses, setCourses] = useState<CourseT[]>([
  //   {
  //     name: "Dynamics CE (CRMA) midterm",
  //     status: "uploadWebapp",
  //     tutor: "อิ๊ว",
  //     imageUrl: "https://app.odm-engineer.com/media/images/course/course_1726923815_ea6cb7ae-1c1e-43a5-93e7-4bfb6d9ff7fa.jpg",
  //     documents: [
  //       {
  //         name: `Dynamics midterm 2/2565`,
  //         type: `book`,
  //         imageUrl: `https://app.odm-engineer.com/media/images/course/course_1726828605_70ba503e-0c22-4eb0-a227-9788caae9d5d.jpg`,
  //       },
  //       {
  //         name: `Dynamics - 2566 - 5.1 Rotating Motion`,
  //         type: `sheet`,
  //       },
  //       {
  //         name: `Dynamics - 2566 - Pre-Midterm`,
  //         type: `pre-exam`,
  //       },
  //     ],
  //   },
  //   {
  //     name: "Dynamics CE (CRMA) midterm",
  //     status: "hasContent",
  //     tutor: "อิ๊ว",
  //     documents: [
  //       {
  //         name: `Dynamics midterm 2/2565`,
  //         type: `book`,
  //         imageUrl: `https://app.odm-engineer.com/media/images/course/course_1726828605_70ba503e-0c22-4eb0-a227-9788caae9d5d.jpg`,
  //       },
  //       {
  //         name: `Dynamics - 2566 - 5.1 Rotating Motion`,
  //         type: `sheet`,
  //       },
  //       {
  //         name: `Dynamics - 2566 - Pre-Midterm`,
  //         type: `pre-exam`,
  //       },
  //     ],
  //   },
  //   {
  //     name: "Dynamics CE (CRMA) midterm",
  //     status: "noContent",
  //     tutor: "อิ๊ว",
  //     documents: [
        
  //     ],
  //   },
  //   {
  //     name: "Dynamics CE (CRMA) midterm",
  //     status: "enterForm",
  //     tutor: "อิ๊ว",
  //     imageUrl: "https://app.odm-engineer.com/media/images/course/course_1726923815_ea6cb7ae-1c1e-43a5-93e7-4bfb6d9ff7fa.jpg",
  //     documents: [
  //       {
  //         name: `Dynamics midterm 2/2565`,
  //         type: `book`,
  //         imageUrl: `https://app.odm-engineer.com/media/images/course/course_1726828605_70ba503e-0c22-4eb0-a227-9788caae9d5d.jpg`,
  //       },
  //       {
  //         name: `Dynamics - 2566 - 5.1 Rotating Motion`,
  //         type: `sheet`,
  //       },
  //       {
  //         name: `Dynamics - 2566 - Pre-Midterm`,
  //         type: `pre-exam`,
  //       },
  //     ],
  //   },
  // ])
  // const [courses, setCourse] = useState<CourseT[]>([])
  const [selectedCourse, setSelectedCourse] = useState<CourseT | undefined>()
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isSort, setIsSort] = useState(false)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const rowsPerPage = 5;
  const {data:courses, isLoading, status, error} = useQuery({
    queryKey: ['listCourseAction'],
    queryFn: () => listCourseAction()
  })

  // const listCourse = async () => {
  //   const courseList = await listCourseAction()
  //   console.log(courseList);
  //   if(courseList === undefined){
  //     return
  //   }
  //   setCourse(courseList)
  //   setPageSize(Math.ceil(courseList.length / rowsPerPage))
  // }
console.table({
  status,
});
console.log(error);


  const courseItem = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    console.table({startIndex, endIndex});
    console.log(courses);
    
    const currentCourses = courses?.slice(startIndex, endIndex);
    if(courses){
      setPageSize(courses.length / rowsPerPage)
    }
    return currentCourses;
  }, [page, courses, isLoading])

  console.log(courseItem);
  

  return (
    // <div className="flex flex-col pt-6 px-4 bg-background relative md:h-screenDevice bg-red-400 md:bg-green-400">
    <div className="flex flex-col pt-6 px-app bg-background relative h-screenDevice bg-default-50">
      <div>
        Boom {`${pageSize}`} / {`${courseItem?.length}`}
      </div>
      {/* Drawer */}
      <ManageCourse
        isOpenDrawer={isOpenDrawer}
        selectedCourse={selectedCourse}
        onClose={() => {
          setIsOpenDrawer(false)
          setSelectedCourse(undefined)
        }}
        onConfirm={async () => {
          
        }}
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
              value: [
                "font-bold",
              ],
              popoverContent: [
                `w-max right-0 absolute`
              ],
            }}
            renderValue={(items) => (<div>สถานะ</div>)}
          >
            {Object.keys(courseStatus).map((key, index) => {
              return (
              <SelectItem
                key={index}
                startContent={courseStatus[key].icon}
              >
                {courseStatus[key].name}
              </SelectItem>
              )
            })}
          </Select>
          <Select
            selectionMode="multiple"
            placeholder={`ติวเตอร์`}
            aria-label="ติวเตอร์"
            className="font-IBM-Thai md:w-[113px]"
            classNames={{
              value: [
                "font-bold",
              ]
            }}
            renderValue={(items) => (<div>ติวเตอร์</div>)}
          >
            {["กล้า","จุ๊"].map((value) => {
              return (
              <SelectItem aria-label={`${value}`} key={value}>
                {value}
              </SelectItem>
              )
            })}
          </Select>
        </div>
        <Button
          className="mt-2 md:mt-0 w-full md:w-auto font-IBM-Thai text-base font-medium bg-default-foreground text-primary-foreground"
          endContent={<Plus strokeWidth={4} />}
          onClick={() => {
            setIsOpenDrawer(true)
          }}
        >
          เพิ่ม
        </Button>
      </div>
      <div className="mt-4 flex-1">
        <Table
          isStriped
          aria-label="course-table"
          classNames={tableClassnames}
        >
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
                    setIsOpenDrawer(prev => !prev)
                  }}
                >
                  <div className="flex gap-2 items-center">
                    {course.image &&
                      <Image radius="sm" width={40} src={course.image} />
                    }
                    <div className="font-IBM-Thai-Looped">
                      {course.name} {course.id}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Status course={course} />
                </TableCell>
                <TableCell className="font-IBM-Thai-Looped">อิ้ว</TableCell>
                <TableCell className="font-IBM-Thai-Looped">
                  {course.documents?.map((document, index) => (
                    <DocumentComponent key={`documet${index}`} document={document} />
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
            cursor: 'bg-default-foreground'
          }}
          onChange={(page) => setPage(page)}
        />
      </div>
    </div>
  );
};

export default Course;

const ManageCourse = ({
  isOpenDrawer,
  selectedCourse,
  onClose,
  onConfirm,
}: {
  isOpenDrawer: boolean,
  selectedCourse: CourseT | undefined,
  onClose: () => void,
  onConfirm?: () => Promise<void>,
}) => {
  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [isSort, setIsSort] = useState(false)
  const [lessons, setLessons] = useState([
    { id: 1, title: 'Dynamics - 1.1 Velocity and Acceleration'},
    { id: 2, title: 'Dynamics - 1.2 Graphical'},
    { id: 3, title: 'Dynamics - 1.3 X-Y Coordinate'},
  ])

  useMemo(() => {
    setIsAdd(selectedCourse == undefined)
    console.log("use Memo");
  }, [selectedCourse])
  
  const handleClose = () => {
    setIsEdit(false)
    setIsDelete(false)
    setIsAdd(true)
    onClose();
  }

  const handleConfirm = async () =>{
    if(!onConfirm){
      return
    }
    await onConfirm()
    setIsAdd(false)
  }

  return (
    <CustomDrawer
        isOpen={isOpenDrawer}
        onOpenChange={(open) => {
          if(!open){
            handleClose()
          }
        }}
      >
        <Modal
          isOpen={isSort}
          closeButton={<></>}
        >
          <ModalContent>
            {() => (
              <div className="p-[14px]">
                <div className="flex">
                  <div className="flex-1"></div>
                  <div className={`flex-1 text-nowrap text-3xl font-semibold font-IBM-Thai`}>จัดเรียงเนื้อหา</div>
                  <div className="flex-1 flex justify-end">
                    <Button className="bg-transparent" isIconOnly onClick={() => setIsSort(false)}>
                      <X />
                    </Button>
                  </div>
                </div>
                <div className={`mt-[14px] overflow-hidden`}>
                  <SortableComponent
                    lessons={lessons}
                    onDragEnd={(event) => {
                      // console.log(`event.collisions`, event.collisions);
                      const {active, over} = event
                      setLessons((lessons) => {
                        const originalPos = lessons.findIndex(lesson => lesson.id === active.id)
                        const newPos = lessons.findIndex(lesson => lesson.id === over!.id)
                        return arrayMove(lessons, originalPos, newPos)
                      })
                      // setLessons(event.collisions)
                    }}
                  />
                </div>
              </div>
            )}
          </ModalContent>
        </Modal>
        {/* <div className="block md:flex h-full w-auto overflow-auto"> */}
        <div className="block md:flex w-auto overflow-auto">
          <div className="min-w-[342px] md:w-[342px] p-[14px]">
            {/* TODO: add course */}
            <div className="flex justify-between">
              <Button onClick={handleClose} className="bg-default-100" isIconOnly>
                <ArrowLeft size={24} />
              </Button>
              <Button className="bg-default-100 font-IBM-Thai" endContent={<RefreshCcw size={20} />}>
                แอดมิน
              </Button>
            </div>
            {isEdit || isAdd
            ?
            <div className="mt-2">
              <Input
                size="lg"
                defaultValue={isAdd ? undefined : `${selectedCourse?.name}`}
                className="font-IBM-Thai-Looped text-lg font-medium"
                classNames={{
                  input: "font-IBM-Thai-Looped text-lg font-medium"
                }}
                placeholder="ชื่อวิชา"
              />
              <div id="textarea-wrapper">
                <Textarea
                  // defaultValue={isAdd ? undefined : `วิชา MEE000 Engineering Mechanics II สำหรับ ม. พระจอมเกล้าธนบุรี เนื้อหา midterm`}
                  defaultValue={isAdd ? undefined : selectedCourse?.detail}
                  className="mt-2 font-IBM-Thai-Looped"
                  placeholder="วิชา MEE000 Engineering Mechanics II สำหรับ ม. พระจอมเกล้าธนบุรีเนื้อหา midterm"
                />
              </div>
              <Select
                placeholder={`ติวเตอร์`}
                defaultSelectedKeys={isAdd ? undefined : [`${selectedCourse?.tutor}`]}
                aria-label="ติวเตอร์"
                className="font-IBM-Thai-Looped mt-2"
                // classNames={{
                //   value: [
                //     "font-bold",
                //   ]
                // }}
                // renderValue={(items) => (<div>ติวเตอร์</div>)}
              >
                {["กล้า","อิ๊ว"].map((value) => {
                  return (
                  <SelectItem className="font-IBM-Thai-Looped" aria-label={`${value}`} key={value}>
                    {value}
                  </SelectItem>
                  )
                })}
              </Select>
              <Input
                defaultValue={isAdd ? undefined : selectedCourse?.clueLink}
                className="font-IBM-Thai-Looped mt-2"
                placeholder="Link เฉลย"
              />
              {/* <Select
                placeholder={`Playlist`}
                aria-label="Playlist"
                className="font-IBM-Thai mt-2"
              >
                {["Dynamics (CU) midterm 1/2567"].map((value) => {
                  return (
                  <SelectItem aria-label={`${value}`} key={value}>
                    {value}
                  </SelectItem>
                  )
                })}
              </Select> */}
              <Input
                defaultValue={selectedCourse?.webappPlaylistId?.toString()}
                className={`font-IBM-Thai-Looped mt-2`}
                placeholder={`Playlist`}
              />
              <Input
                defaultValue={selectedCourse?.price?.toString()}
                className="font-IBM-Thai-Looped mt-2"
                placeholder="ราคา"
              />
            </div>
            :
            <div className="mt-4">
              <div className="text-2xl font-bold font-IBM-Thai">
                {/* Dynamics (CU) midterm */}
                {selectedCourse?.name}
              </div>
              <div className="text-base mt-2 font-IBM-Thai-Looped">
                {selectedCourse?.detail ?? '-'}
                {/* วิชา MEE000 Engineering Mechanics II สำหรับ ม. พระจอมเกล้าธนบุรี เนื้อหา midterm */}
              </div>
              <div className="space-x-1 mt-2 font-IBM-Thai-Looped">
                <span className={`font-bold`}>ผู้สอน:</span>
                <span>{selectedCourse?.tutor ?? '-'}</span>
              </div>
              <div className="space-x-1 mt-2 font-IBM-Thai-Looped" style={{overflowWrap: 'break-word'}}>
                <span className={`font-bold`}>เฉลย:</span>
                <span>
                  {selectedCourse?.clueLink ?? '-'}
                  {/* www.facebook.com/groups/cudynamics167middsfsdfsdf */}
                </span>
              </div>
              <div className="space-x-1 mt-2 font-IBM-Thai-Looped" style={{overflowWrap: 'break-word'}}>
                <span className={`font-bold`}>Playlist:</span>
                <span>
                  {selectedCourse?.webappPlaylistId ?? '-'}
                </span>
              </div>
              <div className="space-x-1 mt-2 font-IBM-Thai-Looped" style={{overflowWrap: 'break-word'}}>
                <span className={`font-bold`}>ราคา:</span>
                <span>
                  {selectedCourse?.price ?? '-'}
                  {/* 2,400.- */}
                </span>
              </div>
            </div>
            }
            <div className="mt-4">
              {isAdd
              ?
                <Button onClick={() => handleConfirm()} className="bg-default-foreground text-primary-foreground font-IBM-Thai font-medium" fullWidth>
                  บันทึก
                </Button>
              :
              isEdit
              ?
                <>
                  <Button onClick={() => setIsEdit(false)} className="bg-default-foreground text-primary-foreground font-IBM-Thai font-medium" fullWidth>
                    บันทึก
                  </Button>
                  <Button onClick={() => setIsDelete(true)} className="bg-transparent text-danger-500 font-IBM-Thai font-medium mt-2" fullWidth>
                    ลบ
                  </Button>
                </>
              :
                <Button onClick={() => setIsEdit(true)} className="bg-default-100 font-IBM-Thai font-medium" fullWidth>
                  แก้ไข
                </Button>
              }
            </div>
          </div>
          {/* lesson */}
          <div className="bg-default-100 p-[14px] md:min-w-[469px] md:w-[469px] overflow-y-auto">
            <div className="flex items-center gap-3">
              <div className="font-bold text-2xl font-IBM-Thai">หลักสูตร</div>
              <Button size="sm" className="bg-transparent" isIconOnly>
                <ChevronDown size={24} />
              </Button>
            </div>
            <div className="mt-2 rounded-lg bg-danger-50 text-danger-500 border-l-4 border-danger-500 flex items-center gap-2 py-2 px-[14px]">
              <Danger variant="Bold" />
              <div className="font-IBM-Thai-Looped font-normal">
                กรุณาใส่เอกสารในเนื้อหา
              </div>
            </div>
            <div className="mt-2 bg-content1 rounded-lg p-2 border-2 border-danger-500">
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
                  <div className="ml-1 flex-1">Dynamics - 1.1 Velocity and Acceleration</div>
                  <div className="text-sm text-foreground-400">
                    99 นาที
                  </div>
                </div>
                <div className="flex p-1 items-center">
                  <div className="w-8 flex">
                    <Video className="text-foreground-400" size={16} />
                    <FileText className="text-foreground-400" size={16} />
                  </div>
                  <div className="ml-1 flex-1">Dynamics - 1.2 Graphical</div>
                  <div className="text-sm text-foreground-400">
                    59 นาที
                  </div>
                </div>
                <div className="flex p-1 items-center">
                  <div className="w-8 flex">
                    <Video className="text-foreground-400" size={16} />
                    {/* <FileText className="text-foreground-400" size={16} /> */}
                  </div>
                  <div className="ml-1 flex-1">Dynamics - 1.3 X-Y Coordinate</div>
                  <div className="text-sm text-foreground-400">
                    74 นาที
                  </div>
                </div>
                <div className="flex justify-center gap-2">
                  <Button onClick={() => setIsSort(true)} className="bg-default-100 font-IBM-Thai font-medium" startContent={<ArrowDownUp size={20} />}>
                    จัดเรียง
                  </Button>
                  <Button className="bg-default-100 font-IBM-Thai font-medium" startContent={<VideoLucide size={20} />}>
                    เพิ่มลด เนื้อหา
                  </Button>
                </div>
              </div>
              <Divider className="mt-2" />
              <div className="mt-2 flex flex-col gap-2 items-center">
                <div className="text-danger-500 text-sm font-IBM-Thai-Looped text-center">
                  กรุณาใส่เอกสาร
                </div>
                <Button className="bg-default-100 font-IBM-Thai font-medium" startContent={<Book size={20} />}>
                  เอกสาร
                </Button>
              </div>
            </div>
            <div className="mt-2 bg-content1 rounded-lg p-2">
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
                  <div className="ml-1 flex-1">Dynamics - 2.1 Force and Acceleration</div>
                  <div className="text-sm text-foreground-400">
                    99 นาที
                  </div>
                </div>
                <div className="flex p-1 items-center">
                  <div className="w-8 flex">
                    <Video className="text-foreground-400" size={16} />
                    <FileText className="text-foreground-400" size={16} />
                  </div>
                  <div className="ml-1 flex-1">Dynamics - 2.2 Friction</div>
                  <div className="text-sm text-foreground-400">
                    59 นาที
                  </div>
                </div>
                <div className="flex p-1 items-center">
                  <div className="w-8 flex">
                    <Video className="text-foreground-400" size={16} />
                    {/* <FileText className="text-foreground-400" size={16} /> */}
                  </div>
                  <div className="ml-1 flex-1">Dynamics - 2.3 Friction Pt2</div>
                  <div className="text-sm text-foreground-400">
                    74 นาที
                  </div>
                </div>
                <div className="flex justify-center gap-2">
                  <Button className="bg-default-100 font-IBM-Thai font-medium" startContent={<ArrowDownUp size={20} />}>
                    จัดเรียง
                  </Button>
                  <Button className="bg-default-100 font-IBM-Thai font-medium" startContent={<VideoLucide size={20} />}>
                    เพิ่มลด เนื้อหา
                  </Button>
                </div>
              </div>
              <Divider className="mt-2" />
              <div className="mt-2 flex flex-col gap-2 items-center">
                <div className="text-danger-500 text-sm font-IBM-Thai-Looped text-center">
                  กรุณาใส่เอกสาร
                </div>
                <Button className="bg-default-100 font-IBM-Thai font-medium" startContent={<Book size={20} />}>
                  เอกสาร
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CustomDrawer>
  )
}