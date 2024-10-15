"use server";

import { Course, CourseVideo, PrismaClient } from "@prisma/client";
import { VideoPlaylist } from "../model/videoPlaylist";

const prisma = new PrismaClient();

export const deleteCourseVideo = async ({
  id
}:{
  id: number
}) => {
  try {
    const response = await prisma.courseVideo.deleteMany({
      where: {
        id: id, // replace with courseLessonId
      },
    });
    console.log("delete video from course !");
    
    return response
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export const addCourseVideo = async ({
  courseLessonId,
  videoLink,
  hour,
  minute,
  position,
  webappVideoId,
  descriptionId,
  name,
  playlistName,
}:{
  courseLessonId: number
  videoLink: string
  hour: number
  minute: number
  position: number
  webappVideoId: number
  playlistName?: string
  descriptionId?: number | null
  name?: string | null
}) => {
  try {
    const response = await prisma.courseVideo.create({
      data: {
        videoLink: videoLink,
        hour: hour,
        minute: minute,
        position: position,
        lessonId: courseLessonId,
        descriptionId: descriptionId,
        name: name,
        webappVideoId: webappVideoId,
        playlistName: playlistName,
      },
    });
    console.log("add video to course !");
    
    return response
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
};

export const addCourseVideoMany = async (videoList: VideoPlaylist[]) => {
  try {
    const response = await prisma.courseVideo.createMany({
      data: videoList.map(video => {
        return {
          name: video.name,
          lessonId: video.lessonId!,
          hour: video.hour!,
          minute: video.minute!,
          position: video.position!,
          webappVideoId: video.webappVideoId!,
          videoLink: video.videoLink!,
          descriptionId: video.descriptionId,
          playlistName: video.playlistName,
          contentName: video.contentName,
        }
      })
    })
    return response
  } catch (error) {
    console.error(error)
  } finally {
    prisma.$disconnect()
  }
}

export const deleteCourseVideoMany = async (videoIdList: number[]) => {
  try {
    const response = await prisma.courseVideo.deleteMany({
      where: {
        id: {
          in: videoIdList,
        }
      }
    })
    return response
  } catch (error) {
    console.error(error)
  } finally {
    prisma.$disconnect()
  }
}

export const swapPositionVideo = async (firstVideo: CourseVideo, secondVideo: CourseVideo) => {
  try {
    const responseFirstVideo = await prisma.courseVideo.update({
      where: {
        id: firstVideo.id,
      },
      data: {
        position: secondVideo.position,
      }
    })
    const responseSecondVideo = await prisma.courseVideo.update({
      where: {
        id: secondVideo.id,
      },
      data: {
        position: firstVideo.position,
      }
    })
    return [responseFirstVideo, responseSecondVideo]
  } catch (error) {
    console.error(error)
  } finally {
    prisma.$disconnect()
  }
}

export const changePositionVideoAction = async (videoId: number, newPosition: number) => {
  try {
    const response = await prisma.courseVideo.update({
      where: {
        id: videoId,
      },
      data: {
        position: newPosition,
      },
    })
    return response
  } catch (error) {
    console.error(error)
  } finally {
    prisma.$disconnect()
  }
}