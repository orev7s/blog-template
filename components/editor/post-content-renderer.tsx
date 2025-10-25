"use client"

import React from "react"
import { EditorContent, useEditor, ReactNodeViewRenderer } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import { TextStyle } from "@tiptap/extension-text-style"
import FontFamily from "@tiptap/extension-font-family"
import { ArticleMention } from "./article-mention-extension"
import ArticleMentionNode from "./article-mention-node"
import "./editor.css"

interface PostContentRendererProps {
  content: any
}

export default function PostContentRenderer({ content }: PostContentRendererProps) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextStyle,
      FontFamily,
      Image.configure({ inline: false, allowBase64: false }),
      ArticleMention.configure({
        HTMLAttributes: {
          class: "article-mention",
        },
        renderLabel({ node }) {
          return node.attrs.label
        },
      }).extend({
        addNodeView() {
          return ReactNodeViewRenderer(ArticleMentionNode)
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "tiptap-readonly",
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="post-content-renderer">
      <EditorContent editor={editor} />
    </div>
  )
}
