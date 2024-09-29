import Image from "next/image";
import { Button } from "@nextui-org/button";
import { BookSaved, Box, Box1, VideoPlay } from "iconsax-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
export default function Home() {
   return (
      <div className="p-11 h-screenDevice flex flex-col md:justify-center bg-default-50">
         <div className="flex-1 flex md:flex-initial md:h-[243px] items-center justify-center">
            <div className="flex gap-2 items-center">
               <div className="rounded-full bg-default-200 w-8 h-8">
               </div>
               <div className="text-2xl font-bold font-IBM-Thai">
                  be-engineer
               </div>
            </div>
         </div>
         <div className="space-y-2 md:space-y-0 md:flex md:gap-app md:justify-center">
            <div className="md:w-menu-button">
               <Link href={`/deliver`}>
                  <div
                     className={`cursor-pointer hover:shadow-nextui-large transition p-[14px] h-auto bg-primary-foreground rounded-[14px] flex items-center gap-2`}
                  >
                     <div className="flex-1 flex gap-2 items-center">
                        <Box1 variant="Bulk" size={38} />
                        <div className="text-base font-normal">การจัดส่ง</div>
                     </div>
                     <ArrowRight size={24} />
                  </div>
               </Link>
            </div>
            <div className="md:w-menu-button">
               <Link href={`/course`}>
                  <div
                     className={`cursor-pointer hover:shadow-nextui-large transition p-[14px] h-auto bg-primary-foreground rounded-[14px] flex items-center gap-2`}
                  >
                     <div className="flex-1 flex gap-2 items-center">
                        <VideoPlay variant="Bulk" size={38} />
                        <div className="text-base font-normal">คอร์สเรียน</div>
                     </div>
                     <ArrowRight size={24} />
                  </div>
               </Link>
            </div>
            <div className="md:w-menu-button">
               <Link href={`/document`}>
                  <div
                     className={`cursor-pointer hover:shadow-nextui-large transition p-[14px] h-auto bg-primary-foreground rounded-[14px] flex items-center gap-2`}
                  >
                     <div className="flex-1 flex gap-2 items-center">
                        <BookSaved variant="Bulk" size={38} />
                        <div className="text-base font-normal">เอกสาร/หนังสือ</div>
                     </div>
                     <ArrowRight size={24} />
                  </div>
               </Link>
            </div>
         </div>
      </div>
   );
}


{/* <Button
   fullWidth
   className="p-[14px] h-auto bg-primary-foreground rounded-[14px]"
   as={Link}
   href="/deliver"
>
   <div className="flex-1 flex gap-2 items-center">
      <Box1 variant="Bulk" size={38} />
      <div className="text-base font-normal">การจัดส่ง</div>
   </div>
   <ArrowRight size={24} />
</Button> */}