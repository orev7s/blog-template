"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import RichEditorDynamic from "@/components/editor/rich-editor-dynamic";
import { cn } from "@/lib/utils";

import { createPostAction, type ActionState } from "@/app/admin/posts/actions";

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

export default function NewPostPage() {
  const [state, formAction] = useActionState(createPostAction, {} as ActionState);
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(false);
  const [category, setCategory] = React.useState("General");
  const [published, setPublished] = React.useState(true);
  const [content, setContent] = React.useState<any>({ type: "doc", content: [] });
  const [contentHtml, setContentHtml] = React.useState<string>("");

  React.useEffect(() => {
    if (!isSlugManuallyEdited && title) {
      setSlug(slugify(title));
    }
  }, [title, isSlugManuallyEdited]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">New Post</h1>
      <form action={formAction} className="space-y-6">
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
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setIsSlugManuallyEdited(true);
              }}
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
          <p className="text-sm text-green-600">Post saved successfully.</p>
        ) : null}

        <SubmitButtons />
      </form>
    </div>
  );
}
