"use client";

import React from "react";
import { EditorContent, useEditor, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { uploadImage } from "@/lib/upload-image";
import { cn } from "@/lib/utils";
import { ArticleMention } from "./article-mention-extension";
import ArticleMentionNode from "./article-mention-node";
import "tippy.js/dist/tippy.css";
import "./editor.css";

type JSONContent = Record<string, any>;

export interface RichEditorProps {
  className?: string;
  value?: JSONContent; // tiptap JSON document
  onChange?: (json: JSONContent, html: string) => void;
}

const fonts = [
  { label: "Inter", value: "Inter, ui-sans-serif, system-ui" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Roboto Mono", value: '"Roboto Mono", ui-monospace, monospace' },
];

export default function RichEditor({ className, value, onChange }: RichEditorProps) {
  const [isPreview, setIsPreview] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [currentFont, setCurrentFont] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
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
    content: value ?? {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Start writing your post..." },
          ],
        },
      ],
    },
    onUpdate: ({ editor }) => {
      try {
        const json = editor.getJSON();
        const html = editor.getHTML();
        onChange?.(json, html);
      } catch (error) {
        console.error("Editor update error:", error);
        // Still call onChange with JSON only if HTML fails
        try {
          const json = editor.getJSON();
          onChange?.(json, "");
        } catch {}
      }
    },
    onSelectionUpdate: ({ editor }) => {
      // Update current font when selection changes
      const fontFamily = (editor.getAttributes("textStyle")?.fontFamily as string) || "";
      setCurrentFont(fontFamily);
    },
    editorProps: {
      attributes: {
        class: cn("tiptap ProseMirror min-h-[300px]"),
      },
      handlePaste: (view, event, slice) => {
        // Get the pasted content
        const text = event.clipboardData?.getData("text/plain");
        
        if (text) {
          // Check if we're currently in a paragraph
          const { $from } = view.state.selection;
          const parent = $from.parent;
          
          // If we're in a paragraph and not at the start of it, insert as plain text
          if (parent.type.name === "paragraph" && $from.parentOffset > 0) {
            // Insert text at cursor position without creating new paragraph
            const tr = view.state.tr.insertText(text);
            view.dispatch(tr);
            return true; // Prevent default paste behavior
          }
        }
        
        // For other cases, use default paste behavior
        return false;
      },
    },
  });

  const onFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!editor) return;
    
    // Apply font and update state immediately
    if (!val) {
      editor.chain().focus().unsetFontFamily().run();
      setCurrentFont("");
    } else {
      editor.chain().focus().setFontFamily(val).run();
      setCurrentFont(val);
    }
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    try {
      setUploading(true);
      const { url } = await uploadImage(file, () => {});
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="editor-toolbar rounded-t-md">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (!editor) return;
              const { from, to } = editor.state.selection;
              if (from === to) return; // No selection, do nothing
              
              editor.chain().focus().toggleBold().run();
              
              // Clear stored marks so formatting doesn't continue after selection
              setTimeout(() => {
                const tr = editor.state.tr;
                tr.setStoredMarks([]);
                editor.view.dispatch(tr);
              }, 0);
            }}
            disabled={!editor || isPreview}
          >
            Bold
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (!editor) return;
              const { from, to } = editor.state.selection;
              if (from === to) return; // No selection, do nothing
              
              editor.chain().focus().toggleItalic().run();
              
              // Clear stored marks so formatting doesn't continue after selection
              setTimeout(() => {
                const tr = editor.state.tr;
                tr.setStoredMarks([]);
                editor.view.dispatch(tr);
              }, 0);
            }}
            disabled={!editor || isPreview}
          >
            Italic
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (!editor) return;
              const { from, to } = editor.state.selection;
              if (from === to) return; // No selection, do nothing
              
              editor.chain().focus().toggleCode().run();
              
              // Clear stored marks so formatting doesn't continue after selection
              setTimeout(() => {
                const tr = editor.state.tr;
                tr.setStoredMarks([]);
                editor.view.dispatch(tr);
              }, 0);
            }}
            disabled={!editor || isPreview}
          >
            Code
          </Button>

          <div className="toolbar-separator" />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (!editor) return;
              const { from, to } = editor.state.selection;
              if (from === to) return; // No selection, do nothing
              
              editor.chain().focus().toggleHeading({ level: 1 }).run();
              
              // Clear stored marks so formatting doesn't continue after selection
              setTimeout(() => {
                const tr = editor.state.tr;
                tr.setStoredMarks([]);
                editor.view.dispatch(tr);
              }, 0);
            }}
            disabled={!editor || isPreview}
          >
            H1
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (!editor) return;
              const { from, to } = editor.state.selection;
              if (from === to) return; // No selection, do nothing
              
              editor.chain().focus().toggleHeading({ level: 2 }).run();
              
              // Clear stored marks so formatting doesn't continue after selection
              setTimeout(() => {
                const tr = editor.state.tr;
                tr.setStoredMarks([]);
                editor.view.dispatch(tr);
              }, 0);
            }}
            disabled={!editor || isPreview}
          >
            H2
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (!editor) return;
              const { from, to } = editor.state.selection;
              if (from === to) return; // No selection, do nothing
              
              editor.chain().focus().toggleHeading({ level: 3 }).run();
              
              // Clear stored marks so formatting doesn't continue after selection
              setTimeout(() => {
                const tr = editor.state.tr;
                tr.setStoredMarks([]);
                editor.view.dispatch(tr);
              }, 0);
            }}
            disabled={!editor || isPreview}
          >
            H3
          </Button>

          <div className="toolbar-separator" />

          <Button
            type="button"
            variant={editor?.isActive("bulletList") ? "secondary" : "outline"}
            size="sm"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            disabled={!editor || isPreview}
          >
            • List
          </Button>
          <Button
            type="button"
            variant={editor?.isActive("orderedList") ? "secondary" : "outline"}
            size="sm"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            disabled={!editor || isPreview}
          >
            1. List
          </Button>

          <div className="toolbar-separator" />

          <Select
            aria-label="Font family"
            value={currentFont}
            onChange={onFontChange}
            disabled={!editor || isPreview}
            className="min-w-[180px]"
          >
            <option value="">Font</option>
            {fonts.map((f) => (
              <option key={f.label} value={f.value} className={
                f.label === "Inter"
                  ? "font-preview-inter"
                  : f.label === "Georgia"
                  ? "font-preview-georgia"
                  : "font-preview-roboto-mono"
              }>
                {f.label}
              </option>
            ))}
          </Select>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={triggerFilePicker}
            disabled={!editor || isPreview || uploading}
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="ml-auto" />
          <Button
            type="button"
            variant={isPreview ? "secondary" : "outline"}
            size="sm"
            onClick={() => setIsPreview((p) => !p)}
          >
            {isPreview ? "Editing" : "Preview"}
          </Button>
        </div>
      </div>
      <div className="editor-surface rounded-b-md">
        {!isPreview ? (
          <EditorContent editor={editor} />
        ) : (
          <div
            className="editor-preview"
            dangerouslySetInnerHTML={{ __html: editor?.getHTML() ?? "" }}
          />
        )}
      </div>
    </div>
  );
}
