"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

const ADMIN_ROUTES = [
  "/admin",
  "/admin/posts",
  "/admin/posts/new",
  "/admin/comments",
  "/admin/analytics",
  "/admin/settings",
]

export function AdminPrefetch() {
  const router = useRouter()
  const prefetchedRef = useRef(false)

  useEffect(() => {
    if (prefetchedRef.current) return
    prefetchedRef.current = true

    // IMMEDIATELY prefetch all admin routes for instant navigation
    ADMIN_ROUTES.forEach((route, index) => {
      if (index < 2) {
        // Prefetch first 2 immediately
        router.prefetch(route)
      } else {
        // Stagger the rest
        setTimeout(() => router.prefetch(route), index * 50)
      }
    })
  }, [router])

  return null
}
