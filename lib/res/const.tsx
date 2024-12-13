import { ClipboardClose, PlayCircle, TickCircle, Video } from "iconsax-react";
import { BookOpen, MonitorPlay, Package } from "lucide-react";
import Image from "next/image";
import thaipost from "../../assets/deliver_thaipost.jpg";
import jtIcon from "../../assets/deliver_JT.webp";
import kerryIcon from "../../assets/deliver_kerry.png";
import flashIcon from "../../assets/deliver_flash.jpg";
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

export const deliveryType = {
   flash: {
      logo: (
         <Image
            className="rounded"
            width={24}
            height={24}
            src={flashIcon}
            alt="Picture of the author"
         />
      ),
      url: "https://www.flashexpress.com/tracking/?se=",
      txt : "Flash"
   },
   "j&t": {
      logo: (
         <Image
            className="rounded"
            width={24}
            height={24}
            src={jtIcon}
            alt="Picture of the author"
         />
      ),
      url: "https://www.jtexpress.co.th/index/query/gzquery.html?bills=",
      txt : "J&T"

   },
   kerry: {
      logo: (
         <Image
            className="rounded"
            width={24}
            height={24}
            src={kerryIcon}
            alt="Picture of the author"
         />
      ),
      url: "https://th.kerryexpress.com/en/track/?track=",
      txt : "Kerry"

   },
   thaipost: {
      logo: (
         <Image
            className="rounded"
            width={24}
            height={24}
            src={thaipost}
            alt="Picture of the author"
         />
      ),
      url: "https://track.thailandpost.com/?trackNumber=",
      txt : "ไปรษณีย์ไทย"

   },
};
