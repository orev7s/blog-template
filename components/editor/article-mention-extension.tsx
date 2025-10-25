import { Node, mergeAttributes } from "@tiptap/core"
import { ReactRenderer } from "@tiptap/react"
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion"
import { PluginKey } from "@tiptap/pm/state"
import tippy, { Instance as TippyInstance } from "tippy.js"
import { ArticleSuggestion, searchArticlesForMention } from "@/app/actions/editor"
import MentionList from "./mention-list"

export const ArticleMentionPluginKey = new PluginKey("articleMention")

export interface ArticleMentionOptions {
  HTMLAttributes: Record<string, any>
  renderLabel: (props: { node: any }) => string
  suggestion: Omit<SuggestionOptions, "editor">
}

export const ArticleMention = Node.create<ArticleMentionOptions>({
  name: "articleMention",

  addOptions() {
    return {
      HTMLAttributes: {},
      renderLabel({ node }) {
        return `@${node.attrs.label ?? node.attrs.id}`
      },
      suggestion: {
        char: "@",
        pluginKey: ArticleMentionPluginKey,
        command: ({ editor, range, props }) => {
          // Remove the @ character and insert the mention node
          // Transform ArticleSuggestion to node attributes
          const attrs = {
            id: props.id,
            label: props.title, // Map title to label
            slug: props.slug,
            category: props.category,
          }
          
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent([
              {
                type: "articleMention",
                attrs: attrs,
              },
              {
                type: "text",
                text: " ",
              },
            ])
            .run()
        },
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from)
          const type = state.schema.nodes.articleMention
          const allow = !!$from.parent.type.contentMatch.matchType(type)
          return allow
        },
        items: async ({ query }): Promise<ArticleSuggestion[]> => {
          if (query.length === 0) {
            return []
          }
          const results = await searchArticlesForMention(query)
          return results
        },
        render: () => {
          let component: ReactRenderer
          let popup: TippyInstance[]

          return {
            onStart: (props) => {
              component = new ReactRenderer(MentionList, {
                props,
                editor: props.editor,
              })

              if (!props.clientRect) {
                return
              }

              popup = tippy("body", {
                getReferenceClientRect: props.clientRect as any,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              })
            },

            onUpdate(props) {
              component.updateProps(props)

              if (!props.clientRect) {
                return
              }

              popup[0].setProps({
                getReferenceClientRect: props.clientRect as any,
              })
            },

            onKeyDown(props) {
              if (props.event.key === "Escape") {
                popup[0].hide()
                return true
              }

              return (component.ref as any)?.onKeyDown(props)
            },

            onExit() {
              popup[0].destroy()
              component.destroy()
            },
          }
        },
      },
    }
  },

  group: "inline",

  inline: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {}
          }
          return {
            "data-id": attributes.id,
          }
        },
      },
      label: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-label"),
        renderHTML: (attributes) => {
          if (!attributes.label) {
            return {}
          }
          return {
            "data-label": attributes.label,
          }
        },
      },
      slug: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-slug"),
        renderHTML: (attributes) => {
          if (!attributes.slug) {
            return {}
          }
          return {
            "data-slug": attributes.slug,
          }
        },
      },
      category: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-category"),
        renderHTML: (attributes) => {
          if (!attributes.category) {
            return {}
          }
          return {
            "data-category": attributes.category,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: `span[data-type="${this.name}"]`,
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(
        { "data-type": this.name },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      this.options.renderLabel({
        node,
      }),
    ]
  },

  renderText({ node }) {
    return this.options.renderLabel({
      node,
    })
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ tr, state }) => {
          let isMention = false
          const { selection } = state
          const { empty, anchor } = selection

          if (!empty) {
            return false
          }

          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (node.type.name === this.name) {
              isMention = true
              tr.insertText("@" + (node.attrs.label || ""), pos, pos + node.nodeSize)
              return false
            }
          })

          return isMention
        }),
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
