import { Suspense } from "react"
import { SettingsContent } from "@/components/admin/settings-content"

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-48 rounded-lg border bg-card animate-pulse" />
      <div className="h-32 rounded-lg border bg-card animate-pulse" />
    </div>
  )
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-georgia">Settings</h1>
      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsContent />
      </Suspense>
    </div>
  )
}
