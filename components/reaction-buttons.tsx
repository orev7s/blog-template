"use client"

import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { reactToPostAction } from "@/app/actions/public"
import { useSessionId } from "@/lib/session"
import { ThumbsDown, ThumbsUp, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Reaction = "like" | "dislike" | null

export function ReactionButtons({ postId }: { postId: string }) {
  const sessionId = useSessionId()
  const [stateLike, likeAction] = useActionState(reactToPostAction, { ok: false })
  const [stateDislike, dislikeAction] = useActionState(reactToPostAction, { ok: false })
  
  // Track which reaction is currently selected
  const [selectedReaction, setSelectedReaction] = useState<Reaction>(null)
  const [justClicked, setJustClicked] = useState<Reaction>(null)

  // Update selected reaction when action completes successfully
  useEffect(() => {
    if (stateLike.ok && justClicked === "like") {
      setSelectedReaction("like")
      // Clear the just-clicked state after animation
      setTimeout(() => setJustClicked(null), 600)
    }
  }, [stateLike.ok, justClicked])

  useEffect(() => {
    if (stateDislike.ok && justClicked === "dislike") {
      setSelectedReaction("dislike")
      // Clear the just-clicked state after animation
      setTimeout(() => setJustClicked(null), 600)
    }
  }, [stateDislike.ok, justClicked])

  return (
    <div className="flex items-center gap-2">
      <form 
        action={likeAction}
        onSubmit={() => setJustClicked("like")}
      >
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="sessionId" value={sessionId} />
        <input type="hidden" name="reaction" value="like" />
        <LikeButton 
          isActive={selectedReaction === "like"} 
          showSuccess={justClicked === "like" && stateLike.ok}
        />
      </form>

      <form 
        action={dislikeAction}
        onSubmit={() => setJustClicked("dislike")}
      >
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="sessionId" value={sessionId} />
        <input type="hidden" name="reaction" value="dislike" />
        <DislikeButton 
          isActive={selectedReaction === "dislike"} 
          showSuccess={justClicked === "dislike" && stateDislike.ok}
        />
      </form>
    </div>
  )
}

function LikeButton({ isActive, showSuccess }: { isActive: boolean; showSuccess: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      className={cn(
        "group relative inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium",
        "transition-all duration-200 ease-out",
        "hover:scale-105 active:scale-95",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        isActive
          ? "bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300 shadow-sm"
          : "bg-secondary border-border hover:bg-accent hover:border-accent-foreground/20",
        showSuccess && "animate-bounce"
      )}
      aria-label="Like"
      title="Like"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="transition-colors duration-200">Liking...</span>
        </>
      ) : (
        <>
          <ThumbsUp 
            className={cn(
              "h-4 w-4 transition-all duration-200",
              "group-hover:scale-110 group-active:scale-90",
              isActive ? "fill-emerald-600 dark:fill-emerald-400" : ""
            )} 
          />
          <span className="transition-colors duration-200">Like</span>
        </>
      )}
    </button>
  )
}

function DislikeButton({ isActive, showSuccess }: { isActive: boolean; showSuccess: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      className={cn(
        "group relative inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium",
        "transition-all duration-200 ease-out",
        "hover:scale-105 active:scale-95",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        isActive
          ? "bg-rose-100 border-rose-300 text-rose-700 dark:bg-rose-900/30 dark:border-rose-700 dark:text-rose-300 shadow-sm"
          : "bg-secondary border-border hover:bg-accent hover:border-accent-foreground/20",
        showSuccess && "animate-bounce"
      )}
      aria-label="Dislike"
      title="Dislike"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="transition-colors duration-200">Disliking...</span>
        </>
      ) : (
        <>
          <ThumbsDown 
            className={cn(
              "h-4 w-4 transition-all duration-200",
              "group-hover:scale-110 group-active:scale-90",
              isActive ? "fill-rose-600 dark:fill-rose-400" : ""
            )} 
          />
          <span className="transition-colors duration-200">Dislike</span>
        </>
      )}
    </button>
  )
}
