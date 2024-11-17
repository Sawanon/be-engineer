import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const ENDPOINT_BE_ENGINEER_URL = process.env.ENDPOINT_BE_ENGINEER_URL;
const B_API_KEY = process.env.B_API_KEY;
export const revalidate = 60
export const GET = async  (req: NextRequest, res: NextResponse) => {
  try {
    const response = await axios({
      url: `${ENDPOINT_BE_ENGINEER_URL}/api/playlist`,
      method: "GET",
      headers: {
        "B-API-KEY": `${B_API_KEY}`,
      },
    });
    const playlist = response.data
    if(!Array.isArray(playlist)){
      return Response.json([])
    }
    const search = req.nextUrl.searchParams.get('search')
    console.log("🚀 ~ GET ~ search:", search)
    if(search === null || search === ""){
      return Response.json(playlist.splice(0, 10))
    }
    const filteredPlaylist = playlist.filter((playlist: {name: string}) => playlist.name.toLowerCase().startsWith(search.toLowerCase()))
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