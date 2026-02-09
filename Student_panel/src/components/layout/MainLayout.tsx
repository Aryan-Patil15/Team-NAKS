import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="min-h-screen animated-gradient-bg">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        {/* Floating orbs */}
        <div className="hidden md:block orb orb-violet w-96 h-96 -top-48 -left-48 animate-float" />
        <div className="hidden md:block orb orb-cyan w-80 h-80 top-1/3 -right-40 animate-float" style={{ animationDelay: "-3s" }} />
        <div className="hidden md:block orb orb-violet w-64 h-64 bottom-20 left-1/4 animate-float" style={{ animationDelay: "-5s" }} />
      </div>

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
      />

      {/* Main content */}
      <main className={`min-h-screen relative z-10 transition-all duration-500 ${collapsed ? "md:ml-20" : "md:ml-72"}`}>
        {/* Mobile top bar (shows on small screens) */}
        <div className="md:hidden p-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-foreground" />
          </button>
        </div>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
