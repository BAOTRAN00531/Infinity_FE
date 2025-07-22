import * as React from "react"

import { cn } from "@/lib/utils"

const Input_admin = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
            "flex h-10 w-full rounded-md border border-input px-3 py-2 text-base",
            // nền trắng + chữ đen ở light mode; nền tối + chữ trắng ở dark mode
            "bg-white text-black dark:bg-black dark:text-white",
            "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-black dark:file:text-white placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input_admin.displayName = "Input_admin"

export { Input_admin }
