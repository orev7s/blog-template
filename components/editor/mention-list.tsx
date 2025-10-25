import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { ArticleSuggestion } from "@/app/actions/editor"
import { cn } from "@/lib/utils"

export interface MentionListProps {
  items: ArticleSuggestion[]
  command: (item: ArticleSuggestion) => void
}

export interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

const MentionList = forwardRef<MentionListRef, MentionListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]
    if (item) {
      props.command(item)
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        upHandler()
        return true
      }

      if (event.key === "ArrowDown") {
        downHandler()
        return true
      }

      if (event.key === "Enter") {
        enterHandler()
        return true
      }

      return false
    },
  }))

  if (props.items.length === 0) {
    return (
      <div className="mention-list">
        <div className="mention-list-item mention-list-empty">No articles found</div>
      </div>
    )
  }

  return (
    <div className="mention-list">
      {props.items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          className={cn("mention-list-item", {
            "mention-list-item-selected": index === selectedIndex,
          })}
          onClick={() => selectItem(index)}
        >
          <div className="mention-list-item-title">{item.title}</div>
          <div className="mention-list-item-category">{item.category}</div>
        </button>
      ))}
    </div>
  )
})

MentionList.displayName = "MentionList"

export default MentionList
