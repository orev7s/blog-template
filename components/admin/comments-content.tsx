import { approveComment, deleteComment, getComments } from "@/app/actions/comments"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ApproveButton, DeleteCommentButton } from "@/components/admin/comment-actions"

export async function CommentsContent() {
  const res = await getComments()
  if (!res.success) {
    return (
      <div className="rounded-md border bg-card p-4 text-sm text-destructive-foreground">
        Failed to load comments. Please try again later.
      </div>
    )
  }
  const { data } = res
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">All Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.length === 0 ? (
          <div className="text-sm text-muted-foreground">No comments yet.</div>
        ) : (
          <ul className="space-y-3">
            {data.map((c) => (
              <li
                key={c.id}
                className={
                  "rounded-md border p-4 " + (!c.approved ? "bg-accent/10" : "bg-card")
                }
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {!c.approved && <Badge variant="secondary">Pending</Badge>}
                    <div className="text-sm text-muted-foreground">
                      on <span className="font-medium">{c.posts?.title ?? "Unknown Post"}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(c.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="mt-2 text-sm">{c.content}</div>
                <div className="mt-3 flex gap-2">
                  <form
                    action={async () => {
                      "use server"
                      await approveComment(c.id)
                    }}
                  >
                    <ApproveButton disabled={c.approved} />
                  </form>
                  <form
                    action={async () => {
                      "use server"
                      await deleteComment(c.id)
                    }}
                  >
                    <DeleteCommentButton />
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
