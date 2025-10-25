"use server"

import { revalidatePath } from "next/cache"
import { ensureOwner } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export async function approveComment(id: string) {
  await ensureOwner()
  const supabase = await createClient()
  const { error } = await supabase.from("comments").update({ approved: true }).eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/admin/comments")
  return { success: true }
}

export async function deleteComment(id: string) {
  await ensureOwner()
  const supabase = await createClient()
  const { error } = await supabase.from("comments").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/admin/comments")
  return { success: true }
}

export async function getComments() {
  await ensureOwner()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("comments")
    .select("id, content, approved, created_at, author_name, post_id, posts(title)")
    .order("created_at", { ascending: false })
  if (error) return { success: false, error: error.message, data: [] as any[] }
  return { success: true, data: data ?? [] }
}
