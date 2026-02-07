import { motion } from "framer-motion";
import { TrendingUp, Users, Briefcase, CalendarCheck } from "lucide-react";

const stats = [
  { label: "Alumni Network", value: "12,450", change: "+320 this month", icon: Users, color: "text-primary" },
  { label: "Job Referrals", value: "87", change: "+12 this week", icon: Briefcase, color: "text-info" },
  { label: "Events Hosted", value: "24", change: "3 upcoming", icon: CalendarCheck, color: "text-success" },
  { label: "Donations Raised", value: "$1.2M", change: "78% of goal", icon: TrendingUp, color: "text-gold" },
];

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="stat-card group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-widest">
              {stat.label}
            </span>
            <div className={`h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground tracking-tight mt-1">{stat.value}</p>
          <p className="text-xs text-muted-foreground font-mono">{stat.change}</p>
        </motion.div>
      ))}
    </div>
  );
}
