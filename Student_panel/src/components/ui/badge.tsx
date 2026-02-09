import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-medium transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-neon-violet",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-white/20",
        glass: "border-white/20 bg-white/10 backdrop-blur-sm text-foreground",
        neonViolet: "border-primary/50 bg-primary/20 text-primary shadow-neon-violet",
        neonCyan: "border-accent/50 bg-accent/20 text-accent shadow-neon-cyan",
        success: "border-emerald-500/50 bg-emerald-500/20 text-emerald-400",
        warning: "border-amber-500/50 bg-amber-500/20 text-amber-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
