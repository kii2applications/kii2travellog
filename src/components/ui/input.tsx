
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "outlined" | "underlined"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "outlined", ...props }, ref) => {
    const baseClasses = "flex w-full bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 font-system"
    
    const variantClasses = {
      default: "h-10 rounded-md border border-input px-3 py-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      outlined: "h-12 rounded-lg border border-gray-300 px-4 py-3 focus-visible:border-blue-500 focus-visible:ring-0 transition-colors bg-white",
      underlined: "h-12 border-0 border-b-2 border-gray-300 px-0 py-3 focus-visible:border-blue-500 focus-visible:ring-0 transition-colors rounded-none bg-transparent"
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
