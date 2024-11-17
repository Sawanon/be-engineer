import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const ENDPOINT_BE_ENGINEER_URL = process.env.ENDPOINT_BE_ENGINEER_URL;
const B_API_KEY = process.env.B_API_KEY;
export const revalidate = 60
export const GET = async  (req: NextRequest, res: NextResponse) => {
  try {
    const response = await axios({
      url: `${ENDPOINT_BE_ENGINEER_URL}/api/video-description`,
      method: "GET",
      headers: {
        "B-API-KEY": `${B_API_KEY}`,
      },
    });
    const videoDescriptions = response.data
    if(!Array.isArray(videoDescriptions)){
      return Response.json([])
    }
    const search = req.nextUrl.searchParams.get('search')
    const defaultId = req.nextUrl.searchParams.get('defaultId')
    const defaultDescription = defaultId ? videoDescriptions.find(videoDes => `${videoDes.id}` === defaultId) : {}
    if(search === null || search === ""){
      const defaultVideoDes = videoDescriptions.splice(0, 10)
      if(defaultDescription) defaultVideoDes.push(defaultDescription)
      return Response.json(defaultVideoDes)
    }
    const filteredPlaylist = videoDescriptions.filter((playlist: {name: string}) => playlist.name.toLowerCase().startsWith(search.toLowerCase()))
    if(filteredPlaylist.length > 10) return Response.json(filteredPlaylist.splice(0, 10))
    return Response.json(filteredPlaylist)
  } catch (error) {
    console.error(error);
    return Response.json({
      message: `${error}`,
    },{
      status: 400,
    })
  }
}