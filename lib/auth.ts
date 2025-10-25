import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export type UserRole = "owner" | "user" | null

export async function getCurrentUserAndRole() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError) return { user: null, role: null as UserRole }
  if (!user) return { user: null, role: null as UserRole }
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()
  const role = (profile?.role as UserRole) ?? null
  return { user, role }
}

export async function requireOwnerOrRedirect() {
  const { user, role } = await getCurrentUserAndRole()
  if (!user || role !== "owner") {
    redirect("/")
  }
}

export async function ensureOwner(): Promise<void> {
  const { user, role } = await getCurrentUserAndRole()
  if (!user || role !== "owner") {
    throw new Error("Unauthorized: owner role required")
  }
}
