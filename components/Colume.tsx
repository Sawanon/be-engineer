import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import React from 'react'
import SortItemComponent from './SortItem'

const Colume = ({
    tasks
}: {
    tasks: {
        id: number,
        title: string,
    }[]
}) => {
  return (
    <div className='space-y-1'>
        <SortableContext
            items={tasks}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task, index) => (
                <SortItemComponent
                id={task.id}
                title={task.title}
                key={task.id}
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