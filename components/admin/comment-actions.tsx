"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function ApproveButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button size="sm" variant="secondary" disabled={disabled || pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          Approving...
        </>
      ) : (
        "Approve"
      )}
    </Button>
  )
}

export function DeleteCommentButton() {
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
