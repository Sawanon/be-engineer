"use server";
import axios from "axios";
import { PlayList } from "../model/playlist";
import { VideoWebapp } from "../model/videoPlaylist";

const ENDPOINT_BE_ENGINEER_URL = process.env.ENDPOINT_BE_ENGINEER_URL;
const B_API_KEY = process.env.B_API_KEY;

export const listPlayList = async (): Promise<PlayList[] | undefined> => {
  try {
    const response = await axios({
      url: `${ENDPOINT_BE_ENGINEER_URL}/api/playlist`,
      method: "GET",
      headers: {
        "B-API-KEY": `${B_API_KEY}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getDetailPlayList = async (
  playlistId: string
): Promise<
  | { name: string; video_library_onlinevideoplaylistmediaitem: VideoWebapp[] }
  | undefined
> => {
  try {
    const response = await axios({
      url: `${ENDPOINT_BE_ENGINEER_URL}/api/playlist/${playlistId}`,
      method: "GET",
      headers: {
        "B-API-KEY": `${B_API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
