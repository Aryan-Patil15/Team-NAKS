import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Background glow effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-64 right-0 h-[300px] bg-[radial-gradient(ellipse_at_50%_0%,hsl(217_91%_60%_/_0.04),transparent_70%)]" />
      </div>
      <Sidebar />
      <main className="ml-64 min-h-screen relative">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
