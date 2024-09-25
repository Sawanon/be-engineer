import { closestCorners, DndContext, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import React, { useState } from 'react'
import Colume from './Colume'

const SortableComponent = ({
  lessons,
  onDragEnd,
}:{
  lessons: {
    id: number,
    title: string,
  }[]
  onDragEnd?: (event: DragEndEvent) => void,
}) => {
  // const [lessons, setLesson] = useState([
  //   { id: 1, title: 'Lesson 1' },
  //   { id: 2, title: 'Lesson 2' },
  //   { id: 3, title: 'Lesson 3' },
  //   // Add more lessons here...
  // ])
  return (
    <div>
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={onDragEnd}
      >
        <div className={`bg-default-100 p-1 rounded-md`}>
          <Colume tasks={lessons} />
          {/* {lessons.map((lesson, index) => {
            return (
              <div
                key={lesson.id}
                className='border border-gray-400 p-4 mt-2'
              >
                {lesson.title}
              </div>
            )
          })} */}
        </div>
      </DndContext>
    </div>
  )
}

export default SortableComponent