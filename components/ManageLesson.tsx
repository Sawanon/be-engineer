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
import React, { Key, useState } from "react";
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
import { addLessonToDB } from "@/lib/actions/lesson.actions";
import { CourseLesson, CourseVideo } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  getDetailPlayList,
  listPlayList,
} from "@/lib/actions/playlist.actions";
import { addCourseVideo, deleteCourseVideo } from "@/lib/actions/video.actions";

// export type CourseLessonAndContent = CourseLesson & {
//   CourseVideo: CourseVideo,
// }

const ManageLesson = ({
  courseId,
  lessons,
  onFetch,
}: {
  courseId: number;
  lessons?: any[];
  onFetch?: () => Promise<void>;
}) => {
  // const [lessons, setLessons] = useState([
  //   { id: 1, title: "Dynamics - 1.1 Velocity and Acceleration" },
  //   { id: 2, title: "Dynamics - 1.2 Graphical" },
  //   { id: 3, title: "Dynamics - 1.3 X-Y Coordinate" },
  // ]);
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
  const { data: playList } = useQuery({
    queryKey: ["listPlayList"],
    queryFn: () => listPlayList(),
  });
  console.log("lessons", lessons);

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

  const onChangePlayList = async (playlistId: Key | null) => {
    if (playlistId == null) return;
    const response = await getDetailPlayList(playlistId?.toString());
    console.log(response);
    setVideoList(response.video_library_onlinevideoplaylistmediaitem);
    setSelectedVideoPlaylist({
      name: response.name,
    });
  };

  const handleOnSelecteVideo = async (video: any, isSelected: boolean) => {
    console.log(video);
    if (isSelected) {
      // TODO: create to DB
      const videoRes = await addCourseVideo({
        courseLessonId: selectedLesson.id,
        videoLink: video.link,
        hour: video.hour_length,
        minute: video.minute_length,
        position: video.position,
        webappVideoId: video.id,
        name: video.name,
        playlistName: selectedVideoPlaylist.name,
      });
      console.log(videoRes);
      if (videoRes) {
        setVideoListInLesson((prev) => [...prev, videoRes]);
        if(onFetch){
          onFetch()
        }
      }
    } else {
      // TODO: delete in DB
      // setVideoListInLesson(prev => {
      //   const clonePrev = [...prev]
      //   const index = clonePrev.findIndex(video => video.webappVideoId === video.id)
      //   clonePrev.splice(index, 1)
      //   return clonePrev
      // })
    }
  };

  const handleOnCloseEditLessonVideo = () => {
    setSelectedLesson(undefined);
    setEditLessonContent(false);
    setVideoListInLesson([])
  };

  const handleDeleteVideo = async (videoInLesson: any, index: number) => {
    console.log(videoInLesson);
    const response = await deleteCourseVideo(videoInLesson.id);
    if (response) {
      setVideoListInLesson((prev) => {
        const clonePrev = [...prev];
        clonePrev.splice(index, 1);
        return clonePrev;
      });
      if(onFetch){
        onFetch()
      }
    }
  };
  return (
    <div className="bg-default-100 p-[14px] md:min-w-[469px] md:w-[469px] overflow-y-auto">
      {/* <Modal
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
                  lessons={lessons}
                  onDragEnd={(event) => {
                    // console.log(`event.collisions`, event.collisions);
                    const { active, over } = event;
                    setLessons((lessons) => {
                      const originalPos = lessons.findIndex(
                        (lesson) => lesson.id === active.id
                      );
                      const newPos = lessons.findIndex(
                        (lesson) => lesson.id === over!.id
                      );
                      return arrayMove(lessons, originalPos, newPos);
                    });
                    // setLessons(event.collisions)
                  }}
                />
              </div>
            </div>
          )}
        </ModalContent>
      </Modal> */}
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
      <Modal
        isOpen={editLessonContent}
        size="4xl"
        closeButton={<></>}
        backdrop="blur"
        scrollBehavior="inside"
        className={`h-full`}
        classNames={{
          backdrop: `bg-backdrop`,
        }}
      >
        <ModalContent className={`h-full`}>
          {() => (
            <div className="p-app h-full flex flex-col">
              <div className={`flex`}>
                <div className="flex-1"></div>
                <div className="flex-1 text-3xl font-semibold font-IBM-Thai text-center">
                  แก้ไขเนื้อหา
                </div>
                <div
                  onClick={() => handleOnCloseEditLessonVideo()}
                  className="cursor-pointer flex-1 flex justify-end items-center"
                >
                  <X size={32} />
                </div>
              </div>
              <div className={`mt-3 grid grid-cols-2 h-full`}>
                <div className={`pr-3 flex flex-col h-full`}>
                  <Autocomplete
                    // className="max-w-xs"
                    placeholder={`Playlist`}
                    startContent={<Search className={`text-foreground-400`} />}
                    aria-labelledby="playlist"
                    onSelectionChange={(key) => onChangePlayList(key)}
                    // filterOptions={}
                    // statr with
                  >
                    {playList ? (
                      playList.map((playList) => (
                        <AutocompleteItem
                          aria-labelledby={`playlist${playList.id}`}
                          key={playList.id}
                          value={playList.id}
                        >
                          {playList.name}
                        </AutocompleteItem>
                      ))
                    ) : (
                      <AutocompleteItem key={"loading"} value={"loading"}>
                        loading...
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                  <div className={`mt-2 h-full relative overflow-auto`}>
                    <div className={`absolute inset-0`}>
                      {videoList.map((video: any, index) => {
                        return (
                          <div
                            key={`videoList${index}`}
                            className={`odd:bg-white even:bg-content2 flex items-center`}
                          >
                            <div>
                              <Checkbox
                                color="default"
                                onValueChange={(isSelected) => {
                                  handleOnSelecteVideo(video, isSelected);
                                }}
                              ></Checkbox>
                            </div>
                            <div className={`flex-1`}>
                              <div
                                className={`text-foreground-400 text-xs font-medium font-IBM-Thai-Looped`}
                              >
                                {selectedVideoPlaylist.name}
                              </div>
                              <div className={`flex items-center gap-1`}>
                                <VideoLucide size={16} />
                                <div
                                  className={`text-base text-default-foreground font-IBM-Thai-Looped`}
                                >
                                  {video.name}
                                </div>
                              </div>
                            </div>
                            <div
                              className={`text-foreground-400 font-IBM-Thai-Looped text-sm`}
                            >
                              {video.hour_length * 60 + video.minute_length}{" "}
                              นาที
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className={`pl-3 space-y-1`}>
                  {videoListInLesson.map((videoInLesson, index) => {
                    return (
                      <div
                        key={`videoLesson${index}`}
                        className={`font-IBM-Thai-Looped flex items-center p-2 border-2 border-default-foreground rounded-lg`}
                      >
                        <div className={`flex-1`}>
                          <div className={`text-foreground-400 text-xs`}>
                            {videoInLesson.playlistName}
                          </div>
                          <div className={`flex items-center gap-1`}>
                            <VideoLucide size={16} />
                            <div>{videoInLesson.name}</div>
                          </div>
                        </div>
                        <div className={`text-sm text-foreground-400`}>
                          {videoInLesson.hour * 60 + videoInLesson.minute} นาที
                        </div>
                        <div
                          className={`bg-white w-8 h-8 flex items-center justify-center cursor-pointer`}
                          onClick={() => {
                            handleDeleteVideo(videoInLesson, index);
                          }}
                        >
                          <X />
                        </div>
                        {/* {JSON.stringify(videoInLesson)} */}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
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
              {lesson.CourseVideo.map((courseVideo: any, index: number) => {
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
                  onClick={() => setIsSort(true)}
                  className="bg-default-100 font-IBM-Thai font-medium"
                  startContent={<ArrowDownUp size={20} />}
                >
                  จัดเรียง
                </Button>
                <Button
                  className="bg-default-100 font-IBM-Thai font-medium"
                  startContent={<VideoLucide size={20} />}
                  onClick={() => {
                    setSelectedLesson(lesson);
                    setEditLessonContent(true);
                    setVideoListInLesson(lesson.CourseVideo)
                  }}
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
