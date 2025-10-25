"use server"

import { createClient } from "@/lib/supabase/server"
import { ensureOwner } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateSettingsAction(prevState: any, formData: FormData) {
  try {
    await ensureOwner()

    const signupEnabled = formData.get("signup_enabled") === "on"

    const supabase = await createClient()

    const { error } = await supabase
      .from("settings")
      .update({ value: signupEnabled, updated_at: new Date().toISOString() })
      .eq("key", "signup_enabled")

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin/settings")
    revalidatePath("/signup")

    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to update settings" }
  }
}
