"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

interface AggressivePrefetchProps {
  slugs: string[]
}

export function AggressivePrefetch({ slugs }: AggressivePrefetchProps) {
  const router = useRouter()
  const prefetchedRef = useRef(new Set<string>())

  useEffect(() => {
    // IMMEDIATELY prefetch the first 10 articles on mount
    slugs.forEach((slug, index) => {
      if (prefetchedRef.current.has(slug)) return
      prefetchedRef.current.add(slug)
      
      // Prefetch first 3 immediately, rest staggered
      if (index < 3) {
        router.prefetch(`/posts/${slug}`)
      } else {
        // Stagger the rest with a tiny delay
        setTimeout(() => {
          router.prefetch(`/posts/${slug}`)
        }, index * 50)
      }
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
          router.prefetch(href)
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
