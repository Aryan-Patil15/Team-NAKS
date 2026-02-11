import { Users, Briefcase, Calendar, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    title: "Find Alumni",
    description: "Connect with graduates",
    icon: Users,
    href: "/alumni",
    gradient: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
  },
  {
    title: "Browse Jobs",
    description: "Explore opportunities",
    icon: Briefcase,
    href: "/jobs",
    gradient: "from-accent/20 to-accent/5",
    iconBg: "bg-accent/20",
    iconColor: "text-accent",
  },
  {
    title: "Upcoming Events",
    description: "Join webinars & workshops",
    icon: Calendar,
    href: "/events",
    gradient: "from-emerald-500/20 to-emerald-500/5",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    title: "View Profile",
    description: "Enhance your visibility",
    icon: FileText,
    href: "/profile",
    gradient: "from-amber-500/20 to-amber-500/5",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <Link
          key={action.title}
          to={action.href}
          className="glass-card-hover p-4 sm:p-5 group"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${action.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <action.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${action.iconColor}`} />
          </div>
          
          <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {action.title}
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            {action.description}
          </p>
          
          <div className="flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Explore</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      ))}
    </div>
  );
}
