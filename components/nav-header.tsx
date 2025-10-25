"use client"

import Link from "next/link"
import { Sun, Moon, LayoutDashboard } from "lucide-react"
import { useTheme } from "next-themes"

interface NavHeaderProps {
  showAdminButton?: boolean
}

export function NavHeader({ showAdminButton = false }: NavHeaderProps) {
  const { theme, setTheme, systemTheme } = useTheme()

  function toggleTheme() {
    const t = theme === "system" ? systemTheme : theme
    setTheme(t === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-8 md:py-4">
        <Link href="/" prefetch={true} className="font-semibold text-lg hover:text-foreground/80 transition-colors">
          Personal Blog
        </Link>

        <div className="flex items-center gap-2">
          {showAdminButton && (
            <Link
              href="/admin"
              prefetch={true}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 hover:bg-secondary transition-colors text-sm"
              title="Admin Dashboard"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}
          <button
            aria-label="Toggle dark mode"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-secondary transition-colors"
            onClick={toggleTheme}
            title="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
        </div>
      </div>
    </header>
  )
}
