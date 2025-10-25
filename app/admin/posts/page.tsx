import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PostsContent } from "@/components/admin/posts-content"

function PostsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-32 rounded-lg border bg-card animate-pulse" />
      <div className="h-96 rounded-lg border bg-card animate-pulse" />
    </div>
  )
}

export default async function PostsManagementPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const category = (params?.category as string | undefined) as
    | "fixes"
    | "thoughts"
    | "general"
    | undefined
  const status = (params?.status as string | undefined) as
    | "published"
    | "draft"
    | undefined

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif">Posts</h1>
        <Link href="/admin/posts/new">
          <Button>New Post</Button>
        </Link>
      </div>

      <Suspense fallback={<PostsSkeleton />}>
        <PostsContent category={category} status={status} />
      </Suspense>
    </div>
  )
}
