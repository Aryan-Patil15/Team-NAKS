import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradientClass?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  gradientClass = "stat-gradient-blue",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-border/50 bg-card p-6",
        "glow-card glow-border transition-smooth",
        gradientClass
      )}
    >
      {/* Icon */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {/* Value */}
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>

      {/* Label */}
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="relative rounded-xl border border-border/50 bg-card p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-12 w-12 rounded-xl bg-secondary" />
        <div className="h-5 w-12 rounded bg-secondary" />
      </div>
      <div className="h-9 w-24 rounded bg-secondary mb-2" />
      <div className="h-4 w-32 rounded bg-secondary" />
    </div>
  );
}
