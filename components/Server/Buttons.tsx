"use client"
import { revalidateCourse } from "@/lib/actions/course.actions"
import { Button } from "@nextui-org/react"
import { revalidatePath } from "next/cache"

const Buttons = () => {
  return (
    <Button
      onClick={() => {
        revalidateCourse()
      }}
    >
      revalidates
    </Button>
  )
}

export default Buttons