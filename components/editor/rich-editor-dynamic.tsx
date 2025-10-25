"use client"

import dynamic from "next/dynamic"
import type { RichEditorProps } from "./rich-editor"

// Lazy load the heavy TipTap editor
const RichEditor = dynamic(() => import("./rich-editor"), {
  ssr: false,
  loading: () => (
    <div className="rounded-md border bg-muted/50 p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading editor...</p>
      </div>
    </div>
  ),
})

export default function RichEditorDynamic(props: RichEditorProps) {
  return <RichEditor {...props} />
}
