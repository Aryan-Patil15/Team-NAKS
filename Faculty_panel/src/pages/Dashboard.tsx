import { useEffect, useState } from "react";
import { Users, Activity, Calendar, Megaphone, Bell } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/StatCard";
import {
  AnnouncementCard,
  AnnouncementCardSkeleton,
} from "@/components/dashboard/AnnouncementCard";
import { EventsList, EventsListSkeleton } from "@/components/dashboard/EventsList";

import type { Announcement, Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

/* ---------------- STATS TYPE ---------------- */

type StatItem = {
  label: string;
  value: number;
  iconName: "users" | "activity" | "calendar" | "megaphone";
};

const iconMap = {
  users: Users,
  activity: Activity,
  calendar: Calendar,
  megaphone: Megaphone,
};

const gradientMap = [
  "stat-gradient-blue",
  "stat-gradient-green",
  "stat-gradient-amber",
  "stat-gradient-purple",
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<StatItem[]>([]);

  // NOTE: We don't need 'events' state here anymore if EventsList fetches its own data.
  // We only fetch eventsSnap to get the *count* for the stats.

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      /* ================= 1. FETCH COLLECTIONS ================= */
      
      // 1. Events (For Count Only)
      const eventsSnap = await getDocs(collection(db, "events"));

      // 2. Alumni (For Total Count) - FIX: Fetching the correct collection
      // Ensure your Firestore collection is named "alumini" (or "alumni")
      const alumniSnap = await getDocs(collection(db, "alumini"));

      // 3. Students (For Total Count)
      const studentSnap = await getDocs(collection(db, "student"));

      /* ================= SUCCESS FEED ================= */

      const successSnap = await getDocs(
        query(collection(db, "success_feed"), orderBy("createdAt", "desc"), limit(4))
      );

      const successData: Announcement[] = successSnap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: String(data.author ?? "Alumni Story"),
          // Mapping 'batch' or 'yearOfPassing' if available
          batch: String(data.batch ?? data.yearOfPassing ?? ""), 
          content: String(data.content ?? ""),   
          date: data.createdAt ? data.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString(),
          category: "general", // Required by Announcement Type
          isPinned: false,
          priority: "medium",
        };
      });
      setAnnouncements(successData);

      /* ================= SET STATS ================= */

      setStats([
        {
          label: "Total Alumni",
          value: alumniSnap.size, // FIX: Using the real Alumni count
          iconName: "users",
        },
        {
          label: "Events",
          value: eventsSnap.size,
          iconName: "calendar",
        },
        {
          label: "Total Students",
          value: studentSnap.size,
          iconName: "activity",
        },
        {
          label: "Success Stories",
          value: successSnap.size,
          iconName: "megaphone",
        },
      ]);
    } catch (e) {
      console.error("Dashboard error:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back</p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground transition-smooth"
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground border-0">
            3
          </Badge>
        </Button>
        </div>
    </header>

      <div className="p-6 space-y-6">
        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <StatCardSkeleton key={i} />
              ))
            : stats.map((s, i) => (
                <StatCard
                  key={s.label}
                  label={s.label}
                  value={s.value}
                  icon={iconMap[s.iconName]}
                  gradientClass={gradientMap[i]}
                  // Fix: Passing trend object if your StatCard expects it
                  trend={{ value: 0, isPositive: true }}
                />
              ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alumni Success Stories */}
          <section className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-foreground">
              Alumni Success Stories
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <AnnouncementCardSkeleton key={i} />
                  ))
                : announcements.map((a) => (
                    <AnnouncementCard key={a.id} announcement={a} />
                  ))}
            </div>
          </section>

          {/* Events Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-foreground">Upcoming Events</h2>

            <div className="rounded-xl border bg-card p-4">
              {/* FIX: Removed 'events' prop since EventsList fetches its own data */}
              {loading ? <EventsListSkeleton /> : <EventsList />}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}