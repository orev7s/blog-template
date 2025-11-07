"use client"

import React from "react"
import { NodeViewWrapper, ReactNodeViewProps } from "@tiptap/react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface ArticleMentionNodeProps {
  node: {
    attrs: {
      id: string
      label: string
      slug: string
      category: string
    }
  }
}

// Wrapper component that bridges ReactNodeViewProps to ArticleMentionNodeProps
export function ArticleMentionNodeWrapper(props: ReactNodeViewProps<HTMLElement>) {
  const { node } = props
  const articleProps: ArticleMentionNodeProps = {
    node: {
      attrs: {
        id: node.attrs.id || '',
        label: node.attrs.label || '',
        slug: node.attrs.slug || '',
        category: node.attrs.category || ''
      }
    }
  }
  return <ArticleMentionNode {...articleProps} />
}

// Document SVG Icon
function DocumentIcon() {
  return (
    <svg
      className="article-mention-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

export default function ArticleMentionNode({ node }: ArticleMentionNodeProps) {
  const { label, slug, category } = node.attrs

  return (
    <NodeViewWrapper className="article-mention-wrapper">
      <Link 
        href={`/posts/${slug}`}
        className="article-mention-card"
        contentEditable={false}
        draggable
      >
        <DocumentIcon />
        <div className="article-mention-content">
          <div className="article-mention-title">{label}</div>
          <div className="article-mention-category">{category}</div>
        </div>
      </Link>
    </NodeViewWrapper>
  )
}
