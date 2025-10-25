"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

declare global {
  interface Window {
    navigationLoadingVisible?: boolean
  }
}

export function NavigationLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Store original push method
    const originalPush = (router as any).push.bind(router)

    // Override push to show loading indicator
    ;(router as any).push = function (href: string, options?: any) {
      setIsLoading(true)
      window.navigationLoadingVisible = true

      // Reset after 5 seconds (fallback for slow pages)
      const timeout = setTimeout(() => {
        setIsLoading(false)
        window.navigationLoadingVisible = false
      }, 5000)

      // Call original push and handle promise
      const result = originalPush(href, options)
      
      // If result is a promise, wait for it
      if (result && typeof result.then === "function") {
        result.finally(() => {
          clearTimeout(timeout)
          setTimeout(() => {
            setIsLoading(false)
            window.navigationLoadingVisible = false
          }, 100)
        })
      }

      return result
    }

    return () => {
      // Cleanup - restore original push if needed
    }
  }, [router])

  if (!isLoading) return null

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse z-50" />
      {/* Slight dimming overlay */}
      <div className="fixed inset-0 bg-background/5 pointer-events-none z-40" />
    </>
  )
}
