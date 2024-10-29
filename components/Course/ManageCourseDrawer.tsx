"use client"
import React from 'react'
import ManageCourse from '../ManageCourse'
import { getCourseById } from '@/lib/actions/course.actions'
import { listTutor } from '@/lib/actions/tutor.actions'
import { listPlayList } from '@/lib/actions/playlist.actions'
import { useQuery } from '@tanstack/react-query'
import { Modal, ModalContent } from '@nextui-org/react'
import CustomDrawer from '../Drawer'

const ManageCourseDrawer = ({
  courseId
}:{
  courseId: number,
}) => {
  // const selectedCourse = await getCourseById(courseId)
  const {data: selectedCourse} = useQuery({
    queryKey: ["getCourseByid", courseId],
    queryFn: () => getCourseById(courseId),
  })
  console.log(selectedCourse);
  

  const { data: tutorList } = useQuery({
      queryKey: ["listTutor"],
      queryFn: () => listTutor(),
  });

  const { data: playList } = useQuery({
      queryKey: ["listPlayList"],
      queryFn: () => listPlayList(),
  });

  const handleOnDelte = async () => {

  }

  const handleOnClose = async () => {

  }

  const handleOnFetch = async () => {

  }

  const handleOnConfirmAdd = async () => {

  }
  return (
    <div>
      {(selectedCourse && typeof selectedCourse !== "string") &&
        // <CustomDrawer isOpen={true} onOpenChange={(open) => {}}>
        //     {JSON.stringify(selectedCourse.name)}
        //   {/* <ModalContent>
        //   </ModalContent> */}
        // </CustomDrawer>
        <ManageCourse
          isOpenDrawer={true}
          selectedCourse={selectedCourse}
          onDeleteCourse={handleOnDelte}
          // onClose={handleCloseManageCourse}
          onClose={handleOnClose}
          onFetch={handleOnFetch}
          onConfirmAdd={handleOnConfirmAdd}
          tutorList={tutorList}
          playList={playList}
        />
      }
    </div>
  )
}

export default ManageCourseDrawer