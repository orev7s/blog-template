"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"

export function PostsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const category = searchParams.get("category") || ""
  const status = searchParams.get("status") || ""

  const handleReset = () => {
    startTransition(() => {
      router.push("/admin/posts")
    })
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value
    const params = new URLSearchParams()
    if (newValue) params.set("category", newValue)
    if (status) params.set("status", status)
    const queryString = params.toString()
    startTransition(() => {
      router.push(queryString ? `/admin/posts?${queryString}` : "/admin/posts")
    })
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (newValue) params.set("status", newValue)
    const queryString = params.toString()
    startTransition(() => {
      router.push(queryString ? `/admin/posts?${queryString}` : "/admin/posts")
    })
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Select
        name="category"
        label="Category"
        value={category}
        onChange={handleCategoryChange}
        disabled={isPending}
      >
        <option value="">All</option>
        <option value="fixes">Fixes</option>
        <option value="thoughts">Thoughts</option>
        <option value="general">General</option>
      </Select>
      <Select
        name="status"
        label="Status"
        value={status}
        onChange={handleStatusChange}
        disabled={isPending}
      >
        <option value="">All</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </Select>
      <div className="flex items-end gap-2">
        <Button type="button" variant="secondary" onClick={handleReset} disabled={isPending}>
          Reset
        </Button>
        {isPending && <span className="text-xs text-muted-foreground animate-pulse">Filtering...</span>}
      </div>
    </div>
  )
}
