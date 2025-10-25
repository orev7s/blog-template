"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function DeletePostButton() {
  const { pending } = useFormStatus()
  return (
    <Button size="sm" variant="destructive" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          Deleting...
        </>
      ) : (
        "Delete"
      )}
    </Button>
  )
}

export function TogglePublishButton({ isPublished }: { isPublished: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button size="sm" variant="secondary" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          {isPublished ? "Unpublishing..." : "Publishing..."}
        </>
      ) : (
        isPublished ? "Unpublish" : "Publish"
      )}
    </Button>
  )
}
