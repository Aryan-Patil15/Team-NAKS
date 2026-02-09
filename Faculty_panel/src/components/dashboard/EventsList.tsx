import { useState, useEffect } from "react";
import { MapPin, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUpcomingEvents, subscribeToEvents } from "@/lib/firestore";
import type { Event } from "@/types";

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Initial Load
    getUpcomingEvents(5).then((data) => {
      if (isMounted) {
        setEvents(data);
        setLoading(false);
      }
    }).catch(err => {
      console.error("Failed to load events", err);
      if (isMounted) setLoading(false);
    });

    // 2. Real-time Subscription
    const unsubscribe = subscribeToEvents((data) => {
      if (isMounted) {
        setEvents(data.slice(0, 5));
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (loading) return <EventsListSkeleton />;

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center rounded-lg bg-secondary/30 border border-border/30">
        <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-muted-foreground text-sm">No upcoming events scheduled.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event, index) => {
        // Robust Date Parsing
        const eventDate = new Date(event.date);
        const isValidDate = !isNaN(eventDate.getTime());
        const month = isValidDate ? eventDate.toLocaleDateString("en-US", { month: "short" }) : "N/A";
        const day = isValidDate ? eventDate.getDate() : "--";
        const displayTime = event.time || eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
          <div
            key={event.id}
            className={cn(
              "flex items-start gap-4 p-4 rounded-lg",
              "bg-secondary/30 border border-border/30",
              "transition-smooth hover:bg-secondary/50 hover:border-border/50",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Date Badge */}
            <div className="flex flex-col items-center justify-center min-w-[50px] py-1 px-2 rounded-lg bg-primary/10 text-primary">
              <span className="text-xs font-medium uppercase">
                {month}
              </span>
              <span className="text-xl font-bold">
                {day}
              </span>
            </div>

            {/* Event Details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground mb-1 truncate">
                {event.title}
              </h4>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {displayTime}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {event.location}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function EventsListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 animate-pulse"
        >
          <div className="h-14 w-12 rounded-lg bg-secondary" />
          <div className="flex-1">
            <div className="h-5 w-3/4 rounded bg-secondary mb-2" />
            <div className="h-4 w-1/2 rounded bg-secondary" />
          </div>
        </div>
      ))}
    </div>
  );
}