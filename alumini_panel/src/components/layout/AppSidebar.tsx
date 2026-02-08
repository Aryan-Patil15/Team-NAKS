import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useSidebarState } from "./AppLayout";
import {
  Home,
  Users,
  Briefcase,
  Calendar,
  Settings,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  User,
  Building,
  Building2,
  LucideBuilding2,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Networking", url: "/networking", icon: Users },
  { title: "Jobs", url: "/jobs", icon: Briefcase },
  {title:"Alumni Directory", url:"/alumini", icon: GraduationCap},
  {title:"Job Hub", url:"/mentorship", icon: LucideBuilding2},
  { title: "Events", url: "/events", icon: Calendar },
  {title:"Chat", url:"/chat", icon: MessageSquare},
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { collapsed, setCollapsed } = useSidebarState();
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col transition-all duration-300 ease-in-out border-r border-border/40",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
      style={{
        background: "hsl(222 50% 5% / 0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-border/30">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-electric shadow-lg"
          style={{ boxShadow: "0 0 20px hsl(210 100% 56% / 0.3)" }}
        >
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <p className="text-sm font-bold text-foreground tracking-tight">
              AlumniHub
            </p>
            <p className="text-[11px] text-muted-foreground font-mono">
              v2.0 · Dashboard
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.url === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.url);

          return (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "/"}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                collapsed && "justify-center px-0",
                isActive && "neon-active bg-primary/10 text-primary"
              )}
              activeClassName=""
            >
              <item.icon className={cn(
                "h-5 w-5 shrink-0 transition-colors duration-200",
                isActive && "text-primary drop-shadow-[0_0_6px_hsl(210_100%_56%/0.6)]"
              )} />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-3 mb-4 flex items-center justify-center gap-2 rounded-lg border border-border/40 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 hover:border-primary/30 transition-all duration-200"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : (
          <>
            <ChevronLeft className="h-4 w-4" />
            <span className="font-mono">Collapse</span>
          </>
        )}
      </button>
    </aside>
  );
}
