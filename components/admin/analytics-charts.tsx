"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts"

interface AnalyticsChartsProps {
  viewsOverTime: Array<{ date: string; views: number }>
  topPostsByViews: Array<{ title: string; views: number }>
  reactionsPerPost: Array<{ title: string; likes: number; dislikes: number }>
}

export function AnalyticsCharts({ viewsOverTime, topPostsByViews, reactionsPerPost }: AnalyticsChartsProps) {
  return (
    <Tabs defaultValue="views" className="w-full">
      <TabsList>
        <TabsTrigger value="views">Views Over Time</TabsTrigger>
        <TabsTrigger value="top">Top Posts</TabsTrigger>
        <TabsTrigger value="reactions">Reactions</TabsTrigger>
      </TabsList>

      <TabsContent value="views">
        <Card>
          <CardHeader>
            <CardTitle>Post Views (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={viewsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="top">
        <Card>
          <CardHeader>
            <CardTitle>Top Posts by Views</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPostsByViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reactions">
        <Card>
          <CardHeader>
            <CardTitle>Likes vs Dislikes per Post</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reactionsPerPost}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="likes" fill="hsl(142 76% 36%)" name="Likes" />
                <Bar dataKey="dislikes" fill="hsl(0 84% 60%)" name="Dislikes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
