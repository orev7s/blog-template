"use server";

import { createClient } from "@/lib/supabase/server";

export type ActionState = { success?: boolean; error?: string };

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function createPostAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const title = String(formData.get("title") || "");
    const slug = String(formData.get("slug") || slugify(title));
    const categoryRaw = String(formData.get("category") || "general");
    const contentStr = String(formData.get("content") || "{}");
    const contentHtml = String(formData.get("contentHtml") || "");
    const intent = String(formData.get("intent") || "save");
    const publishedToggle = String(formData.get("published") || "off");

    const published = intent === "publish" ? true : publishedToggle === "on";
    const content = { json: JSON.parse(contentStr || "{}"), html: contentHtml };
    const category =
      categoryRaw === "Fixes"
        ? "fixes"
        : categoryRaw === "Thoughts"
        ? "thoughts"
        : "general";

    const { error } = await supabase
      .from("posts")
      .insert({ title, slug, content, category, author_id: user.id, published });

    if (error) return { error: error.message };
    return { success: true };
  } catch (e: any) {
    return { error: e?.message || String(e) };
  }
}

export async function updatePostAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const id = String(formData.get("id") || "");
    const title = String(formData.get("title") || "");
    const slug = String(formData.get("slug") || slugify(title));
    const categoryRaw = String(formData.get("category") || "general");
    const contentStr = String(formData.get("content") || "{}");
    const contentHtml = String(formData.get("contentHtml") || "");
    const intent = String(formData.get("intent") || "save");
    const publishedToggle = String(formData.get("published") || "off");

    const published = intent === "publish" ? true : publishedToggle === "on";
    const content = { json: JSON.parse(contentStr || "{}"), html: contentHtml };
    const category =
      categoryRaw === "Fixes"
        ? "fixes"
        : categoryRaw === "Thoughts"
        ? "thoughts"
        : "general";

    const { error } = await supabase
      .from("posts")
      .update({ title, slug, content, category, published })
      .eq("id", id);

    if (error) return { error: error.message };
    return { success: true };
  } catch (e: any) {
    return { error: e?.message || String(e) };
  }
}
