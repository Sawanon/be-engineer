import CourseComponent from '@/components/Course'
import { Spinner } from '@nextui-org/react'
import { Suspense } from 'react'

// type Props = {
//   searchParams: Record<string, string> | null | undefined
// }

// export const revalidate = 20

const Course =  () => {
  // const showModal = props.searchParams?.modal === "true"
  // const id = props.searchParams?.id
  // const courses = await listCourseAction()
  return (
    <section>
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
          // courses={courses}
        />
      </Suspense>
    </section>
  )
}

export default Course