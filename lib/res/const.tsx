import { ClipboardClose, PlayCircle, TickCircle, Video } from "iconsax-react";

export const courseStatus:{
    [x:string]: {
        name: string,
        icon: JSX.Element,
    },
} = {
    noContent: {
        name: "ไม่มีเนื้อหา",
        icon: <ClipboardClose variant="Bulk" />,
    },
    hasContent: {
        name: "มีเนื้อหา",
        icon: <Video variant="Bulk" />,
    },
    uploadWebapp: {
        name: "ลง Web-app แล้ว",
        icon: <PlayCircle variant="Bulk" />,
    },
    enterForm: {
        name: "ใส่แบบประเมิน",
        icon: <TickCircle variant="Bulk" />,
    },
}
// "ไม่มีเนื้อหา", "มีเนื้อหา", "ลง Web-app แล้ว", "ใส่แบบประเมิน"