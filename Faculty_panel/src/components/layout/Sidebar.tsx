import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Calendar,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/alumni", label: "Alumni Directory", icon: Users },
  { path: "/announcements", label: "Job And Research", icon: Megaphone },
  { path: "/events", label: "Events", icon: Calendar },
];

type FacultyProfile = {
  name: string;
  title: string;
};

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [faculty, setFaculty] = useState<FacultyProfile>({
    name: "Loading...",
    title: "",
  });

  /* ---------------- COOKIE HELPERS ---------------- */

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; Max-Age=0; path=/`;
  };

  const facultyId = getCookie("facultyId");

  /* ---------------- LOAD FACULTY BY ID ---------------- */

  useEffect(() => {
    if (!facultyId) {
      navigate("/");
      return;
    }

    async function loadFaculty() {
      try {
        const ref = doc(db, "faculty", facultyId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          setFaculty({
            name: String(data.name ?? ""),
            title: String(data.title ?? ""),
          });
        }
      } catch (e) {
        console.error("Faculty fetch failed:", e);
      }
    }

    loadFaculty();
  }, [facultyId, navigate]);

  /* ---------------- LOGOUT ---------------- */

  function handleLogout() {
    deleteCookie("facultyId"); // ✅ CORRECT COOKIE NAME
    navigate("/");
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen glass border-r border-border/50 transition-all duration-300 flex flex-col",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <GraduationCap className="h-5 w-5" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-foreground animate-fade-in">
              Alumni-Meet
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth",
                "hover:bg-secondary/80",
                isActive
                  ? "bg-primary/10 text-primary shadow-glow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
              {!collapsed && <span className="animate-fade-in">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Profile */}
      <div className="mt-auto border-t border-border/50 p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex w-full items-center gap-2 px-2 hover:bg-secondary/50 transition-smooth"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/20 text-primary text-sm">
                  {faculty.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              {!collapsed && (
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">
                    {faculty.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {faculty.title}
                  </p>
                </div>
              )}

              {!collapsed && (
                <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 glass">
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive transition-smooth hover:bg-destructive/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
