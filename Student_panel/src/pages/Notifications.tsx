import { MainLayout } from "@/components/layout/MainLayout";
import { Bell, CheckCircle2, Calendar, Briefcase, Users, MessageSquare, X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Notification {
  id: string;
  type: "event" | "job" | "connection" | "mentorship" | "announcement";
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  actionUrl?: string;
}

const notificationsData: Notification[] = [
  {
    id: "1",
    type: "mentorship",
    title: "Mentorship Request Accepted",
    description: "Sarah Chen has accepted your mentorship request. Schedule your first session!",
    time: "5 minutes ago",
    isRead: false,
  },
  {
    id: "2",
    type: "job",
    title: "New Job Match",
    description: "A new Software Engineer position at Google matches your profile (95% match).",
    time: "1 hour ago",
    isRead: false,
  },
  {
    id: "3",
    type: "event",
    title: "Event Reminder",
    description: "Tech Industry Insights 2026 webinar starts in 1 hour. Don't miss it!",
    time: "2 hours ago",
    isRead: false,
  },
  {
    id: "4",
    type: "connection",
    title: "New Connection",
    description: "Michael Park from Apple is now connected with you.",
    time: "Yesterday",
    isRead: true,
  },
  {
    id: "5",
    type: "announcement",
    title: "Campus Update",
    description: "Spring Career Fair registration is now open. Reserve your spot!",
    time: "2 days ago",
    isRead: true,
  },
];

const typeIcons = {
  event: Calendar,
  job: Briefcase,
  connection: Users,
  mentorship: MessageSquare,
  announcement: Bell,
};

const typeColors = {
  event: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  job: "bg-accent/20 text-accent border-accent/30",
  connection: "bg-primary/20 text-primary border-primary/30",
  mentorship: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  announcement: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(notificationsData);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-up">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30">
                <Bell className="h-6 w-6 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
              {unreadCount > 0 && (
                <Badge variant="neonViolet">{unreadCount} new</Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Stay updated with opportunities and connections
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4 stagger-children">
          {notifications.map((notification) => {
            const Icon = typeIcons[notification.type];
            return (
              <div
                key={notification.id}
                className={`glass-card p-5 transition-all duration-300 group ${
                  !notification.isRead
                    ? "border-primary/30 bg-primary/5"
                    : "hover:border-white/20"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border ${typeColors[notification.type]}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className="font-semibold text-foreground">
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                            title="Mark as read"
                          >
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground hover:text-primary" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                          title="Delete"
                        >
                          <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                      {!notification.isRead && (
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div className="glass-card p-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                All caught up!
              </h3>
              <p className="text-muted-foreground">
                No new notifications at the moment
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
