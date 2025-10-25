"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface NativeSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, children, label, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label ? (
          <div className="mb-1 text-sm font-medium text-foreground">{label}</div>
        ) : null}
        <select
          ref={ref}
          className={cn(
            "h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm appearance-none bg-no-repeat focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "bg-[position:right_0.75rem_center] bg-[length:1rem]",
            // Light mode arrow (dark gray)
            "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%233c3c3c%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')]",
            // Dark mode arrow (light gray)
            "dark:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23e0e0e0%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')]",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {helperText ? (
          <div className="mt-1 text-xs text-muted-foreground">{helperText}</div>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
