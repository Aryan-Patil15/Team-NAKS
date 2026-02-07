import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  GraduationCap,
  Users,
  UserCheck,
  Settings,
  CheckCircle,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* 🍪 Cookie helpers */
const getCookie = (name: string) =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
};

const mainNav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/announcements", icon: Megaphone, label: "Events" },
  { to: "/jobapproval", icon: CheckCircle, label: "Job Approval" },
  { to: "/donation", icon: GraduationCap, label: "Donation" },
];

const listsNav = [
  { to: "/students", icon: Users, label: "Students List" },
  { to: "/alumni", icon: UserCheck, label: "Alumni List" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const navigate = useNavigate();

  /* 🔹 Read admin username from cookie */
  useEffect(() => {
    const id = getCookie("admin_session");
    setAdminId(id ?? "Admin");
  }, []);

  /* 🔹 LOGOUT HANDLER */
  const handleLogout = async () => {
    const admin = getCookie("admin_session");

    try {
      if (admin) {
        await updateDoc(doc(db, "admin", admin), {
          status: "inactive",
        });
      }

      deleteCookie("admin_session");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass-sidebar flex flex-col z-50">
      {/* Brand Header */}
      <div className="p-6 border-b border-sidebar-border/40">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center animate-glow-pulse">
            <GraduationCap className="h-5 w-5 text-primary icon-glow" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">
              Alumini Association
            </h1>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.15em]">
              Alumni Admin
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {mainNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-nav-item ${
                  isActive
                    ? "bg-primary/10 text-primary neon-active"
                    : "text-sidebar-foreground hover:text-foreground hover:bg-muted/40"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`h-4 w-4 ${isActive ? "icon-glow" : ""}`} />
                  <span>{item.label}</span>
                  {isActive && <div className="neon-dot ml-auto" />}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="mt-4">
          {listsNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-nav-item ${
                  isActive
                    ? "bg-primary/10 text-primary neon-active"
                    : "text-sidebar-foreground hover:text-foreground hover:bg-muted/40"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`h-4 w-4 ${isActive ? "icon-glow" : ""}`} />
                  <span>{item.label}</span>
                  {isActive && <div className="neon-dot ml-auto" />}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer - Admin Profile */}
      <div className="relative p-4 border-t border-sidebar-border/40">
        <div
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
        >
          <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center ring-1 ring-primary/20">
            <span className="text-xs font-semibold text-primary font-mono">
              {adminId?.charAt(3)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{adminId}</p>
          </div>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* 🔽 Logout Popup */}
        {open && (
          <div className="absolute bottom-20 left-4 right-4 bg-card border border-border rounded-lg shadow-lg">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
