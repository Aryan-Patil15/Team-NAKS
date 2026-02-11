import { Calendar, Clock, Video, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Session {
  id: string;
  title: string;
  mentor: string;
  time: string;
  date: string;
  type: "video" | "in-person";
}

const upcomingSessions: Session[] = [
  {
    id: "1",
    title: "Career Guidance Session",
    mentor: "Sarah Chen",
    time: "10:00 AM",
    date: "Today",
    type: "video",
  },
  {
    id: "2",
    title: "Resume Review",
    mentor: "Michael Park",
    time: "2:30 PM",
    date: "Tomorrow",
    type: "video",
  },
  {
    id: "3",
    title: "Industry Insights",
    mentor: "Emily Watson",
    time: "11:00 AM",
    date: "Feb 8",
    type: "in-person",
  },
];

export function CalendarWidget() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20 neon-border-violet">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Upcoming Sessions</h3>
            <p className="text-xs text-muted-foreground">Mentorship meetings</p>
          </div>
        </div>
        <Badge variant="neonViolet">{upcomingSessions.length} scheduled</Badge>
      </div>

      <div className="space-y-4">
        {upcomingSessions.map((session, index) => (
          <div
            key={session.id}
            className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                {session.title}
              </h4>
              {session.type === "video" ? (
                <Video className="h-4 w-4 text-accent" />
              ) : (
                <Users className="h-4 w-4 text-primary" />
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              with {session.mentor}
            </p>
            
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{session.time}</span>
              </div>
              <Badge variant={session.date === "Today" ? "neonCyan" : "glass"} className="text-xs">
                {session.date}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-3 rounded-xl border border-white/10 text-muted-foreground hover:border-primary/30 hover:text-primary transition-all duration-300 text-sm font-medium">
        View All Sessions
      </button>
    </div>
  );
}
