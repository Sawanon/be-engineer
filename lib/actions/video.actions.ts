"use server";

import { PrismaClient } from "@prisma/client";

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
