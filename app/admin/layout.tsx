import Link from "next/link"
import { ReactNode } from "react"
import { LayoutDashboard, FileText, PlusCircle, MessageSquare, BarChart3, Settings, Menu } from "lucide-react"
import LogoutButton from "@/components/admin/LogoutButton"
import { AdminPrefetch } from "@/components/admin/admin-prefetch"

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      prefetch={true}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
    >
      {children}
    </Link>
  )
}

function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card/50 p-4 md:block">
      <div className="mb-6 px-2">
        <h2 className="text-xl font-semibold font-serif">Admin</h2>
        <p className="text-sm text-muted-foreground">Blog Control Center</p>
      </div>
      <nav className="flex flex-col gap-1">
        <NavLink href="/admin">
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </NavLink>
        <NavLink href="/admin/posts">
          <FileText className="h-4 w-4" /> Posts
        </NavLink>
        <NavLink href="/admin/posts/new">
          <PlusCircle className="h-4 w-4" /> New Post
        </NavLink>
        <NavLink href="/admin/comments">
          <MessageSquare className="h-4 w-4" /> Comments
        </NavLink>
        <NavLink href="/admin/analytics">
          <BarChart3 className="h-4 w-4" /> Analytics
        </NavLink>
        <NavLink href="/admin/settings">
          <Settings className="h-4 w-4" /> Settings
        </NavLink>
      </nav>
    </aside>
  )
}

function MobileSidebar() {
  return (
    <details className="md:hidden">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm">
        <Menu className="h-4 w-4" /> Menu
      </summary>
      <div className="mt-2 rounded-md border bg-card p-2">
        <nav className="flex flex-col gap-1">
          <NavLink href="/admin">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </NavLink>
          <NavLink href="/admin/posts">
            <FileText className="h-4 w-4" /> Posts
          </NavLink>
          <NavLink href="/admin/posts/new">
            <PlusCircle className="h-4 w-4" /> New Post
          </NavLink>
          <NavLink href="/admin/comments">
            <MessageSquare className="h-4 w-4" /> Comments
          </NavLink>
          <NavLink href="/admin/analytics">
            <BarChart3 className="h-4 w-4" /> Analytics
          </NavLink>
          <NavLink href="/admin/settings">
            <Settings className="h-4 w-4" /> Settings
          </NavLink>
        </nav>
      </div>
    </details>
  )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Auth check handled by middleware for instant navigation
  return (
    <div className="min-h-screen bg-background">
      {/* Aggressively prefetch ALL admin pages */}
      <AdminPrefetch />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
            <div className="flex items-center justify-between gap-2 px-4 py-3">
              <MobileSidebar />
              <div className="ml-auto flex items-center gap-2">
                <LogoutButton />
              </div>
            </div>
          </header>
          <div className="flex-1 mx-auto max-w-7xl p-4 md:p-6 lg:p-8 w-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
