"use client"

import dynamic from "next/dynamic"

const SettingsForm = dynamic(() => import("./settings-form").then(mod => ({ default: mod.SettingsForm })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center gap-2">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span className="text-sm text-muted-foreground">Loading form...</span>
    </div>
  ),
})

interface SettingsFormDynamicProps {
  signupEnabled: boolean
  ownerCreated: boolean
}

export function SettingsFormDynamic(props: SettingsFormDynamicProps) {
  return <SettingsForm {...props} />
}
