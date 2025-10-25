import { getPublishedPosts, getBatchPostViewsCounts, type Category } from "@/app/actions/public"
import { PostCard, type PostCardData } from "@/components/post-card"
import { Separator } from "@/components/ui/separator"
import { CategoryTabs } from "@/components/category-tabs"
import { AggressivePrefetch } from "@/components/aggressive-prefetch"

// Aggressive revalidation for instant updates
export const revalidate = 10 // Revalidate every 10 seconds

export default async function Home({ searchParams }: { searchParams?: Promise<{ category?: string }> }) {
  const params = await searchParams
  const categoryParam = (params?.category || "").toLowerCase()
  const category = ["fixes", "thoughts", "general"].includes(categoryParam)
    ? (categoryParam as Category)
    : undefined

  const posts = await getPublishedPosts(category)

  // FIXED: Batch fetch ALL view counts in a SINGLE database query (eliminates N+1 problem!)
  const postIds = posts.map((p: any) => p.id)
  const viewsMap = await getBatchPostViewsCounts(postIds)
  
  const cards: PostCardData[] = posts.map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    created_at: p.created_at,
    excerpt: p.excerpt,
    views: viewsMap[p.id] ?? 0,
  }))

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-6">
      {/* Aggressively prefetch first 10 articles for instant navigation */}
      <AggressivePrefetch slugs={cards.slice(0, 10).map(p => p.slug)} />
      
      <section className="mb-6">
        <h1 className="font-georgia text-3xl md:text-4xl">A personal blog about fixes, thoughts, and more</h1>
        <p className="mt-2 text-muted-foreground">Insights, notes, and learnings. Filter by category or browse all posts.</p>
      </section>

      {/* Client-side category tabs with optimistic UI */}
      <CategoryTabs />

      <Separator className="mb-6" />

      {cards.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </main>
  )
}