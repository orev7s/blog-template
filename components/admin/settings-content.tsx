import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SettingsFormDynamic } from "@/app/admin/settings/settings-form-dynamic"

export async function SettingsContent() {
  const supabase = await createClient()

  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .in("key", ["signup_enabled", "owner_created"])

  const signupEnabled = settings?.find(s => s.key === "signup_enabled")?.value === true
  const ownerCreated = settings?.find(s => s.key === "owner_created")?.value === true

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Authentication Settings</CardTitle>
          <CardDescription>
            Control who can sign up for your blog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsFormDynamic 
            signupEnabled={signupEnabled} 
            ownerCreated={ownerCreated}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blog Information</CardTitle>
          <CardDescription>
            Your blog is running on Next.js 15 with Supabase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="font-semibold">Owner Account:</span>{" "}
            {ownerCreated ? "Created ✓" : "Not created yet"}
          </div>
          <div>
            <span className="font-semibold">Signup Status:</span>{" "}
            {signupEnabled ? "Enabled" : "Disabled"}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
