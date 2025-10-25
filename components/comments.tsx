"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { submitComment } from "@/app/actions/public"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

type Comment = {
  id: string
  author_name: string
  content: string
  created_at: string
}

export function Comments({ postId, initialComments = [] }: { postId: string; initialComments?: Comment[] }) {
  const [state, formAction] = useActionState(submitComment, { ok: false, message: "" })

  return (
    <section id="comments" className="mt-8">
      <h3 className="mb-3 font-semibold">Comments</h3>
      <div className="space-y-4">
        {initialComments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment.</p>
        ) : (
          initialComments.map((c) => (
            <div key={c.id} className="rounded-md border bg-card p-4">
              <div className="mb-1 text-sm font-medium">{c.author_name}</div>
              <div className="text-sm whitespace-pre-wrap">{c.content}</div>
            </div>
          ))
        )}
      </div>

      <Separator className="my-6" />

      <h4 className="mb-2 font-semibold">Leave a comment</h4>
      <form action={formAction} className="space-y-3 max-w-xl">
        <input type="hidden" name="postId" value={postId} />
        <div className="flex gap-3">
          <input
            name="name"
            placeholder="Your name"
            required
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
          />
          <input
            name="email"
            type="email"
            placeholder="Email (optional)"
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
        <Textarea name="content" required placeholder="Your comment" />
        <SubmitButton />
      </form>

      {state?.ok ? (
        <p className="mt-3 text-sm text-muted-foreground">Comment submitted and pending moderation.</p>
      ) : state?.message ? (
        <p className="mt-3 text-sm text-destructive">{state.message}</p>
      ) : null}
    </section>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      className="inline-flex items-center rounded-md border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
      disabled={pending}
    >
      {pending ? "Submitting..." : "Submit Comment"}
    </button>
  )
}
