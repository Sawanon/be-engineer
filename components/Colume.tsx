import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import React from 'react'
import SortItemComponent from './SortItem'
import { CourseVideo } from '@prisma/client'

const Colume = ({
    courseVideoList
}: {
    courseVideoList: CourseVideo[]
}) => {
  return (
    <div className='space-y-1'>
        <SortableContext
            items={courseVideoList}
            strategy={verticalListSortingStrategy}
          >
            {courseVideoList.map((video) => (
                <SortItemComponent
                id={video.id}
                title={video.name!}
                key={video.id}
            />
                // <div key={task.id}>
                //     {task.title}
                // </div>
            ))}
        </SortableContext>
    </div>
  )
}

export default Colume