"use client"

import { useActionState } from "react"
import { updateSettingsAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface SettingsFormProps {
  signupEnabled: boolean
  ownerCreated: boolean
}

export function SettingsForm({ signupEnabled, ownerCreated }: SettingsFormProps) {
  const [state, formAction] = useActionState(updateSettingsAction, null)

  return (
    <form action={formAction} className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="signup_enabled"
          name="signup_enabled"
          defaultChecked={signupEnabled}
        />
        <Label htmlFor="signup_enabled" className="cursor-pointer">
          Enable signup for new users
        </Label>
      </div>
      
      <p className="text-sm text-muted-foreground">
        {ownerCreated 
          ? "The owner account has been created. Enabling signup will allow additional users to register."
          : "No owner account yet. The first signup will automatically become the owner."}
      </p>

      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      
      {state?.success && (
        <p className="text-sm text-green-600" role="alert">
          Settings updated successfully!
        </p>
      )}

      <Button type="submit">
        Save Settings
      </Button>
    </form>
  )
}
