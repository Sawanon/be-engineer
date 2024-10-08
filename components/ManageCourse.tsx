"use client";
import { addCourse } from "@/lib/actions/course.actions";
import { PlayList } from "@/lib/model/playlist";
import { Course } from "@/lib/model/course";
import { useMemo, useState } from "react";
import CustomDrawer from "./Drawer";
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
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Divider,
  Image,
  Input,
  Modal,
  ModalContent,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@nextui-org/react";
import ManageLesson from "./ManageLesson";

const ManageCourse = ({
  isOpenDrawer,
  selectedCourse,
  onClose,
  onConfirm,
  tutorList,
  playList,
  onFetch,
}: {
  isOpenDrawer: boolean;
  selectedCourse: Course | undefined;
  onClose: () => void;
  onConfirm?: () => Promise<void>;
  onFetch?: () => Promise<void>;
  tutorList:
    | {
        id: number;
        name: string;
      }[]
    | undefined;
  playList: PlayList[] | undefined;
}) => {
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isSort, setIsSort] = useState(false);
  const [lessons, setLessons] = useState([
    { id: 1, title: "Dynamics - 1.1 Velocity and Acceleration" },
    { id: 2, title: "Dynamics - 1.2 Graphical" },
    { id: 3, title: "Dynamics - 1.3 X-Y Coordinate" },
  ]);
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

  useMemo(() => {
    setIsAdd(selectedCourse == undefined);
  }, [selectedCourse]);

  const handleOnChangeCourseName = (value: string) => {
    setCourseName(value);
  };

  const handleOnChangeCourseDetail = (value: string) => {
    setCourseDetail(value);
  };

  const handleOnChangeCourseTutor = (value: string) => {
    setCourseTutorId(parseInt(value));
  };

  const handleOnChangeCourseLink = (value: string) => {
    setCourseLink(value);
  };

  const handleOnChangePlaylist = (value: string) => {
    setPlaylist(value);
  };

  const handleOnChangePrice = (value: string) => {
    setPrice(parseInt(value));
  };

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

  const handleConfirm = async () => {
    try {
      if (!onConfirm) {
        return;
      }
      const res = await submitAddCourse();
      await onConfirm();
      setIsAdd(false);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setAddCourseError({
          isError: true,
          message: error.message,
        });
      }
    }
  };

  const submitAddCourse = async () => {
    if (
      !courseName ||
      !price ||
      !courseDetail ||
      !courseTutorId ||
      !clueLink ||
      !playlist
    ) {
      throw Error(`กรุณากรอกข้อมูลให้ครบ`);
    }
    console.table({
      courseName,
      courseDetail,
      courseTutorId,
      clueLink,
      webappPlaylistId: playlist,
      price,
    });
    const res = await addCourse({
      name: courseName,
      detail: courseDetail,
      tutor: courseTutorId,
      clueLink: clueLink,
      price: price,
      status: "noContent",
      playlist: playlist,
    });
    console.log(res);
    return res;
  };

  return (
    <CustomDrawer
      isOpen={isOpenDrawer}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
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
            >
              แอดมิน
            </Button>
          </div>
          {addCourseError.isError && (
            <div className="mt-2 rounded-lg bg-danger-50 text-danger-500 border-l-4 border-danger-500 flex items-center gap-2 py-2 px-[14px]">
              <Danger variant="Bold" />
              <div className="font-IBM-Thai-Looped font-normal">
                {addCourseError.message}
              </div>
            </div>
          )}
          {isEdit || isAdd ? (
            <div className="mt-2">
              <Input
                size="lg"
                defaultValue={isAdd ? undefined : `${selectedCourse?.name}`}
                className="font-IBM-Thai-Looped text-lg font-medium"
                classNames={{
                  input: "font-IBM-Thai-Looped font-medium text-[1em]",
                }}
                placeholder="ชื่อวิชา"
                onChange={(e) => handleOnChangeCourseName(e.target.value)}
              />
              <div id="textarea-wrapper">
                <Textarea
                  // defaultValue={isAdd ? undefined : `วิชา MEE000 Engineering Mechanics II สำหรับ ม. พระจอมเกล้าธนบุรี เนื้อหา midterm`}
                  defaultValue={
                    isAdd ? undefined : selectedCourse?.detail ?? "-"
                  }
                  classNames={{
                    input: `text-[1em]`
                  }}
                  className="mt-2 font-IBM-Thai-Looped"
                  placeholder="วิชา MEE000 Engineering Mechanics II สำหรับ ม. พระจอมเกล้าธนบุรีเนื้อหา midterm"
                  onChange={(e) => handleOnChangeCourseDetail(e.target.value)}
                />
              </div>
              <Select
                placeholder={`ติวเตอร์`}
                defaultSelectedKeys={
                  isAdd ? undefined : [`${selectedCourse?.tutorLink}`]
                }
                classNames={{
                  value: `text-[1em]`
                }}
                aria-label="ติวเตอร์"
                className="font-IBM-Thai-Looped mt-2"
                onChange={(e) => {
                  handleOnChangeCourseTutor(e.target.value);
                }}
                // classNames={{
                //   value: [
                //     "font-bold",
                //   ]
                // }}
                // renderValue={(items) => (<div>ติวเตอร์</div>)}
              >
                {tutorList ? (
                  tutorList.map((tutor) => {
                    return (
                      <SelectItem
                        className="font-IBM-Thai-Looped"
                        aria-label={`${tutor.name}`}
                        key={tutor.id}
                      >
                        {tutor.name}
                      </SelectItem>
                    );
                  })
                ) : (
                  <SelectItem
                    className="font-IBM-Thai-Looped"
                    aria-label={`loading`}
                    key={`loading`}
                  >
                    loading...
                  </SelectItem>
                )}
              </Select>
              <Input
                defaultValue={
                  isAdd ? undefined : selectedCourse?.clueLink ?? "-"
                }
                className="font-IBM-Thai-Looped mt-2"
                classNames={{
                  input: `text-[1em]`
                }}
                placeholder="Link เฉลย"
                onChange={(e) => handleOnChangeCourseLink(e.target.value)}
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
                classNames={{
                  input: `text-[1em]`
                }}
                placeholder={`Playlist`}
                onChange={(e) => handleOnChangePlaylist(e.target.value)}
              />
              {/* <Autocomplete label="Select an animal" className="max-w-xs">
                {playList ? (
                  playList.map((playList) => (
                    <AutocompleteItem key={playList.id} value={playList.id}>
                      {playList.name}
                    </AutocompleteItem>
                  ))
                ) : (
                  <AutocompleteItem key={"loading"} value={"loading"}>
                    loading...
                  </AutocompleteItem>
                )}
              </Autocomplete> */}
              <Input
                defaultValue={selectedCourse?.price?.toString()}
                className="font-IBM-Thai-Looped mt-2"
                classNames={{
                  input: `text-[1em]`
                }}
                placeholder="ราคา"
                type="number"
                onChange={(e) => handleOnChangePrice(e.target.value)}
              />
            </div>
          ) : (
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
                  {/* 2,400.- */}
                </span>
              </div>
            </div>
          )}
          <div className="mt-4">
            {isAdd ? (
              <Button
                onClick={() => handleConfirm()}
                className="bg-default-foreground text-primary-foreground font-IBM-Thai font-medium"
                fullWidth
              >
                บันทึก
              </Button>
            ) : isEdit ? (
              <>
                <Button
                  onClick={() => setIsEdit(false)}
                  className="bg-default-foreground text-primary-foreground font-IBM-Thai font-medium"
                  fullWidth
                >
                  บันทึก
                </Button>
                <Button
                  onClick={() => setIsDelete(true)}
                  className="bg-transparent text-danger-500 font-IBM-Thai font-medium mt-2"
                  fullWidth
                >
                  ลบ
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEdit(true)}
                className="bg-default-100 font-IBM-Thai font-medium"
                fullWidth
              >
                แก้ไข
              </Button>
            )}
          </div>
        </div>
        {/* lesson */}
        <ManageLesson
          courseId={selectedCourse?.id ?? 0}
          lessons={selectedCourse?.CourseLesson}
          onFetch={async () => {
            if(onFetch){ 
              await onFetch()
            }
          }}
        />
        <div className="hidden bg-default-100 p-[14px] md:min-w-[469px] md:w-[469px] overflow-y-auto">
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
                  {/* <FileText className="text-foreground-400" size={16} /> */}
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
                  {/* <FileText className="text-foreground-400" size={16} /> */}
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
      </div>
    </CustomDrawer>
  );
};

export default ManageCourse;
