"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import RichEditorDynamic from "@/components/editor/rich-editor-dynamic";

import { updatePostAction, type ActionState } from "@/app/admin/posts/actions";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// server action imported from app/admin/posts/actions

function SubmitButtons() {
  const { pending } = useFormStatus();
  return (
    <div className="flex items-center gap-3">
      <Button type="submit" name="intent" value="save" disabled={pending}>
        {pending ? "Saving..." : "Save"}
      </Button>
      <Button
        type="submit"
        name="intent"
        value="publish"
        variant="secondary"
        disabled={pending}
      >
        {pending ? "Publishing..." : "Publish"}
      </Button>
    </div>
  );
}

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const [state, formAction] = useActionState(updatePostAction, {} as ActionState);

  const [loading, setLoading] = React.useState(true);
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [category, setCategory] = React.useState("General");
  const [published, setPublished] = React.useState(false);
  const [content, setContent] = React.useState<any>({ type: "doc", content: [] });
  const [contentHtml, setContentHtml] = React.useState<string>("");

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data, error } = await supabase
          .from("posts")
          .select("id, title, slug, content, category, published")
          .eq("id", id)
          .single();
        if (!mounted) return;
        if (error) throw error;
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setCategory(
          data.category === "fixes" ? "Fixes" : data.category === "thoughts" ? "Thoughts" : "General"
        );
        setPublished(!!data.published);
        // Handle both old format (direct JSON) and new format ({ json, html })
        const contentData = data.content || { type: "doc", content: [] };
        if (contentData.json) {
          setContent(contentData.json);
          setContentHtml(contentData.html || "");
        } else {
          setContent(contentData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (!id) return <div className="p-4">Invalid post id</div>;
  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">Edit Post</h1>
      <form action={formAction} className="space-y-6">
        <input type="hidden" name="id" value={id} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Amazing post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="auto-generated-from-title"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Fixes</option>
              <option>Thoughts</option>
              <option>General</option>
            </Select>
          </div>
          <div className="flex items-end">
            <Checkbox
              aria-label="Published"
              title="Published"
              name="published"
              checked={published}
              onChange={(e) => setPublished(e.currentTarget.checked)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Content</Label>
          <RichEditorDynamic 
            value={content} 
            onChange={(json, html) => {
              setContent(json)
              setContentHtml(html)
            }} 
          />
          <input type="hidden" name="content" value={JSON.stringify(content)} />
          <input type="hidden" name="contentHtml" value={contentHtml} />
        </div>

        {state?.error ? (
          <p className="text-sm text-red-600">{state.error}</p>
        ) : state?.success ? (
          <p className="text-sm text-green-600">Post updated successfully.</p>
        ) : null}

        <SubmitButtons />
      </form>
    </div>
  );
}
