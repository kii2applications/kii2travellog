
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "outlined" | "underlined"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    const baseClasses = "flex w-full bg-transparent text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 font-system"
    
    const variantClasses = {
      default: "h-10 rounded-lg border border-gray-600 px-3 py-2 focus-visible:border-white focus-visible:ring-0 transition-colors bg-black text-white",
      outlined: "h-10 rounded-lg border border-gray-600 px-3 py-2 focus-visible:border-white focus-visible:ring-0 transition-colors bg-black text-white",
      underlined: "h-10 border-0 border-b border-gray-600 px-0 py-2 focus-visible:border-white focus-visible:ring-0 transition-colors rounded-none bg-transparent text-white"
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
