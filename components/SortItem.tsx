import { useSortable } from '@dnd-kit/sortable'
import React from 'react'
import {CSS} from '@dnd-kit/utilities'
import { Menu } from 'lucide-react'

const SortItemComponent = ({
    id,
    title,
}:{
    id: number
    title: string
}) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id})
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

  return (
    <div
        className={`cursor-move flex gap-2 items-center p-1 bg-primary-foreground rounded`}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
    >
        <div className='text-foreground-400'>
            <Menu size={24} />
        </div>
        <div className='text-base font-normal font-serif'>
            {title}
        </div>
    </div>
  )
}

export default SortItemComponent