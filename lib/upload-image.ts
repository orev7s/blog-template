"use client";

import { createClient } from "@/lib/supabase/client";

export type UploadProgress = {
  progress: number; // 0 - 100
  status: "idle" | "uploading" | "done" | "error";
  message?: string;
};

export type UploadResult = {
  url: string;
  path: string;
};

/**
 * Upload an image file to the 'blog-images' bucket and return its public URL.
 * Note: Supabase Storage SDK does not currently support granular progress events.
 * We provide a simple start->complete progress callback for UI feedback.
 */
export async function uploadImage(
  file: File,
  onProgress?: (p: UploadProgress) => void
): Promise<UploadResult> {
  const supabase = createClient();

  if (!file) {
    throw new Error("No file provided");
  }

  const ext = file.name.split(".").pop() || "png";
  const safeExt = ext.toLowerCase();
  const now = new Date();
  const folder = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(
    now.getDate()
  ).padStart(2, "0")}`;
  const filename = `${crypto.randomUUID()}.${safeExt}`;
  const path = `${folder}/${filename}`;

  try {
    onProgress?.({ progress: 0, status: "uploading" });

    const { error } = await supabase.storage
      .from("blog-images")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      onProgress?.({ progress: 0, status: "error", message: error.message });
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("blog-images").getPublicUrl(path);

    onProgress?.({ progress: 100, status: "done" });

    return { url: publicUrl, path };
  } catch (err: any) {
    onProgress?.({ progress: 0, status: "error", message: err?.message || String(err) });
    throw err;
  }
}
