"use server"

import { createClient } from "@/lib/supabase/server"
import Fuse from "fuse.js"

export interface ArticleSuggestion {
  id: string
  title: string
  slug: string
  category: string
}

export async function searchArticlesForMention(query: string): Promise<ArticleSuggestion[]> {
  const supabase = await createClient()
  
  // Get all published articles
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, category")
    .eq("published", true)
    .order("created_at", { ascending: false })
  
  if (error || !data) {
    return []
  }
  
  // Use Fuse.js for fuzzy search
  const fuse = new Fuse(data, {
    keys: ["title"],
    threshold: 0.4, // 0.0 = perfect match, 1.0 = match anything
    includeScore: true,
    minMatchCharLength: 1,
  })
  
  const results = fuse.search(query, { limit: 10 })
  return results.map(result => result.item)
}

export async function getArticleById(id: string): Promise<ArticleSuggestion | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, category")
    .eq("id", id)
    .eq("published", true)
    .single()
  
  if (error || !data) {
    return null
  }
  
  return data
}
