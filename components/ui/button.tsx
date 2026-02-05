import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-[#1e3a8a] text-white border-2 border-transparent shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 hover:border-white/20",
        destructive:
          "bg-red-600 text-white shadow-[4px_4px_0px_0px_rgba(153,27,27,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 border-2 border-red-800",
        outline:
          "border-2 border-[#1e3a8a] bg-transparent text-[#1e3a8a] shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] hover:bg-blue-50 hover:shadow-none hover:translate-x-1 hover:translate-y-1",
        secondary:
          "bg-[#8bb9e0] text-[#1e3a8a] border-2 border-[#1e3a8a] shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1",
        ghost: "hover:bg-blue-100 text-[#1e3a8a]",
        link: "text-[#1e3a8a] underline-offset-4 hover:underline",
        glass: "bg-[#005d9c]/80 backdrop-blur-md border-2 border-[#1e3a8a] text-[#1e3a8a] shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] hover:bg-[#005d9c] hover:shadow-none hover:translate-x-1 hover:translate-y-1",
      },
      size: {
        default: "h-12 px-6 py-2 text-base",
        sm: "h-9 rounded-xl px-4 text-xs",
        lg: "h-14 rounded-3xl px-10 text-lg",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
