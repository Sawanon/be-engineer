import CourseComponent from '@/components/Course'
import ManageCourseDrawer from '@/components/Course/ManageCourseDrawer'
import React, { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listCourseAction } from '@/lib/actions/course.actions'

export type Props = {
  searchParams: Record<string, string> | null | undefined
}

export const revalidate = 20

const Course = async (props: Props) => {
  // const showModal = props.searchParams?.modal === "true"
  // const id = props.searchParams?.id
  // const courses = await listCourseAction()
  return (
    <div>
      <CourseComponent
        // isOpen={showModal}
        // courseId={id}
        // courses={courses}
      />
    </div>
  )
}

export default Course