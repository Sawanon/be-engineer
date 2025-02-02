import { cn } from "@/lib/util";
import { Danger, Icon } from "iconsax-react";
import { ReactNode } from "react";

type alertType = "error" | "warning" | "success";

const alertIcon: Record<alertType, ReactNode> = {
   error: <Danger variant="Bold" color="#F31260" />,
   warning: <Danger color="#F31260" />,
   success: <Danger color="#F31260" />,
};

const Alert = ({
   type = "error",
   label = "เกิดข้อผิดพลาดบางอย่าง ดูเพิ่มเติมใน Console",
   icon,
}: {
   type?: "error" | "warning" | "success";
   label?: string;
   icon?: ReactNode | false;
}) => {
   const checkIcon = icon ? icon : alertIcon[type];
   return (
      <div className={cn("bg-danger-400 mb-3  pl-1 rounded-l-md rounded-r-lg  md:text-base text-xs")}>
         <div className="pl-4 flex gap-2 text-danger-400 bg-danger-50 py-1 items-center rounded font-serif">
            {icon !== false && checkIcon} 
            <p className="mt-1">

            {label}
            </p>
         </div>
      </div>
   );
};

export default Alert;
