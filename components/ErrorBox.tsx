import { Danger } from 'iconsax-react'
import React from 'react'

const ErrorBox = ({
  message
}:{
  message: string
}) => {
  return (
    <div className="rounded-lg bg-danger-50 text-danger-500 border-l-4 border-danger-500 flex items-center gap-2 py-2 px-[14px]">
      <Danger variant="Bold" />
      <div className="font-IBM-Thai-Looped font-normal">
        {message}
      </div>
    </div>
  )
}

export default ErrorBox