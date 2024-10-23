import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import React from 'react'
import { CourseLesson } from '@prisma/client'
import SortItemLesson from './SortItemLesson'

const ColumeLesson = ({
  lessonList
}: {
  lessonList: CourseLesson[]
}) => {
  return (
    <div className='space-y-1'>
        <SortableContext
            items={lessonList}
            strategy={verticalListSortingStrategy}
          >
            {lessonList.map((lesson) => (
                <SortItemLesson
                    id={lesson.id}
                    title={lesson.name!}
                    key={lesson.id}
                />
            ))}
        </SortableContext>
    </div>
  )
}

export default ColumeLesson