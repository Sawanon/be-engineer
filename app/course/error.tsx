'use client' // Error boundaries must be Client Components
 
import { Button } from '@nextui-org/react'
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className={`p-4 h-screenDevice flex flex-col font-sans`}>
      <div className={`text-3xl font-bold`}>
        Something went wrong!
      </div>
      <div className={`mt-10`}>
        Error message
      </div>
      <div className={`mt-2`}>
        {error.message}
      </div>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className={`bg-default-foreground text-primary-foreground font-medium text-base mt-10 w-max min-w-40`}
      >
        Try again
      </Button>
    </div>
  )
}