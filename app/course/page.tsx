import CourseComponent from '@/components/Course'
import ManageCourseWrapper from '@/components/Server/ManageCourseWrapper'
import { listCourseAction } from '@/lib/actions/course.actions'
import { Modal, ModalContent, Spinner } from '@nextui-org/react'
import { Suspense } from 'react'

// type Props = {
//   searchParams: Record<string, string> | null | undefined
// }

// export const revalidate = 20
// ?drawerCourse=40&mode=tutor
const Course = async (props: {searchParams: {drawerCourse: string}}) => {
  // const showModal = props.searchParams?.modal === "true"
  // const id = props.searchParams?.id
  console.log("drawerCourse", props.searchParams.drawerCourse);
  
  const courses = await listCourseAction()
  
  return (
    <section>
      <Suspense
        fallback={(
          <div></div>
        )}
      >
        <ManageCourseWrapper
          id={props.searchParams.drawerCourse}
        />
      </Suspense>
      <Suspense
        fallback={(
          <div className={`absolute inset-0 bg-backdrop flex items-center justify-center`}>
            <Spinner />
          </div>
        )}
      >
        <CourseComponent
          // isOpen={showModal}
          // courseId={id}
          courses={courses}
        />
      </Suspense>
    </section>
  )
}

export default Course