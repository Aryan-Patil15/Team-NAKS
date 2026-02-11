import AppLayout from "@/components/layout/AppLayout";
import { CheckCircle, XCircle, Briefcase, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  postedBy: string;
  postedByEmail: string;
  status: "pending" | "approved" | "rejected";
};

export default function JobApprovalPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* 🔹 Fetch job opportunities */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(
          collection(db, "job_opportunities"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data: Job[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Job, "id">),
        }));
        setJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  /* 🔹 Approve / Reject handler */
  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      await updateDoc(doc(db, "job_opportunities", id), { status });
      setJobs((prev) =>
        prev.map((job) =>
          job.id === id ? { ...job, status } : job
        )
      );
    } catch (err) {
      console.error("Failed to update job status:", err);
    }
  };

  /* 🔹 Search filter */
  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.postedBy.toLowerCase().includes(search.toLowerCase()) ||
      j.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between animate-fade-up">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Job Approvals
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review and approve job opportunities posted by alumni
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-primary icon-glow" />
            </div>
            <span className="text-lg font-bold font-mono">
              {jobs.length}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by job title, company, or alumni..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border text-sm h-10"
          />
        </div>

        {/* Jobs Table */}
        <div className="rounded-xl glass-card card-gradient-border overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-sm text-muted-foreground text-center">
                Loading job requests...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground text-center">
                No job approval requests found
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="px-5 py-3 text-left text-[10px] font-mono uppercase text-muted-foreground">Job</th>
                    <th className="px-5 py-3 text-left text-[10px] font-mono uppercase text-muted-foreground">Company</th>
                    <th className="px-5 py-3 text-left text-[10px] font-mono uppercase text-muted-foreground">Posted By</th>
                    <th className="px-5 py-3 text-left text-[10px] font-mono uppercase text-muted-foreground">Status</th>
                    <th className="px-5 py-3 text-right text-[10px] font-mono uppercase text-muted-foreground">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b border-border/30 last:border-0 hover:bg-primary/5 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium">{job.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {job.location}
                        </p>
                      </td>

                      <td className="px-5 py-3.5 text-sm">
                        {job.company}
                      </td>

                      <td className="px-5 py-3.5">
                        <p className="text-sm">{job.postedBy}</p>
                        <p className="text-xs text-muted-foreground">
                          {job.postedByEmail}
                        </p>
                      </td>

                      <td className="px-5 py-3.5">
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase font-mono ${
                            job.status === "approved"
                              ? "bg-success/10 text-success border-success/20"
                              : job.status === "rejected"
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : "bg-warning/10 text-warning border-warning/20"
                          }`}
                        >
                          {job.status}
                        </Badge>
                      </td>

                      <td className="px-5 py-3.5 text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={job.status !== "pending"}
                          onClick={() => updateStatus(job.id, "approved")}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          disabled={job.status !== "pending"}
                          onClick={() => updateStatus(job.id, "rejected")}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
