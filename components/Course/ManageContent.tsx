import {
   getDetailPlayList,
} from "@/lib/actions/playlist.actions";
import {
   Autocomplete,
   AutocompleteItem,
   Button,
   Checkbox,
   Divider,
   getKeyValue,
   Modal,
   ModalContent,
   Selection,
   Table,
   TableBody,
   TableCell,
   TableColumn,
   TableHeader,
   TableRow,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { FileText, Search, Video, X } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Key } from "@react-types/shared/src/key";
import { PlayList } from "@/lib/model/playlist";
import {
   VideoPlaylist,
   VideoWebapp,
} from "@/lib/model/videoPlaylist";
import { CourseVideo } from "@prisma/client";
import {
   addCourseVideoMany,
   deleteCourseVideoMany,
} from "@/lib/actions/video.actions";
import { listCourseAction, revalidateCourse } from "@/lib/actions/course.actions";
import axios from "axios";
import {AsyncListData, useAsyncList} from "@react-stately/data";
import _ from 'lodash'

const ManageContent = ({
   isOpen,
   onConfirm,
   onCancel,
   onSuccess,
   lesson,
}: {
   isOpen: boolean;
   onConfirm: () => void;
   onCancel: () => void;
   onSuccess: () => void;
   lesson: any;
}) => {
   const [isLoading, setIsLoading] = useState(false)
   const [videoList, setVideoList] = useState<VideoWebapp[]>([]);
   const [selectedPlaylistId, setSelectedPlaylistId] = useState<Key | null>();
   const [selectedVideoPlaylist, setSelectedVideoPlaylist] = useState({
      name: "",
   });
   const [videoInLesson, setVideoInLesson] = useState<{
      [x: string]: VideoPlaylist;
   }>({});
   const [selectedKeysVideo, setSelectedKeysVideo] = useState<Set<Key>>(new Set([]))

   useMemo(() => {
      if (!lesson?.CourseVideo) return;
      const videoList = lesson.CourseVideo as CourseVideo[];
      const result = videoList.reduce((acc, item) => {
         acc[item.webappVideoId] = { ...item, action: "inDB" };
         return acc;
      }, {} as Record<number, any>);
      setVideoInLesson(result);
      setSelectedKeysVideo(new Set(videoList.map(video => `${video.webappVideoId}`)))
   }, [lesson]);

   const handleOnConfirm = async () => {
      onConfirm();
   };

   const handleOnCancel = async () => {
      onCancel();
      setSelectedKeysVideo(new Set([]))
      // setSelectedPlaylistId(undefined)
      // setVideoList([])
      list.setFilterText('')
   };

   const handleOnChangePlayList = async (playlistId: Key | null) => {
      setSelectedPlaylistId(playlistId);
      if (playlistId == null) return;
      const response = await getDetailPlayList(playlistId?.toString());
      console.log(response);
      if (!response) {
         console.error(`not found video on playlist id: ${playlistId}`);
         return;
      }

      setVideoList(response.video_library_onlinevideoplaylistmediaitem);
      setSelectedVideoPlaylist({
         name: response.name,
      });
   };

   const addVideo = (video: VideoWebapp) => {
      console.log("video", video);
      
      const cloneVideo = { ...videoInLesson };
      const objKeys = Object.keys(cloneVideo)
      const lastPosition = objKeys.sort((a, b) => {
         const prevVideo = videoInLesson[a];
         const nextVideo = videoInLesson[b];
         if(prevVideo.position! < nextVideo.position!){
            return 1
         }else if(prevVideo.position! > nextVideo.position!){
            return -1
         }
         return 0
      }).map((key) => cloneVideo[key])
      
      if (cloneVideo[`${video.id}`] && cloneVideo[`${video.id}`].action !== "create") {
         cloneVideo[`${video.id}`].action = "inDB";
         cloneVideo[`${video.id}`].position = (lastPosition[0]?.position ?? objKeys.length) + 1
         return cloneVideo;
      }
      const contentName =
         video.video_library_onlinevideoplaylistmediaitemcontent
            ? video.video_library_onlinevideoplaylistmediaitemcontent.name
            : null;
      return {
         ...videoInLesson,
         [`${video.id}`]: {
            name: video.name,
            descriptionId: video.desc_id,
            hour: video.hour_length,
            minute: video.minute_length,
            lessonId: lesson.id,
            position: (lastPosition[0]?.position ?? objKeys.length) + 1,
            videoLink: video.link,
            webappVideoId: video.id,
            action: "create",
            playlistName: selectedVideoPlaylist.name,
            contentName: contentName,
         },
      };
   }

   const removeVideo = (video: VideoPlaylist | VideoWebapp, videoInLesson: {[x: string]: VideoPlaylist}) => {
      const videoId = "webappVideoId" in video ? video.webappVideoId : video.id;
      const cloneVideo = _.cloneDeep(videoInLesson)
      if (!cloneVideo[`${videoId}`]) return videoInLesson;
      if (
         cloneVideo[`${videoId}`].action === "inDB" ||
         cloneVideo[`${videoId}`].action === "removeInDB"
      ) {
         cloneVideo[`${videoId}`] = {
            ...cloneVideo[`${videoId}`],
            action: "removeInDB",
         };
         return cloneVideo;
      }
      delete cloneVideo[`${videoId}`];
      return cloneVideo;
   }

   const defaultSelectedVideo = (video: VideoWebapp) => {
      if (!videoInLesson[`${video.id}`]) return false;
      if (videoInLesson[`${video.id}`].action === "removeInDB") return false;
      return true;
   };

   const submitSaveVideoInLesson = async () => {
      try {
         console.log(videoInLesson);
         setIsLoading(true)
         // remove from DB
         const idListRemoveFromDB = Object.keys(videoInLesson)
            .map((key) => videoInLesson[key])
            .filter((video) => video.action === "removeInDB")
            .map((video) => video.id!);
         console.log("removeFromDB", idListRemoveFromDB);
         const responseDelete = await deleteCourseVideoMany(idListRemoveFromDB);
         console.log("responseDelete", responseDelete);
   
         // add to DB
         const addToDB = Object.keys(videoInLesson)
            .map((key) => videoInLesson[key])
            .filter((video) => video.action === "create");
         console.log("addToDB", addToDB);
         if (addToDB.length > 0) {
            const responseAdd = await addCourseVideoMany(addToDB);
            console.log(responseAdd, "responseAdd");
         }
         // onSuccess()
         await revalidateCourse()
         onConfirm();
      } catch (error) {
         console.error(error)
      } finally {
         setIsLoading(false)
      }
   };

   const handleOnSelecteCell = (keys: Selection) => {
      {
         console.log(keys);
         console.log(videoList);
         
         const arrKeys = Array.from(keys)
         const videoInLessonArrKeys = Object.keys(videoInLesson)
         const videoFilterRemove = Object.keys(videoInLesson).map(key => videoInLesson[key]).filter(video => (video.action !== "removeInDB" && video.action !== "remove"))
         
         if(arrKeys.length > videoFilterRemove.length){
            // add
            let arrVideo = {}
            const newKeys = arrKeys.filter(key => !videoFilterRemove.find(video => `${video.webappVideoId!}` === `${key}`))
            newKeys.forEach(key => {
               const video = videoList.find(video => parseInt(video.id.toString()) === parseInt(key.toString()))
               const preAddVideo = addVideo(video!)
               arrVideo = {
                  ...arrVideo,
                  ...preAddVideo,
               }
               return preAddVideo
            })
            setVideoInLesson(arrVideo)
            setSelectedKeysVideo(keys as Set<string>)
         }else{
            // remove
            removeVideoAndKeys(videoInLessonArrKeys, keys as Set<string>)
         }
      }
   }

   const removeVideoAndKeys = (videoInLessonArrKeys: string[], keys: Set<Key>, video?: VideoPlaylist | VideoWebapp) => {
      const arrKeys = Array.from(keys)
      let cloneVideo = _.cloneDeep(videoInLesson)
      const keysSet = new Set(keys)
      if(video){
         const videoId = "webappVideoId" in video ? video.webappVideoId : video.id;
         console.log("keysSet.delete(videoId)", keysSet.delete(`${videoId!}`));
         cloneVideo = removeVideo(video, cloneVideo)
      }else{
         videoInLessonArrKeys.forEach(videoId => {
            const foundKey = arrKeys.find(tableVideoId => tableVideoId.toString() === videoId)
            if(foundKey === undefined){
               const video = videoInLesson[videoId]
               const preRemoveVideo = removeVideo(video, cloneVideo)
               cloneVideo = preRemoveVideo
            }
         })
      }
      setSelectedKeysVideo(keysSet)
      setVideoInLesson(cloneVideo)
   }

   let list:AsyncListData<PlayList> = useAsyncList({
      async load({signal, filterText}) {
         console.log("list", filterText);
         const res = await axios({
            url: `/api/playlist?search=${filterText}`,
            method: 'GET',
            signal,
         })
         return {
            items: res.data as PlayList[],
         };
      },
   });

   return (
      <Modal
         isOpen={isOpen}
         size="4xl"
         closeButton={<></>}
         backdrop="blur"
         scrollBehavior="outside"
         className={`h-full`}
         classNames={{
            backdrop: ['bg-default-foreground/25'],
            base: [
               // 'bg-red-400', 
               'md:min-h-0 min-h-dvh md:max-h-[calc(100dvh-8rem)]',
               'md:min-w-0 min-w-full',
               'm-0'
            ],
         }}
      >
         <ModalContent className={`h-full`}>
            {() => (
               <div className="p-app h-full flex flex-col">
                  <div className={`flex`}>
                     <div className="flex-1"></div>
                     <div className="flex-1 text-3xl font-semibold font-IBM-Thai text-center">
                        เนื้อหา
                     </div>
                     <div
                        onClick={handleOnCancel}
                        className="cursor-pointer flex-1 flex justify-end items-center"
                     >
                        <X size={32} />
                     </div>
                  </div>
                  {/* <div className={`mt-3 grid grid-cols-2 flex-1 overflow-auto`}> */}
                  <div className={`mt-3 gap-3 flex md:flex-row flex-col flex-1 overflow-auto`}>
                     <div className={`flex-1 flex flex-col overflow-auto`}>
                        <Autocomplete
                           placeholder={`Playlist`}
                           startContent={
                              <Search className={`text-foreground-400`} />
                           }
                           aria-labelledby="playlist"
                           className={`font-serif`}
                           inputProps={{
                              "aria-hidden": "true",
                              classNames: {
                                 input: ['text-[1em]']
                              }
                           }}
                           listboxProps={{
                              className: 'font-serif',
                           }}
                           defaultSelectedKey={selectedPlaylistId ?? undefined}
                           // selectedKey={selectedPlaylistId}
                           onSelectionChange={handleOnChangePlayList}
                           inputValue={list.filterText}
                           isLoading={list.isLoading}
                           onInputChange={list.setFilterText}
                           items={list.items}
                        >
                           {(playList) => (
                              <AutocompleteItem
                                 aria-labelledby={`playlist${playList.id}`}
                                 key={playList.id}
                                 value={playList.id}
                                 className={`font-serif`}
                              >
                                 {playList.name}
                              </AutocompleteItem>
                           )}
                        </Autocomplete>
                        <div className={`mt-2 flex-1 relative overflow-auto`}>
                           <Table
                              isStriped
                              aria-label="Controlled table example with dynamic content"
                              selectionMode="multiple"
                              hideHeader
                              // selectedKeys={Object.keys(videoInLesson)}
                              selectedKeys={selectedKeysVideo}
                              selectionBehavior="toggle"
                              // defaultSelectedKeys={Object.keys(videoInLesson)}
                              onSelectionChange={handleOnSelecteCell}
                              className={`shadow-none`}
                              classNames={{
                                 td: ['', 'p-0 m-0'],
                                 wrapper: ['rounded-none', 'shadow-none']
                              }}
                              checkboxesProps={{
                                 className: 'p-0 m-0'
                              }}
                           >
                              <TableHeader>
                                 <TableColumn>label</TableColumn>
                                 <TableColumn>hour</TableColumn>
                              </TableHeader>
                              <TableBody items={videoList}>
                              {(video) => (
                                 <TableRow key={video.id}>
                                    <TableCell>
                                       <div
                                          className={`flex gap-1 text-foreground-400 text-xs font-medium font-IBM-Thai-Looped`}
                                       >
                                          <div className={`w-4 h-4`}></div>
                                          {selectedVideoPlaylist.name}
                                       </div>
                                       <div
                                          className={`flex items-center gap-1`}
                                       >
                                          <Video size={16} />
                                          <div
                                             className={`text-base text-default-foreground font-IBM-Thai-Looped`}
                                          >
                                             {video.name}
                                          </div>
                                       </div>
                                       <div className={`flex items-center gap-1`}>
                                          <FileText className={`text-foreground-400`} size={16} />
                                          <div
                                             className={`text-sm text-foreground-400 font-serif`}
                                          >
                                             {video.video_library_onlinevideoplaylistmediaitemcontent?.name ?? "-"}
                                          </div>
                                       </div>
                                    </TableCell>
                                    <TableCell>
                                       <div
                                          className={`text-foreground-400 font-IBM-Thai-Looped text-sm`}
                                       >
                                          {video.hour_length * 60 +
                                             video.minute_length}{" "}
                                          นาที
                                       </div>
                                    </TableCell>
                                 </TableRow>
                              )}
                              </TableBody>
                           </Table>
                           {/* <div className={`absolute inset-0 hidden`}>
                              {videoList.map((video) => {
                                 return (
                                    <div
                                       key={`videoList${video.id}`}
                                       className={`odd:bg-white even:bg-content2 flex items-center`}
                                    >
                                       <div>
                                          <Checkbox
                                             color="default"
                                             classNames={{
                                                wrapper:
                                                   "after:bg-default-foreground",
                                                icon: "before:bg-red-400 text-white",
                                             }}
                                             // defaultSelected={defaultSelectedVideo(video)}
                                             isSelected={defaultSelectedVideo(
                                                video
                                             )}
                                             onValueChange={(isSelected) => {
                                                handleOnSelectVideo(
                                                   video,
                                                   isSelected
                                                );
                                             }}
                                          ></Checkbox>
                                       </div>
                                       <div className={`flex-1`}>
                                          <div
                                             className={`text-foreground-400 text-xs font-medium font-IBM-Thai-Looped`}
                                          >
                                             {selectedVideoPlaylist.name}
                                          </div>
                                          <div
                                             className={`flex items-center gap-1`}
                                          >
                                             <Video size={16} />
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
                                          {video.hour_length * 60 +
                                             video.minute_length}{" "}
                                          นาที
                                       </div>
                                    </div>
                                 );
                              })}
                           </div> */}
                        </div>
                     </div>
                     <Divider className={`hidden md:block`} orientation="vertical" />
                     <Divider className={`block md:hidden`} />
                     <div className={`flex-1 overflow-auto`}>
                        <div className={`overflow-auto flex flex-col gap-1`}>
                           {Object.keys(videoInLesson).sort((a, b) => {
                              const prevVideo = videoInLesson[a];
                              const nextVideo = videoInLesson[b];
                              if(prevVideo.position! < nextVideo.position!){
                                 return -1
                              }else if(prevVideo.position! > nextVideo.position!){
                                 return 1
                              }
                              return 0
                           }).map((key, index) => {
                              const action = videoInLesson[key].action;
                              const video = videoInLesson[key];
                              return (
                                 <div
                                    key={`videoLesson${index}`}
                                    className={`font-serif bg-default-100 ${
                                       action === "removeInDB" ? `hidden` : `flex gap-1`
                                       // `flex gap-1`
                                    } items-center p-2 border-2 border-default-foreground rounded-lg`}
                                 >
                                    <div className={`text-default-400`}>
                                       <div className={`w-4 h-4`}>
                                          <Video size={16} />
                                       </div>
                                       <div className={`w-4 h-4`}>
                                          {video.contentName &&
                                             <FileText size={16} />
                                          }
                                       </div>
                                    </div>
                                    <div className={`flex-1`}>
                                       <div
                                          className={`text-default-400 text-xs`}
                                       >
                                          {video.playlistName} {video.position}
                                       </div>
                                       <div>{video.name}</div>
                                    </div>
                                    <div className={`text-sm text-default-400`}>
                                       {video.hour! * 60 + video.minute!} นาที
                                    </div>
                                    <div
                                       className={`w-8 h-8 flex items-center justify-center cursor-pointer`}
                                       onClick={() => {
                                          // removeVideoToLesson(videoInLesson[key]);
                                          // handleDeleteVideo(videoInLesson, index);
                                          removeVideoAndKeys(Object.keys(videoInLesson), selectedKeysVideo, video)
                                       }}
                                    >
                                       <X />
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  </div>
                  <Divider className={`md:hidden mt-3`} />
                  <div className={`flex justify-end mt-3`}>
                     <Button
                        onClick={submitSaveVideoInLesson}
                        className={`bg-default-foreground text-base font-medium font-IBM-Thai text-primary-foreground`}
                        isLoading={isLoading}
                     >
                        บันทึก
                     </Button>
                  </div>
               </div>
            )}
         </ModalContent>
      </Modal>
   );
};

export default ManageContent;
