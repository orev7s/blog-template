"use client"

import { useTransition, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { schedulePrefetch } from "@/lib/prefetch-utils"
import { cn } from "@/lib/utils"

interface Tab {
  label: string
  value?: string
}

const TABS: Tab[] = [
  { label: "All", value: undefined },
  { label: "Fixes", value: "fixes" },
  { label: "Thoughts", value: "thoughts" },
  { label: "General", value: "general" },
]

export function CategoryTabs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const prefetchedRef = useRef(new Set<string>())

  const categoryParam = searchParams.get("category")
  const currentCategory = categoryParam || undefined

  // AGGRESSIVELY prefetch ALL category pages on mount
  useEffect(() => {
    TABS.forEach((tab, index) => {
      const url = tab.value ? `/?category=${tab.value}` : "/"
      if (prefetchedRef.current.has(url)) return
      prefetchedRef.current.add(url)

      const delay = index === 0 ? 0 : index * 35
      schedulePrefetch(() => {
        void router.prefetch(url)
      }, delay)
    })
  }, [router])

  const handleTabChange = (value?: string) => {
    startTransition(() => {
      const params = new URLSearchParams()
      if (value) {
        params.set("category", value)
      }
      const queryString = params.toString()
      router.push(queryString ? `/?${queryString}` : "/")
    })
  }

  const isActive = (tabValue?: string) => {
    if (tabValue === undefined) {
      return currentCategory === undefined || currentCategory === null
    }
    return currentCategory === tabValue
  }

  return (
    <nav className={cn("mb-4 flex gap-2", isPending && "opacity-60 pointer-events-none")}>
      {TABS.map((tab) => (
        <button
          key={tab.label}
          onClick={() => handleTabChange(tab.value)}
          className={cn(
            "rounded-md px-3 py-2 text-sm hover:bg-secondary transition-colors",
            isActive(tab.value) ? "text-foreground" : "text-muted-foreground"
          )}
          disabled={isPending}
        >
          {tab.label}
        </button>
      ))}
      {isPending && <span className="ml-auto text-xs text-muted-foreground animate-pulse">Loading...</span>}
    </nav>
  )
}
