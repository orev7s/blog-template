"use client"

import { useEffect, useState } from "react"

function generateId() {
  // Simple random id
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
  )
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return ""
  try {
    let id = localStorage.getItem("blog_session_id")
    if (!id) {
      id = generateId()
      localStorage.setItem("blog_session_id", id)
    }
    return id
  } catch {
    return ""
  }
}

export function useSessionId() {
  const [id, setId] = useState<string>("")
  useEffect(() => {
    setId(getOrCreateSessionId())
  }, [])
  return id
}
