import Image from "next/image";
import { Button } from "@nextui-org/button";
import { BookSaved, Box, Box1, VideoPlay } from "iconsax-react";
import { ArrowRight } from "lucide-react";
import { Link } from "@nextui-org/react";
export default function Home() {
   return (
      <div className="p-11 h-screenDevice flex flex-col bg-default-50">
         <div className="flex-1 flex items-center justify-center">
            <div className="flex gap-2 items-center">
               <div className="rounded-full bg-default-200 w-8 h-8">
               </div>
               <div className="text-2xl font-bold font-IBM-Thai">
                  be-engineer
               </div>
            </div>
         </div>
         <div className="space-y-2">
            <Button
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
            </Button>
            <Button
               fullWidth
               className="p-[14px] h-auto bg-primary-foreground rounded-[14px]"
               as={Link}
               href="/course"
            >
               <div className="flex-1 flex gap-2 items-center">
                  <VideoPlay variant="Bulk" size={38} />
                  <div className="text-base font-normal">คอร์สเรียน</div>
               </div>
               <ArrowRight size={24} />
            </Button>
            <Button
               fullWidth
               className="p-[14px] h-auto bg-primary-foreground rounded-[14px]"
               as={Link}
               href="/document"
            >
               <div className="flex-1 flex gap-2 items-center">
                  <BookSaved variant="Bulk" size={38} />
                  <div className="text-base font-normal">เอกสาร/หนังสือ</div>
               </div>
               <ArrowRight size={24} />
            </Button>
         </div>
      </div>
   );
}
