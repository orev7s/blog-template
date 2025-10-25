"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import { schedulePrefetch } from "@/lib/prefetch-utils"

interface AggressivePrefetchProps {
  slugs: string[]
}

export function AggressivePrefetch({ slugs }: AggressivePrefetchProps) {
  const router = useRouter()
  const prefetchedRef = useRef(new Set<string>())

  useEffect(() => {
    // IMMEDIATELY prefetch the first 10 articles on mount
    slugs.forEach((slug, index) => {
      const href = `/posts/${slug}`
      if (prefetchedRef.current.has(href)) return
      prefetchedRef.current.add(href)

      const delay = index < 3 ? 0 : index * 40
      schedulePrefetch(() => {
        void router.prefetch(href)
      }, delay)
    })
  }, [slugs, router])

  // Also prefetch on hover for non-prefetched articles
  useEffect(() => {
    const handleMouseEnter = (e: Event) => {
      const target = e.target
      // Check if target is an HTMLElement with closest method
      if (!target || !(target instanceof HTMLElement)) return
      
      const link = target.closest('a[href^="/posts/"]') as HTMLAnchorElement
      if (link) {
        const href = link.getAttribute("href")
        if (href && !prefetchedRef.current.has(href)) {
          prefetchedRef.current.add(href)
          schedulePrefetch(() => {
            void router.prefetch(href)
          }, 20)
        }
      }
    }

    // Add event listener to the document for all post links
    document.addEventListener("mouseenter", handleMouseEnter, true)
    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter, true)
    }
  }, [router])

  return null
}
