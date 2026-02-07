import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  variant?: "default" | "primary" | "accent" | "info";
  delay?: number;
}

const iconVariants = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  accent: "bg-primary/10 text-primary",
  info: "bg-primary/10 text-primary",
};

export default function MetricCard({
  label,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  delay = 0,
}: MetricCardProps) {
  return (
    <div
      className="rounded-xl glass-card card-gradient-border p-5 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${iconVariants[variant]}`}>
          <Icon className={`h-5 w-5 ${variant !== "default" ? "icon-glow" : ""}`} />
        </div>
        {trend && (
          <span
            className={`text-xs font-mono font-medium px-2 py-1 rounded-md ${
              trend.positive
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {trend.positive ? "+" : ""}{trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-card-foreground tracking-tight font-mono">
          {value}
        </p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground/60 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
