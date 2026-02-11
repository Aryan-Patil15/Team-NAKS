import { useState } from "react";
import { Check, X, Briefcase, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pendingJobs, PendingJob } from "@/lib/mock-data";
import { toast } from "sonner";

const typeBadgeStyles: Record<string, string> = {
  "Full-time": "bg-primary/10 text-primary border-primary/20",
  "Part-time": "bg-info/10 text-info border-info/20",
  Internship: "bg-accent/10 text-accent border-accent/20",
  Contract: "bg-muted text-muted-foreground border-border",
};

export default function JobModeration() {
  const [jobs, setJobs] = useState<PendingJob[]>(pendingJobs);

  const handleApprove = (id: string) => {
    const job = jobs.find((j) => j.id === id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
    toast.success(`"${job?.title}" approved and published`);
  };

  const handleReject = (id: string) => {
    const job = jobs.find((j) => j.id === id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
    toast.error(`"${job?.title}" rejected`);
  };

  if (jobs.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center card-elevated">
        <Briefcase className="h-12 w-12 text-primary mx-auto mb-4 opacity-60" />
        <p className="text-card-foreground font-medium">No pending jobs</p>
        <p className="text-sm text-muted-foreground mt-1">All job postings have been reviewed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job, index) => (
        <div
          key={job.id}
          className="rounded-xl border border-border bg-card p-5 card-elevated animate-fade-up"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <h4 className="text-sm font-semibold text-card-foreground">{job.title}</h4>
                <Badge variant="outline" className={`text-[10px] ${typeBadgeStyles[job.type]}`}>
                  {job.type}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {job.company}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {job.postedAt}
                </span>
              </div>
              <p className="text-xs text-muted-foreground/80 leading-relaxed">{job.description}</p>
              <p className="text-[11px] text-muted-foreground mt-2">
                Posted by <span className="text-card-foreground font-medium">{job.postedBy}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleReject(job.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                className="h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => handleApprove(job.id)}
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
