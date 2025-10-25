"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import { schedulePrefetch } from "@/lib/prefetch-utils"

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
      const delay = index < 2 ? 0 : index * 45
      schedulePrefetch(() => {
        void router.prefetch(route)
      }, delay)
    })
  }, [router])

  return null
}
