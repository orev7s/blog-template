import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Category = "fixes" | "thoughts" | "general"

export type PostCardData = {
  id: string
  title: string
  slug: string
  category: Category
  created_at: string
  excerpt?: string
  views?: number
}

const categoryStyles: Record<Category, { label: string; className: string }> = {
  fixes: { label: "Fixes", className: "bg-emerald-600/90 text-white" },
  thoughts: { label: "Thoughts", className: "bg-indigo-600/90 text-white" },
  general: { label: "General", className: "bg-amber-600/90 text-white" },
}

export function PostCard({ post }: { post: PostCardData }) {
  const cat = categoryStyles[post.category]

  const date = new Date(post.created_at)
  const dateStr = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <Link
      href={`/posts/${post.slug}`}
      prefetch={true}
      className={cn(
        "group block rounded-lg border bg-card p-5 transition-colors hover:bg-secondary"
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <Badge className={cn("capitalize", cat.className)}>{cat.label}</Badge>
        <span className="text-xs text-muted-foreground">{post.views ?? 0} views</span>
      </div>
      <h3 className="font-georgia text-xl leading-snug group-hover:underline">
        {post.title}
      </h3>
      {post.excerpt ? (
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
      ) : null}
      <div className="mt-4 text-xs text-muted-foreground">{dateStr}</div>
    </Link>
  )
}
