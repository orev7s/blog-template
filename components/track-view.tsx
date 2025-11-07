"use client"

import { useEffect, startTransition, useActionState, useCallback } from "react"
import { trackViewAction } from "@/app/actions/public"
import { useSessionId } from "@/lib/session"

export function TrackView({ postId }: { postId: string }) {
  const [_, action] = useActionState(trackViewAction, { ok: false })
  const sessionId = useSessionId()
  
  // Memoize the tracking function to prevent unnecessary re-renders
  const trackView = useCallback(() => {
    if (!postId || !sessionId) return
    const fd = new FormData()
    fd.set("postId", postId)
    fd.set("sessionId", sessionId)
    startTransition(() => {
      action(fd)
    })
  }, [postId, sessionId, action])
  
  useEffect(() => {
    trackView()
  }, [trackView])
  
  return null
}
