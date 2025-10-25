import { createClient } from "@/lib/supabase/server"
import { SignupForm } from "./signup-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function SignupPage() {
  const supabase = await createClient()

  // Check if signup is enabled
  const { data: settings } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "signup_enabled")
    .single()

  const signupEnabled = settings?.value === true || settings?.value === "true"

  if (!signupEnabled) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-georgia text-2xl">Signup Disabled</CardTitle>
            <CardDescription>This blog is currently not accepting new signups</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Signup is currently disabled. Only the owner can access this blog.
            </p>
            <Link href="/login" prefetch={true} className="text-sm text-primary hover:underline">
              Already have an account? Login here
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-georgia text-2xl">Create Account</CardTitle>
          <CardDescription>Sign up to become the blog owner</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  )
}
