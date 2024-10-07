import { ClipboardClose, PlayCircle, TickCircle, Video } from "iconsax-react";
import { BookOpen, MonitorPlay, Package } from "lucide-react";

export const courseStatus: {
  [x: string]: {
    name: string;
    icon: JSX.Element;
  };
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
};
// "ไม่มีเนื้อหา", "มีเนื้อหา", "ลง Web-app แล้ว", "ใส่แบบประเมิน"

export const menuItems = [
  {
    name: "การจัดส่ง",
    path: "/deliver",
    icon: <Package size={24} />,
  },
  {
    name: "คอร์สเรียน",
    path: "/course",
    icon: <MonitorPlay size={24} />,
  },
  {
    name: "เอกสาร",
    path: "/document",
    icon: <BookOpen size={24} />,
  },
];

export const tableClassnames = {
  wrapper: ["p-0", "shadow-none", "border-1", "rounded-xl"],
  th: [
    "bg-default-100",
    "border-b-1",
    "first:rounded-none",
    "last:rounded-none",
  ],
  td: [
    "first:before:rounded-l-none",
    "rtl:first:before:rounded-r-none",
    "last:before:rounded-r-none",
    "rtl:last:before:rounded-l-none",
  ],
};
