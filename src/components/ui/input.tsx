
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "outlined" | "underlined"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    const baseClasses = "flex w-full bg-input text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 font-system transition-smooth"
    
    const variantClasses = {
      default: "h-11 rounded-xl border border-border px-4 py-2.5 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20",
      outlined: "h-11 rounded-xl border border-border px-4 py-2.5 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 bg-background",
      underlined: "h-11 border-0 border-b border-border px-0 py-2.5 focus-visible:border-ring rounded-none bg-transparent"
    }

    return (
      <input
        type={type}
        className={cn(baseClasses, variantClasses[variant], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
