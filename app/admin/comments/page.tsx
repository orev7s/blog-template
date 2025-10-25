import { Suspense } from "react"
import { CommentsContent } from "@/components/admin/comments-content"

function CommentsSkeleton() {
  return <div className="h-96 rounded-lg border bg-card animate-pulse" />
}

export default function CommentsModerationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-serif">Comments</h1>
      <Suspense fallback={<CommentsSkeleton />}>
        <CommentsContent />
      </Suspense>
    </div>
  )
}
