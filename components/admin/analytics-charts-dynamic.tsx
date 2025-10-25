"use client"

import dynamic from "next/dynamic"
import { Card, CardContent } from "@/components/ui/card"

// Lazy load the heavy recharts component
const AnalyticsCharts = dynamic(
  () => import("./analytics-charts").then((mod) => ({ default: mod.AnalyticsCharts })),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="flex h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading charts...</p>
          </div>
        </CardContent>
      </Card>
    ),
  }
)

interface AnalyticsChartsDynamicProps {
  viewsOverTime: Array<{ date: string; views: number }>
  topPostsByViews: Array<{ title: string; views: number }>
  reactionsPerPost: Array<{ title: string; likes: number; dislikes: number }>
}

export function AnalyticsChartsDynamic(props: AnalyticsChartsDynamicProps) {
  return <AnalyticsCharts {...props} />
}
