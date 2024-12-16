import CourseComponent from '@/components/Course'
import ManageCourseWrapper from '@/components/Server/ManageCourseWrapper'
import { getTotalCourse, listCourseAction } from '@/lib/actions/course.actions'
import { Modal, ModalContent, Spinner } from '@nextui-org/react'
import { Suspense } from 'react'

// type Props = {
//   searchParams: Record<string, string> | null | undefined
// }

// export const revalidate = 20
// ?drawerCourse=40&mode=tutor
const Course = async (
  props: {
    searchParams: {
      drawerCourse: string,
      mode?: string,
      page?: string,
      search?: string,
      status?: string | string[],
      tutorId?: string,
    }
  }
) => {
  // const showModal = props.searchParams?.modal === "true"
  // const id = props.searchParams?.id
  
  const currentPage = props.searchParams.page ?? "1"
  const searchCourse = props.searchParams.search
  const { status, tutorId } = props.searchParams

  const rowsPerPage = 30
  const totalCourse = await getTotalCourse(
    searchCourse,
    status,
    tutorId ? parseInt(tutorId) : undefined,
  )
  if(totalCourse === undefined || typeof totalCourse === 'string'){
    const errorMessage = typeof totalCourse === 'string' ? totalCourse : `Can't get total course`
    throw Error(errorMessage)
  }
  console.log("🚀 ~ Course ~ totalCourse:", totalCourse)
  const pageSize = Math.ceil(totalCourse / rowsPerPage)
  const courses = await listCourseAction(
    rowsPerPage,
    parseInt(currentPage),
    searchCourse,
    status,
    tutorId ? parseInt(tutorId) : undefined,
  )
  
  return (
    <section>
      <Suspense
        fallback={(
          <div></div>
        )}
      >
        <ManageCourseWrapper
          id={props.searchParams.drawerCourse}
          mode={props.searchParams.mode ?? 'tutor'}
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
          currentPage={parseInt(currentPage)}
          rowsPerPage={rowsPerPage}
          courses={courses}
          pageSize={pageSize}
        />
      </Suspense>
    </section>
  )
}

export default Course