"use server"

import { revalidatePath } from "next/cache"
import { ensureOwner } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export type PostCategory = "fixes" | "thoughts" | "general"

export async function createPost(input: {
  title: string
  content: any
  category: PostCategory
  published?: boolean
}) {
  await ensureOwner()
  const supabase = await createClient()
  // Generate slug using DB function to keep consistent
  const { data: slugData } = await supabase.rpc("generate_slug", {
    title: input.title,
  })
  const slug = typeof slugData === "string" && slugData.length ? slugData : input.title
  const {
    data,
    error,
  } = await supabase.from("posts").insert({
    title: input.title,
    slug,
    content: input.content,
    category: input.category,
    published: input.published ?? false,
  }).select().single()
  if (error) return { success: false, error: error.message }
  revalidatePath("/admin/posts")
  return { success: true, data }
}

export async function updatePost(id: string, input: Partial<{ title: string; content: any; category: PostCategory; published: boolean }>) {
  await ensureOwner()
  const supabase = await createClient()
  let updatePayload: Record<string, any> = { ...input }
  if (input.title) {
    const { data: slugData } = await supabase.rpc("generate_slug", {
      title: input.title,
    })
    updatePayload.slug = typeof slugData === "string" && slugData.length ? slugData : input.title
  }
  const { error } = await supabase.from("posts").update(updatePayload).eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/admin/posts")
  return { success: true }
}

export async function deletePost(id: string) {
  await ensureOwner()
  const supabase = await createClient()
  const { error } = await supabase.from("posts").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/admin/posts")
  return { success: true }
}

export async function togglePostPublished(id: string) {
  await ensureOwner()
  const supabase = await createClient()
  
  // First get the current published status
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("published")
    .eq("id", id)
    .single()
  
  if (fetchError) return { success: false, error: fetchError.message }
  
  // Toggle the status
  const newStatus = !post.published
  const { error: updateError } = await supabase
    .from("posts")
    .update({ published: newStatus })
    .eq("id", id)
  
  if (updateError) return { success: false, error: updateError.message }
  revalidatePath("/admin/posts")
  return { success: true, newStatus }
}

export async function getPosts(filters?: { category?: PostCategory; status?: "published" | "draft" }) {
  await ensureOwner()
  const supabase = await createClient()
  let query = supabase.from("posts").select("id,title,category,published,created_at")
  if (filters?.category) {
    query = query.eq("category", filters.category)
  }
  if (filters?.status) {
    query = query.eq("published", filters.status === "published")
  }
  query = query.order("created_at", { ascending: false })
  const { data: posts, error } = await query
  if (error) return { success: false, error: error.message, data: [] as any[] }

  // Fetch views and count per post on the server
  const { data: viewsRows } = await supabase
    .from("post_views")
    .select("post_id")

  const viewsMap = new Map<string, number>()
  ;(viewsRows ?? []).forEach((row: any) => {
    viewsMap.set(row.post_id, (viewsMap.get(row.post_id) ?? 0) + 1)
  })

  const withViews = (posts ?? []).map((p) => ({
    ...p,
    views: viewsMap.get(p.id) ?? 0,
  }))
  return { success: true, data: withViews }
}

export async function getOverview() {
  await ensureOwner()
  const supabase = await createClient()

  const [{ count: postsCount }, { count: commentsCount }, { count: pendingCount }, { count: viewsCount }] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("comments").select("id", { count: "exact", head: true }),
    supabase.from("comments").select("id", { count: "exact", head: true }).eq("approved", false),
    supabase.from("post_views").select("id", { count: "exact", head: true }),
  ])

  // Recent activity: latest 5 posts and 5 comments merged
  const [{ data: latestPosts }, { data: latestComments }] = await Promise.all([
    supabase.from("posts").select("id,title,created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("comments").select("id,content,created_at").order("created_at", { ascending: false }).limit(5),
  ])

  const activity = [
    ...(latestPosts ?? []).map((p) => ({ type: "post" as const, id: p.id, title: p.title, created_at: p.created_at })),
    ...(latestComments ?? []).map((c) => ({ type: "comment" as const, id: c.id, content: c.content, created_at: c.created_at })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return {
    success: true,
    data: {
      totals: {
        posts: postsCount ?? 0,
        comments: commentsCount ?? 0,
        pendingComments: pendingCount ?? 0,
        views: viewsCount ?? 0,
      },
      activity: activity.slice(0, 10),
    },
  }
}

export async function getAnalyticsData(params: { days?: number } = {}) {
  await ensureOwner()
  const supabase = await createClient()
  const days = params.days ?? 30
  const since = new Date()
  since.setDate(since.getDate() - days)

  const [{ data: views }, { data: reactions }, { data: allPosts }, { count: commentsCount }] = await Promise.all([
    supabase.from("post_views").select("post_id, viewed_at").gte("viewed_at", since.toISOString()),
    supabase.from("post_reactions").select("post_id, reaction_type").gte("created_at", since.toISOString()),
    supabase.from("posts").select("id,title"),
    supabase.from("comments").select("id", { count: "exact", head: true }),
  ])

  // Map post titles
  const postTitle = new Map<string, string>()
  ;(allPosts ?? []).forEach((p) => postTitle.set(p.id, p.title))

  // Views over time (by date)
  const viewsByDate = new Map<string, number>()
  ;(views ?? []).forEach((v) => {
    const d = new Date(v.viewed_at)
    const key = d.toISOString().slice(0, 10)
    viewsByDate.set(key, (viewsByDate.get(key) ?? 0) + 1)
  })
  const viewsOverTime = Array.from(viewsByDate.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([date, count]) => ({ date, views: count }))

  // Top posts by views
  const viewsByPost = new Map<string, number>()
  ;(views ?? []).forEach((v) => {
    viewsByPost.set(v.post_id, (viewsByPost.get(v.post_id) ?? 0) + 1)
  })
  const topPostsByViews = Array.from(viewsByPost.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([postId, count]) => ({ postId, title: postTitle.get(postId) ?? "Untitled", views: count }))

  // Reactions per post
  const reactionMap = new Map<string, { likes: number; dislikes: number }>()
  ;(reactions ?? []).forEach((r) => {
    const entry = reactionMap.get(r.post_id) ?? { likes: 0, dislikes: 0 }
    if (r.reaction_type === "like") entry.likes += 1
    else entry.dislikes += 1
    reactionMap.set(r.post_id, entry)
  })
  const reactionsPerPost = Array.from(reactionMap.entries()).map(([postId, v]) => ({
    postId,
    title: postTitle.get(postId) ?? "Untitled",
    likes: v.likes,
    dislikes: v.dislikes,
  }))

  const totals = {
    views: (views ?? []).length,
    likes: (reactions ?? []).filter((r) => r.reaction_type === "like").length,
    dislikes: (reactions ?? []).filter((r) => r.reaction_type === "dislike").length,
    comments: commentsCount ?? 0,
  }

  return { success: true, data: { viewsOverTime, topPostsByViews, reactionsPerPost, totals } }
}
