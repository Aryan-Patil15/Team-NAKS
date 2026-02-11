import { NavLink, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  MessageSquare,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Alumni Network", href: "/alumni", icon: Users },
  { title: "Jobs & Internships", href: "/jobs", icon: Briefcase },
  { title: "Events", href: "/events", icon: Calendar },
  { title: "Chat", href: "/chat", icon: MessageSquare },
  { title: "Notifications", href: "/notifications", icon: Bell, hasBadge: true },
];

export function Sidebar({
  mobileOpen,
  onClose,
  collapsed,
  onToggleCollapsed,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}) {
  const location = useLocation();

  return (
    <>
      {/* 1. Backdrop: Fixed to only show on mobile when open */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] md:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen transition-all duration-300 ease-in-out transform border-r border-white/10 bg-[#09090b]",
          // 2. Mobile positioning vs Desktop positioning
          mobileOpen ? "translate-x-0 z-[60] w-[280px]" : "-translate-x-full md:translate-x-0 z-40",
          // 3. Desktop widths
          collapsed ? "md:w-20" : "md:w-72"
        )}
      >
        <div className="absolute inset-0 glass">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />
        </div>

        <div className="relative flex h-full flex-col">
          {/* Logo Section */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-white/10">
            <div className={cn("flex items-center gap-3 transition-all duration-300", collapsed && "md:opacity-0 md:w-0 overflow-hidden")}>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
                <GraduationCap className="relative h-8 w-8 text-primary" />
              </div>
              <span className="font-bold text-lg gradient-text whitespace-nowrap">Alumni-Meet</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile Close Button */}
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 md:hidden">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
              {/* Desktop Toggle Button */}
              <button
                onClick={() => onToggleCollapsed?.()}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors hidden md:inline-flex"
              >
                {collapsed ? <ChevronRight className="h-5 w-5 text-muted-foreground" /> : <ChevronLeft className="h-5 w-5 text-muted-foreground" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto scrollbar-none">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  // 4. Auto-close sidebar on mobile after clicking a link
                  onClick={() => { if (window.innerWidth < 768) onClose?.(); }}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative",
                    isActive ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-neon-violet" />
                  )}
                  
                  <div className="relative shrink-0">
                    <item.icon className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isActive ? "text-primary" : "group-hover:text-primary"
                    )} />
                    {item.hasBadge && (
                      <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-accent rounded-full border-2 border-[#09090b]" />
                    )}
                  </div>
                  
                  <span className={cn(
                    "font-medium transition-all duration-300 whitespace-nowrap",
                    collapsed ? "md:opacity-0 md:w-0 overflow-hidden" : "opacity-100"
                  )}>
                    {item.title}
                  </span>
                </NavLink>
              );
            })}
          </nav>

          {/* Profile Section */}
          <div className="p-4 border-t border-white/10">
            <NavLink
              to="/profile"
              onClick={() => { if (window.innerWidth < 768) onClose?.(); }}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative",
                location.pathname === "/profile"
                  ? "bg-primary/20 text-primary shadow-neon-violet"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <User className="h-5 w-5 shrink-0" />
              <span className={cn(
                "font-medium transition-all duration-300 whitespace-nowrap",
                collapsed ? "md:opacity-0 md:w-0 overflow-hidden" : "opacity-100"
              )}>
                Profile
              </span>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}