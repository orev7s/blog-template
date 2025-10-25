import { getAnalyticsData } from "@/app/actions/posts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalyticsChartsDynamic } from "@/components/admin/analytics-charts-dynamic"

export async function AnalyticsContent() {
  const res = await getAnalyticsData({ days: 30 })
  if (!res.success) {
    return (
      <div className="rounded-md border bg-card p-4 text-sm text-destructive-foreground">
        Failed to load analytics. Please try again later.
      </div>
    )
  }
  const { viewsOverTime, topPostsByViews, reactionsPerPost, totals } = res.data

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.views}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Likes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.likes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dislikes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.dislikes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.comments}</div>
          </CardContent>
        </Card>
      </div>

      <AnalyticsChartsDynamic
        viewsOverTime={viewsOverTime}
        topPostsByViews={topPostsByViews}
        reactionsPerPost={reactionsPerPost}
      />
    </>
  )
}
