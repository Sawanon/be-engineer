import { CourseVideo } from "@prisma/client"

export type VideoPlaylist = {
  [K in keyof CourseVideo]?: CourseVideo[K]
} & {
  action: "create" | "remove" | "inDB" | "removeInDB"
}

export type VideoWebapp = {
  id: number
  name: string
  link: string
  minute_length: number
  hour_length: number
  position: number
  public: boolean
  created: string
  last_updated: string
  playlist_id: number
  desc_id: any
  video_library_onlinevideoplaylistmediaitemcontent: any
  playlistName: string
}

export type VideoPlayListInProcess = VideoPlaylist & {
  action: "create" | "remove" | "inDB" | "removeInDB"
}