import { Pin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Announcement } from "@/types";

interface AnnouncementCardProps {
  announcement: Announcement;
}

const categoryStyles = {
  academic: "badge-academic",
  event: "badge-event",
  general: "badge-general",
  urgent: "badge-urgent",
};

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-border/50 bg-card p-5",
        "glow-card transition-smooth hover:border-border",
        announcement.isPinned && "ring-1 ring-primary/30"
      )}
    >
      {/* Title */}
      <div className="flex items-start justify-between mb-3 gap-2">
  <h3 className="text-base font-semibold text-foreground line-clamp-2">
    {announcement.title}
  </h3>

  {announcement.batch && (
    <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
      {announcement.batch}
    </span>
  )}
</div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {announcement.content}
        </p>

      {/* Date */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span>{announcement.date}</span>
      </div>
    </div>
  );
}

export function AnnouncementCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-16 rounded-full bg-secondary" />
      </div>
      <div className="h-5 w-full rounded bg-secondary mb-2" />
      <div className="h-5 w-2/3 rounded bg-secondary mb-3" />
      <div className="h-4 w-24 rounded bg-secondary" />
    </div>
  );
}
