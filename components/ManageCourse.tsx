"use client";
import {
  addCourse,
  deleteCourse,
  listCourseWebapp,
  searchImageByCourseName,
  updateCourse,
} from "@/lib/actions/course.actions";
import { PlayList } from "@/lib/model/playlist";
import { Course } from "@/lib/model/course";
import { useMemo, useState } from "react";
import CustomDrawer from "./Drawer";
import {
  ArrowDownUp,
  ArrowLeft,
  Book,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardSignature,
  Copy,
  ExternalLink,
  FileText,
  MoreHorizontal,
  Plus,
  RefreshCcw,
  ScrollText,
  Search,
  Tag,
  Video as VideoLucide,
  X,
} from "lucide-react";
import { Danger, PlayCircle, Video } from "iconsax-react";
import {
  Accordion,
  AccordionItem,
  Autocomplete,
  AutocompleteItem,
  Button,
  Divider,
  Image,
  Input,
  Modal,
  ModalContent,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Snippet,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@nextui-org/react";
import ManageLesson from "./ManageLesson";
import { useCourse } from "./Course/courseHook";
import { div } from "framer-motion/client";
import copy from "copy-to-clipboard";
import { useQuery } from "@tanstack/react-query";
import { Key } from "@react-types/shared";

const ManageCourse = ({
  isOpenDrawer,
  selectedCourse,
  onClose,
  onConfirmAdd,
  tutorList,
  playList,
  onFetch,
  onDeleteCourse,
}: {
  isOpenDrawer: boolean;
  selectedCourse: Course | undefined;
  onClose: () => void;
  onConfirmAdd?: (courseId: number) => Promise<void>;
  onFetch?: () => Promise<void>;
  onDeleteCourse?: () => Promise<void>;
  tutorList:
    | {
        id: number;
        name: string;
      }[]
    | undefined;
  playList: PlayList[] | undefined;
}) => {
  const { data: webappBranchCourseList, isFetched } = useQuery({
    queryKey: [`listCourseWebapp`],
    queryFn: () => listCourseWebapp(),
  });
  const [refetchCourse] = useCourse();
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
  const [mode, setMode] = useState<"tutor" | "admin">("tutor");
  const [courseImageList, setCourseImageList] = useState<string[]>([]);
  const [webappCourseList, setWebappCourseList] = useState<
    | { id: number; name: string; image: string; hasFeedback: boolean }[]
    | undefined
  >();

  const listImageCourse = async (courseName: string) => {
    const response = await searchImageByCourseName(courseName);
    setCourseImageList(response);
  };

  useMemo(() => {
    setIsAdd(selectedCourse === undefined);
    if (selectedCourse) {
      listImageCourse(selectedCourse.name);
    }
  }, [selectedCourse]);

  useMemo(() => {
    if (!selectedCourse) return;
    if (!webappBranchCourseList) return;
    console.error("boo");
    console.log(webappBranchCourseList);
    const webappCourseList = webappBranchCourseList.find(
      (webappBranch) => webappBranch.branch === selectedCourse.branch
    )?.courses;
    setWebappCourseList(webappCourseList);
  }, [isFetched, selectedCourse]);

  useMemo(() => {
    console.warn(webappCourseList);
  }, [webappCourseList]);

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

  const handleAddCourseConfirm = async () => {
    try {
      if (!onConfirmAdd) {
        return;
      }
      const res = await submitAddCourse();
      if (!res) return console.error(`can't add course ManagementCourse:140`);
      await onConfirmAdd(res.id);
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

  const handleDeleteCourse = async () => {
    if (onDeleteCourse) {
      onDeleteCourse();
    }
    // console.log(selectedCourse.id);

    // return
    // if(!selectedCourse){
    //   return
    // }
    // const res = await deleteCourse(selectedCourse.id)
    // console.log(res);
    // setIsDelete(true)
  };

  const handleConfirmEditCourse = async () => {
    if (!selectedCourse) return;
    setIsEdit(false);
    console.table({
      courseName,
      courseDetail,
      courseTutorId,
      clueLink,
      price,
      playlist,
    });
    let payload: any = {};
    if (courseName !== undefined) payload.name = courseName;
    if (courseDetail !== undefined) payload.detail = courseDetail;
    if (courseTutorId !== undefined) payload.tutorId = courseTutorId;
    if (clueLink !== undefined) payload.clueLink = clueLink;
    if (price !== undefined) payload.price = price;
    if (playlist !== undefined) payload.playlist = playlist;
    console.log("🚀 ~ handleConfirmEditCourse ~ payload:", payload);
    const response = await updateCourse(selectedCourse?.id, payload);
    console.log("🚀 ~ handleConfirmEditCourse ~ response:", response);
    await refetchCourse();
  };

  const handleSwitchMode = () => {
    setMode((prev) => (prev === "tutor" ? "admin" : "tutor"));
  };

  const handleOnChangeWebappBranch = async (key: Key | null) => {
    console.log(key);
    if (!webappBranchCourseList) return;
    const webappCourseList = webappBranchCourseList.find(
      (webappBranch) => webappBranch.branch === key
    )?.courses;
    setWebappCourseList(webappCourseList);
    if (!selectedCourse) return;
    if (!key) return;
    const response = await updateCourse(selectedCourse?.id, {
      branch: key,
    });
    console.log(response);
  };

  const handleOnChangeWebapp = async (key: Key | null) => {
    console.log(key);
    if (!key || !selectedCourse) return;
    const response = await updateCourse(selectedCourse?.id, {
      webappCourseId: parseInt(key.toString()),
    });
    console.log("🚀 ~ handleOnChangeWebapp ~ response:", response);
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
              onClick={handleSwitchMode}
            >
              {mode === "tutor" ? `แอดมิน` : `ติวเตอร์`}
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
          {mode === "admin" ? (
            // TODO: admin mode
            <div className={`mt-app`}>
              <div className={`flex gap-1 items-center`}>
                <div className={`text-success-500`}>
                  <PlayCircle size={20} variant="Bold" />
                </div>
                <div
                  className={`rounded-lg px-1 bg-default-50 text-lg font-bold font-IBM-Thai-Looped text-content4-foreground`}
                >
                  {selectedCourse?.name}
                </div>
              </div>
              <div className={`mt-2 flex gap-2 overflow-auto scrollbar-hide`}>
                {courseImageList.map((imageUrl, index) => {
                  return (
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
                  );
                })}
              </div>
              <div
                className={`mt-2 px-1 rounded-lg bg-default-50 text-base font-normal font-IBM-Thai-Looped`}
              >
                {selectedCourse?.detail}
              </div>
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
                        copy("30");
                      }}
                    >
                      {30}
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
                        copy(selectedCourse.price.toString());
                      }}
                    >
                      {selectedCourse?.price.toLocaleString()}
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
                <Autocomplete
                  aria-labelledby={`webappcourseBranch`}
                  className={`mt-2 font-IBM-Thai-Looped`}
                  placeholder="เลือกสาขา"
                  onSelectionChange={handleOnChangeWebappBranch}
                  defaultSelectedKey={selectedCourse?.branch!}
                >
                  {webappBranchCourseList ? (
                    webappBranchCourseList?.map((webappCourse, index) => {
                      return (
                        <AutocompleteItem
                          aria-labelledby={`webappcourseBranch${index}`}
                          key={webappCourse.branch}
                          value={webappCourse.branch}
                        >
                          {webappCourse.branch}
                        </AutocompleteItem>
                      );
                    })
                  ) : (
                    <AutocompleteItem key={`webappCourseBranchLoading`}>
                      loading...
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                <Autocomplete
                  aria-labelledby={`webappcourse`}
                  className={`mt-2 font-IBM-Thai-Looped`}
                  onSelectionChange={handleOnChangeWebapp}
                  placeholder="เลือกคอร์ส"
                  defaultSelectedKey={
                    !webappCourseList
                      ? ""
                      : selectedCourse?.webappCourseId?.toString()
                  }
                >
                  {webappCourseList ? (
                    webappCourseList?.map((webappCourse, index) => {
                      return (
                        <AutocompleteItem
                          aria-labelledby={`webappcourse${index}`}
                          key={webappCourse.id}
                          value={webappCourse.id}
                        >
                          {webappCourse.name}
                        </AutocompleteItem>
                      );
                    })
                  ) : (
                    <AutocompleteItem key={`webappCourseLoading`}>
                      loading...
                    </AutocompleteItem>
                  )}
                </Autocomplete>
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
          ) : isEdit || isAdd ? (
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
                    input: `text-[1em]`,
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
                  value: `text-[1em]`,
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
                defaultValue={selectedCourse?.clueLink ?? ""}
                className="font-IBM-Thai-Looped mt-2"
                classNames={{
                  input: `text-[1em]`,
                }}
                placeholder="Link เฉลย"
                onChange={(e) => handleOnChangeCourseLink(e.target.value)}
              />
              <Input
                defaultValue={selectedCourse?.playlist ?? ""}
                className={`font-IBM-Thai-Looped mt-2`}
                classNames={{
                  input: `text-[1em]`,
                }}
                placeholder={`Playlist`}
                onChange={(e) => handleOnChangePlaylist(e.target.value)}
              />
              <Input
                defaultValue={selectedCourse?.price?.toString()}
                className="font-IBM-Thai-Looped mt-2"
                classNames={{
                  input: `text-[1em]`,
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
          {mode === "tutor" && (
            <div className="mt-4">
              {isAdd ? (
                <Button
                  onClick={() => handleAddCourseConfirm()}
                  className="bg-default-foreground text-primary-foreground font-IBM-Thai font-medium"
                  fullWidth
                >
                  บันทึก
                </Button>
              ) : isEdit ? (
                <>
                  <Button
                    onClick={handleConfirmEditCourse}
                    className="bg-default-foreground text-primary-foreground font-IBM-Thai font-medium"
                    fullWidth
                  >
                    บันทึก
                  </Button>
                  <Button
                    onClick={() => handleDeleteCourse()}
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
        <div
          className={`${
            mode === "tutor" ? `hidden` : ``
          } bg-default-100 p-[14px] md:min-w-[469px] md:w-[469px] overflow-y-auto`}
        >
          <div className={`text-2xl font-bold font-IBM-Thai`}>สารบัญ</div>
          <div className={`mt-2 bg-content1 p-2 rounded-lg shadow`}>
            {selectedCourse?.CourseLesson.map((lesson: any, index) => {
              // selectedCourse?.CourseLesson.length
              return (
                <Popover key placement="top">
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
            <span>(00 ชม 00 นาที)</span>
          </div>
          <div className={`mt-2`}>
            {!selectedCourse ? (
              <></>
            ) : (
              <Accordion variant="splitted" className={`px-0`}>
                {selectedCourse?.CourseLesson.map((lesson: any, index) => {
                  return (
                    <AccordionItem
                      key="1"
                      aria-label={`${lesson.name}`}
                      title={(
                        <div className={`text-default-foreground text-sm font-IBM-Thai-Looped space-x-1`}>
                          <span className={`font-bold`}>
                            {lesson.name}
                          </span>
                          <span>
                            (4 ชม. 3 นาที)
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
        </div>
      </div>
    </CustomDrawer>
  );
};

export default ManageCourse;

const test = (
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
            // onClick={() => setIsSort(true)}
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
);