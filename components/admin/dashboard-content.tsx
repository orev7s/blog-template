import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getOverview } from "@/app/actions/posts"
import { FileText, MessageSquare, Eye } from "lucide-react"

export async function DashboardContent() {
  const res = await getOverview()
  if (!res.success) {
    return (
      <div className="rounded-md border bg-card p-4 text-sm text-destructive-foreground">
        Failed to load overview. Please try again later.
      </div>
    )
  }
  const totals = res.data.totals
  const activity = res.data.activity
  
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.posts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{totals.comments}</div>
              {totals.pendingComments > 0 && (
                <Badge variant="secondary">{totals.pendingComments} pending</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.views}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-xl font-semibold font-serif">Recent Activity</h2>
        <div className="rounded-md border bg-card">
          <ul className="divide-y">
            {activity.length === 0 && (
              <li className="p-4 text-sm text-muted-foreground">No recent activity.</li>
            )}
            {activity.map((item) => (
              <li key={item.id} className="flex items-center justify-between p-4">
                <div className="truncate pr-4">
                  {item.type === "post" ? (
                    <span>
                      <span className="font-medium">New post:</span> {item.title}
                    </span>
                  ) : (
                    <span>
                      <span className="font-medium">New comment:</span> {item.content}
                    </span>
                  )}
                </div>
                <time className="text-sm text-muted-foreground">
                  {new Date(item.created_at).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
