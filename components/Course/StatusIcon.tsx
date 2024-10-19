import { ClipboardClose, PlayCircle, TickCircle, Video } from 'iconsax-react';
import React from 'react'

const StatusIcon = ({
  status
}:{
  status: "noContent" | "hasContent" | "uploadWebapp" | "enterForm" | string;
}) => {
  switch (status) {
    case "noContent":
      return <ClipboardClose className={`text-danger-500`} size={20} variant="Bold" />
    case "hasContent":
      return <Video className={`text-warning-500`} size={20} variant="Bold" />
    case "uploadWebapp":
      return <PlayCircle className={`text-success-500`} size={20} variant="Bold" />
    case "enterForm":
      return <TickCircle className={`text-primary-500`} size={20} variant="Bold" />
    default:
      return <></>;
  }
}

export default StatusIcon