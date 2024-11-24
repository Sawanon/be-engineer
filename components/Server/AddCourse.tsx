"use client"
import {
  revalidateCourse,
} from "@/lib/actions/course.actions";
import React from "react";
import CustomDrawer from "@/components/Drawer";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { Button } from "@nextui-org/react";
import ManageLesson from "@/components/ManageLesson";
import AddCourseForm from "@/components/Course/AddCourseForm";
import { useRouter } from "next/navigation";

const AddCourse = () => {
  const route = useRouter()

  const handleClose = () => {
    route.back()
  };

  const handleOnAddSuccess = async (courseId: number) => {
    route.replace(`/course?drawerCourse=${courseId}`)
    // await revalidateCourse()
  }

  return (
    <CustomDrawer
      isOpen={true}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      {/* <div className="block md:flex h-full w-auto overflow-auto"> */}
      <div className="block md:flex w-auto overflow-auto md:h-full">
        <div className="min-w-[342px] md:w-[342px] p-[14px]">
          {/* TODO: add course */}
          <div className="flex justify-between">
            <Button onClick={handleClose} className="bg-default-100" isIconOnly>
              <ArrowLeft size={24} />
            </Button>
            <Button
              className="bg-default-100 font-IBM-Thai"
              endContent={<RefreshCcw size={20} />}
              // onClick={handleSwitchMode}
            >
              แอดมิน
            </Button>
          </div>
          <AddCourseForm
            onConfirm={handleOnAddSuccess}
          />
        </div>
        {/* lesson */}
        <ManageLesson
          courseId={0}
          lessons={undefined}
          className=""
          onFetch={async () => {
            // if (onFetch) {
            //   await onFetch();
            // }
          }}
          mode={'tutor'}
        />
      </div>
    </CustomDrawer>
  );
};

export default AddCourse;