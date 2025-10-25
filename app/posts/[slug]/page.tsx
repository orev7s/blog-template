import { Suspense } from "react"
import { getApprovedComments, getPostBySlug, getPostViewsCount } from "@/app/actions/public"
import { Comments } from "@/components/comments"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { ReactionButtons } from "@/components/reaction-buttons"
import { TrackView } from "@/components/track-view"
import { headers } from "next/headers"
import PostContentRenderer from "@/components/editor/post-content-renderer"

// AGGRESSIVE caching - revalidate every 10 seconds for near-instant updates
export const revalidate = 10

// Enable static generation at build time for ALL published posts
export async function generateStaticParams() {
  try {
    const supabase = await (await import("@/lib/supabase/server")).createClient()
    const { data } = await supabase
      .from("posts")
      .select("slug")
      .eq("published", true)
      .limit(50) // Generate top 50 posts at build time
    
    return (data || []).map((post) => ({
      slug: post.slug,
    }))
  } catch {
    return []
  }
}

// Add cache control headers for CDN caching
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  return {
    title: post.title,
    description: post.title,
    openGraph: {
      title: post.title,
      description: post.title,
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Fetch post data (will be cached by React)
  const post = await getPostBySlug(slug)

  const date = new Date(post.created_at)
  const dateStr = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <TrackView postId={post.id} />

      <div className="mb-6 flex items-center justify-between gap-3">
        <Badge className={cn("capitalize", categoryColor(post.category))}>{label(post.category)}</Badge>
        <Suspense fallback={<span className="text-xs text-muted-foreground">...</span>}>
          <ViewCount postId={post.id} />
        </Suspense>
      </div>

      <h1 className="font-georgia text-3xl leading-tight md:text-4xl">{post.title}</h1>
      <div className="mt-2 text-sm text-muted-foreground">{dateStr}</div>

      <Separator className="my-6" />

      <article className="prose prose-neutral max-w-none dark:prose-invert prose-img:rounded-lg prose-headings:scroll-mt-20 break-words">
        <PostContent content={post.content} />
      </article>

      <div className="mt-8 flex items-center gap-3"><ReactionButtons postId={post.id} /></div>

      <Suspense fallback={<CommentsLoading />}>
        <CommentsWrapper postId={post.id} />
      </Suspense>
    </main>
  )
}

function label(cat: string) {
  switch (cat) {
    case "fixes":
      return "Fixes"
    case "thoughts":
      return "Thoughts"
    default:
      return "General"
  }
}

function categoryColor(cat: string) {
  switch (cat) {
    case "fixes":
      return "bg-emerald-600/90 text-white"
    case "thoughts":
      return "bg-indigo-600/90 text-white"
    default:
      return "bg-amber-600/90 text-white"
  }
}

function PostContent({ content }: { content: any }) {
  // Handle new format with JSON: { json: {...}, html: "..." }
  // Use JSON for proper article mention rendering
  if (content && typeof content === "object" && content.json) {
    return <PostContentRenderer content={content.json} />
  }
  
  // Handle Tiptap JSON format (direct JSON, no wrapper)
  if (content && typeof content === "object" && content.type === "doc") {
    return <PostContentRenderer content={content} />
  }
  
  // Handle HTML-only format (legacy, no article mentions)
  if (content && typeof content === "object" && content.html) {
    return <div dangerouslySetInnerHTML={{ __html: content.html }} />
  }
  
  // Handle string content (legacy)
  if (typeof content === "string") {
    const isHtml = /<\w+[^>]*>/.test(content)
    if (isHtml) {
      return <div dangerouslySetInnerHTML={{ __html: content }} />
    }
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
    )
  }
  
  // Handle object with markdown (legacy)
  if (content && typeof content === "object") {
    if (typeof content.markdown === "string") {
      return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {content.markdown}
        </ReactMarkdown>
      )
    }
  }
  
  // Fallback
  return <pre className="rounded-md bg-secondary p-3 text-xs overflow-auto">{JSON.stringify(content, null, 2)}</pre>
}

// Async component for view count - loads independently
async function ViewCount({ postId }: { postId: string }) {
  const views = await getPostViewsCount(postId)
  return <span className="text-xs text-muted-foreground">{views} views</span>
}

// Async component for comments - loads independently
async function CommentsWrapper({ postId }: { postId: string }) {
  const comments = await getApprovedComments(postId)
  return <Comments postId={postId} initialComments={comments} />
}

// Loading skeleton for comments
function CommentsLoading() {
  return (
    <section className="mt-8">
      <div className="mb-3 h-6 w-28 animate-pulse rounded-md bg-muted" />
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-md border bg-card p-4 space-y-2">
            <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted" />
          </div>
        ))}
      </div>
    </section>
  )
}
