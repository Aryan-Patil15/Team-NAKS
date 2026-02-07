import { useState } from "react";
import { Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pendingUsers, PendingUser } from "@/lib/mock-data";
import { toast } from "sonner";

export default function ApprovalQueue() {
  const [queue, setQueue] = useState<PendingUser[]>(pendingUsers);

  const handleApprove = (id: string) => {
    const user = queue.find((u) => u.id === id);
    setQueue((prev) => prev.filter((u) => u.id !== id));
    toast.success(`${user?.name} has been approved`, {
      description: "Welcome email sent automatically.",
    });
  };

  const handleReject = (id: string) => {
    const user = queue.find((u) => u.id === id);
    setQueue((prev) => prev.filter((u) => u.id !== id));
    toast.error(`${user?.name} has been rejected`, {
      description: "Denial notification sent.",
    });
  };

  if (queue.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center card-elevated">
        <Check className="h-12 w-12 text-primary mx-auto mb-4 opacity-60" />
        <p className="text-card-foreground font-medium">All caught up!</p>
        <p className="text-sm text-muted-foreground mt-1">No pending approvals right now.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {queue.map((user, index) => (
        <div
          key={user.id}
          className="rounded-xl border border-border bg-card p-4 card-elevated animate-fade-up flex items-center gap-4"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-primary">{user.avatarInitials}</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-card-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">
              {user.degree} · Class of {user.graduationYear}
            </p>
          </div>

          {/* Timestamp */}
          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Clock className="h-3 w-3" />
            {user.appliedAt}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => handleReject(user.id)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              className="h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => handleApprove(user.id)}
            >
              <Check className="h-4 w-4 mr-1" />
              Approve
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
