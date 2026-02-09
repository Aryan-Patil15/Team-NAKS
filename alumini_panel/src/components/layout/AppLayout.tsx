import { useState, createContext, useContext, ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
});

export const useSidebarState = () => useContext(SidebarContext);

export function AppLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="min-h-screen flex w-full relative">
        {/* Ambient background glow */}
        <div 
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 50% 0%, hsl(210 100% 56% / 0.06) 0%, transparent 70%)",
          }}
        />
        <AppSidebar />
        <main
          className="flex-1 transition-all duration-300 relative z-10"
          style={{ marginLeft: collapsed ? 72 : 240 }}
        >
          <div className="max-w-6xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
