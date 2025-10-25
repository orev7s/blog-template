"use server"

import { cache } from "react"
import { createClient } from "@/lib/supabase/server"

export type Category = "fixes" | "thoughts" | "general"

export const getPublishedPosts = cache(async (category?: Category) => {
  const supabase = await createClient()
  let query = supabase
    .from("posts")
    .select("id,title,slug,category,created_at,content")
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (category) {
    query = query.eq("category", category)
  }

  const { data, error } = await query
  if (error) throw error

  return (data ?? []).map((p) => ({
    ...p,
    excerpt: deriveExcerpt(p.content),
  }))
})

export const getPostBySlug = cache(async (slug: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("posts")
    .select("id,title,slug,content,category,created_at,published")
    .eq("slug", slug)
    .single()
  if (error) throw error
  if (!data || !data.published) throw new Error("Post not found")
  return data
})

export const getApprovedComments = cache(async (postId: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("comments")
    .select("id,author_name,content,created_at")
    .eq("approved", true)
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
  if (error) throw error
  return data ?? []
})

export async function trackView(postId: string, sessionId: string) {
  const supabase = await createClient()
  // Insert and ignore unique violation (treated as already counted today)
  const { error } = await supabase.from("post_views").insert({ post_id: postId, session_id: sessionId })
  if (error && !isUniqueViolation(error)) throw error
  return { ok: true }
}

export async function reactToPost(postId: string, sessionId: string, reaction: "like" | "dislike") {
  const supabase = await createClient()
  const { error } = await supabase
    .from("post_reactions")
    .upsert({ post_id: postId, session_id: sessionId, reaction_type: reaction }, {
      onConflict: "post_id,session_id",
    })
  if (error) throw error
  return { ok: true }
}

export async function submitComment(prevState: any, formData: FormData) {
  try {
    const postId = String(formData.get("postId"))
    const name = String(formData.get("name") || "").trim()
    const email = String(formData.get("email") || "").trim() || null
    const content = String(formData.get("content") || "").trim()

    if (!postId || !name || !content) {
      return { ok: false, message: "Name and comment are required." }
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from("comments")
      .insert({ post_id: postId, author_name: name, author_email: email, content, approved: false })
    if (error) throw error
    return { ok: true, message: "Comment submitted and pending moderation." }
  } catch (e: any) {
    return { ok: false, message: e.message || "Failed to submit comment" }
  }
}

export const getPostViewsCount = cache(async (postId: string): Promise<number> => {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("get_post_analytics", { post_uuid: postId })
  if (error) return 0
  try {
    if (data && typeof data === "object") {
      const views = (data as any)["views"]
      if (typeof views === "number") return views
    }
  } catch {}
  return 0
})

// NEW: Batch fetch all view counts in a SINGLE query (eliminates N+1 problem)
export const getBatchPostViewsCounts = cache(async (postIds: string[]): Promise<Record<string, number>> => {
  if (postIds.length === 0) return {}
  
  const supabase = await createClient()
  
  // Get all views in a single query by counting grouped by post_id
  const { data, error } = await supabase
    .from("post_views")
    .select("post_id")
    .in("post_id", postIds)
  
  if (error || !data) return {}
  
  // Count views per post
  const viewsMap: Record<string, number> = {}
  for (const postId of postIds) {
    viewsMap[postId] = 0
  }
  
  for (const view of data) {
    if (view.post_id) {
      viewsMap[view.post_id] = (viewsMap[view.post_id] || 0) + 1
    }
  }
  
  return viewsMap
})

export async function reactToPostAction(prevState: any, formData: FormData) {
  try {
    const postId = String(formData.get("postId") || "")
    const sessionId = String(formData.get("sessionId") || "")
    const reaction = String(formData.get("reaction") || "") as "like" | "dislike"
    if (!postId || !sessionId || (reaction !== "like" && reaction !== "dislike")) {
      return { ok: false, message: "Invalid reaction" }
    }
    await reactToPost(postId, sessionId, reaction)
    return { ok: true }
  } catch (e: any) {
    return { ok: false, message: e.message || "Failed to react" }
  }
}

export async function trackViewAction(prevState: any, formData: FormData) {
  try {
    const postId = String(formData.get("postId") || "")
    const sessionId = String(formData.get("sessionId") || "")
    if (!postId || !sessionId) return { ok: false }
    await trackView(postId, sessionId)
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

function deriveExcerpt(content: any): string | undefined {
  try {
    if (content == null) return undefined
    let raw = ""
    if (typeof content === "string") {
      raw = stripHtml(content)
    } else if (typeof content === "object") {
      if (typeof content.html === "string") raw = stripHtml(content.html)
      else if (typeof content.markdown === "string") raw = stripMarkdown(content.markdown)
      else if (typeof content.text === "string") raw = content.text
      else raw = JSON.stringify(content)
    }
    const trimmed = raw.replace(/\s+/g, " ").trim()
    return trimmed.length > 180 ? trimmed.slice(0, 180) + "…" : trimmed
  } catch {
    return undefined
  }
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "")
}

function stripMarkdown(md: string) {
  return md
    .replace(/(`{1,3}[^`]*`{1,3})/g, " ") // code
    .replace(/(!?\[[^\]]*\]\([^\)]*\))/g, " ") // links/images
    .replace(/[#>*_`~-]+/g, " ") // md symbols
}

function isUniqueViolation(error: any) {
  // Postgres unique_violation
  return error?.code === "23505"
}
