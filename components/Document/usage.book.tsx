import { cn } from "@/lib/util";
import Alert from "@/ui/alert";
import {
   Button,
   Input,
   Modal,
   ModalBody,
   ModalContent,
   Popover,
   PopoverContent,
   PopoverTrigger,
   Select,
   SelectItem,
   Textarea,
   Image as NextUiImage,
   Tab,
   Tabs,
   Card,
   CardBody,
   Image,
} from "@nextui-org/react";
import { Danger } from "iconsax-react";
import {

   LuArrowUpRight,

   LuX,
} from "react-icons/lu";

import thaipost from "../../assets/thaipost.png";
import BulletPoint from "@/ui/bullet_point";
import { DocumentBook } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getCourseUsageBook } from "@/lib/actions/book.actions";
import Link from "next/link";

const BookUsage = ({
   open,
   onClose,
   book,
   courseList,
}:{
   open: boolean,
   onClose: () => void,
   book?: DocumentBook,
   courseList: any[],
}) => {
   
   return (
      <Modal
         isOpen={open}
         classNames={{
            base: "top-0 p-0 m-0 absolute md:relative w-screen   md:w-[428px] bg-white m-0  max-w-full ",
            backdrop: 'bg-backdrop',
         }}
         backdrop="blur"
         onClose={() => {}}
         scrollBehavior={"inside"}
         closeButton={<></>}
      >
         <ModalContent>
            <ModalBody className={cn("p-0 flex-1 ")}>
               <div className="flex flex-col pb-4 ">
                  <div className=" flex flex-col rounded-xl    bg-white flex-1 px-4 space-y-2">
                     <div className="flex gap-1  my-3  ">
                        <div className="flex  gap-2 w-4/5">
                           <Image
                              width={36}
                              height={52}
                              alt="NextUI hero Image"
                              className={`rounded-lg`}
                              // src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
                              src={`${book?.image}`}
                           />
                           <div className="flex flex-1 items-center">
                              <p className="text-lg font-semibold font-sans">
                                 {/* หนังสือ Dynamics midterm vol.1 - 2/2566{" "} */}
                                 {book?.name}{" "}
                              </p>
                              <div className="flex-1 whitespace-nowrap "></div>
                           </div>
                        </div>

                        <Button
                           variant="flat"
                           isIconOnly
                           className="bg-transparent text-black absolute right-1 top-1"
                           onClick={onClose}
                        >
                           <LuX size={24} />
                        </Button>
                     </div>

                     <div className="col-span-2 flex flex-col gap-2">
                        <p className="text-[#71717A] font-bold text-lg font-serif">
                           รายการคอร์สที่ใช้งาน
                        </p>
                        <div className="ml-4   ">
                           {courseList?.map((course, index) => {
                              const mode = course.status === "noContent" ? `tutor` : `admin`
                              const link = `/course?drawerCourse=${course.id}&mode=${mode}`
                              return (
                                 <Link
                                    target="_blank"
                                    key={`courseUsage${index}`}
                                    // href={`/course?drawerCourse=${course.id}`}
                                    href={link}
                                 >
                                    <div className="flex items-center font-serif">
                                       <BulletPoint />
                                       <p>{course.name}</p>
                                       <LuArrowUpRight className="self-start" />
                                    </div>
                                 </Link>
                              )
                           })}
                           {/* <div className="flex items-center">
                              <BulletPoint />
                              <p> Dynamics midterm 2/2565</p>
                              <LuArrowUpRight className="self-start" />
                           </div>
                           <div className="flex items-center">
                              <BulletPoint />
                              <p> Dynamics (CU) midterm</p>
                              <LuArrowUpRight className="self-start" />
                           </div> */}
                        </div>
                     </div>
                  </div>
               </div>
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

export default BookUsage;
