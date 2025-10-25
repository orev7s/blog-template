"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <label className={cn("inline-flex items-center gap-2", className)}>
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring",
            "accent-[hsl(var(--primary))]"
          )}
          {...props}
        />
        <span className="text-sm text-foreground">
          {props["aria-label"] || props.title}
        </span>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
