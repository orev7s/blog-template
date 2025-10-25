"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Minimal, accessible dropdown implementation without external deps.
// API loosely mirrors shadcn/ui but simplified.

type DropdownMenuContextType = {
  open: boolean
  setOpen: (v: boolean) => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(null)

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ className, children }: React.HTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(DropdownMenuContext)!
  return (
    <button
      type="button"
      onClick={() => ctx.setOpen(!ctx.open)}
      className={cn("inline-flex items-center", className)}
    >
      {children}
    </button>
  )
}

export function DropdownMenuContent({ className, align = "start", children }: { className?: string; align?: "start" | "end"; children: React.ReactNode }) {
  const ctx = React.useContext(DropdownMenuContext)!
  if (!ctx.open) return null
  return (
    <div
      className={cn(
        "absolute z-50 mt-2 min-w-[10rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        align === "end" ? "right-0" : "left-0",
        className
      )}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ className, onClick, children }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(DropdownMenuContext)!
  return (
    <button
      type="button"
      onClick={(e) => {
        onClick?.(e as any)
        ctx.setOpen(false)
      }}
      className={cn(
        "flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      {children}
    </button>
  )
}
