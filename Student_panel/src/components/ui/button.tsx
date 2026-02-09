import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon-violet hover:shadow-neon-violet-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-primary/50 hover:shadow-neon-violet",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-white/10 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        neonViolet: "bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30 hover:shadow-neon-violet backdrop-blur-sm",
        neonCyan: "bg-accent/20 border border-accent/50 text-accent hover:bg-accent/30 hover:shadow-neon-cyan backdrop-blur-sm",
        glass: "glass border-white/20 hover:border-primary/40 hover:shadow-neon-violet",
        gradient: "bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-lg hover:shadow-neon-violet",
      },
      size: {
        default: "h-9 sm:h-10 px-4 sm:px-5 py-2",
        sm: "h-8 sm:h-9 rounded-lg px-3",
        lg: "h-11 sm:h-12 rounded-xl px-6 sm:px-8 text-base",
        xl: "h-12 sm:h-14 rounded-2xl px-8 sm:px-10 text-lg",
        icon: "h-9 w-9 sm:h-10 sm:w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
