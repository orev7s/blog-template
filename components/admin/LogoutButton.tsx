"use client"

import { useTransition } from "react"
import { LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()
  const handleLogout = () => {
    startTransition(async () => {
      await supabase.auth.signOut()
      window.location.href = "/login"
    })
  }
  return (
    <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2" disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          Logout
        </>
      )}
    </Button>
  )
}
