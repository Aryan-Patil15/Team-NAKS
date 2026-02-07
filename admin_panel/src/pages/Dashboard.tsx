import AppLayout from "@/components/layout/AppLayout";
import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  IndianRupeeIcon,
  Briefcase,
  Clock,
  CalendarDays,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    alumini: 0,
    students: 0,
    totalDonations: 0,
    activeJobListings: 0,   // approved jobs
    pendingApprovals: 0,    // pending jobs
    eventsThisMonth: 0,
    successStories: 0,      // 🔹 NEW
  });

  useEffect(() => {
    /* Alumni count */
    const unsubAlumni = onSnapshot(collection(db, "alumini"), (snap) => {
      setMetrics((p) => ({ ...p, alumini: snap.size }));
    });

    /* Student count */
    const unsubStudents = onSnapshot(collection(db, "student"), (snap) => {
      setMetrics((p) => ({ ...p, students: snap.size }));
    });

    /* Total users */
    const unsubTotalUsers = onSnapshot(collection(db, "student"), () => {
      setMetrics((p) => ({
        ...p,
        totalUsers: p.alumini + p.students,
      }));
    });

    /* Total donations (sum of raised_amount) */
    const unsubDonations = onSnapshot(collection(db, "donation"), (snap) => {
      const total = snap.docs.reduce((sum, d) => {
        const rawAmount = d.data().raised_amount || "₹0";
        const numericAmount = Number(
          rawAmount.toString().replace("₹", "")
        );
        return sum + (isNaN(numericAmount) ? 0 : numericAmount);
      }, 0);

      setMetrics((p) => ({ ...p, totalDonations: total }));
    });

    /* Approved jobs → Active listings */
    const approvedJobsQuery = query(
      collection(db, "job_opportunities"),
      where("status", "==", "approved")
    );

    const unsubApprovedJobs = onSnapshot(approvedJobsQuery, (snap) => {
      setMetrics((p) => ({
        ...p,
        activeJobListings: snap.size,
      }));
    });

    /* Pending jobs → Pending approvals */
    const pendingJobsQuery = query(
      collection(db, "job_opportunities"),
      where("status", "==", "pending")
    );

    const unsubPendingJobs = onSnapshot(pendingJobsQuery, (snap) => {
      setMetrics((p) => ({
        ...p,
        pendingApprovals: snap.size,
      }));
    });

    /* Events */
    const unsubEvents = onSnapshot(collection(db, "events"), (snap) => {
      setMetrics((p) => ({ ...p, eventsThisMonth: snap.size }));
    });

    /* 🔹 Success Stories */
    const unsubSuccessStories = onSnapshot(
      collection(db, "success_feed"),
      (snap) => {
        setMetrics((p) => ({
          ...p,
          successStories: snap.size,
        }));
      }
    );

    return () => {
      unsubAlumni();
      unsubStudents();
      unsubTotalUsers();
      unsubDonations();
      unsubApprovedJobs();
      unsubPendingJobs();
      unsubEvents();
      unsubSuccessStories();
    };
  }, []);

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time network activity
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
          <MetricCard
            label="Total Registered Users"
            value={metrics.totalUsers.toLocaleString()}
            subtitle={`${metrics.alumini} alumni · ${metrics.students} students`}
            icon={Users}
            variant="primary"
            delay={0}
          />

          <MetricCard
            label="Total Donations"
            value={`₹${(metrics.totalDonations / 1000).toFixed(1)}K`}
            subtitle="Lifetime collected"
            icon={IndianRupeeIcon}
            variant="accent"
            delay={80}
          />

          <MetricCard
            label="Alumni"
            value={metrics.alumini.toString()}
            icon={GraduationCap}
            variant="primary"
            delay={300}
          />

          <MetricCard
            label="Students"
            value={metrics.students.toString()}
            icon={UserCheck}
            variant="info"
            delay={350}
          />

          <MetricCard
            label="Events"
            value={metrics.eventsThisMonth.toString()}
            icon={CalendarDays}
            variant="accent"
            delay={400}
          />

          <MetricCard
            label="Active Job Listings"
            value={metrics.activeJobListings.toString()}
            subtitle="Approved jobs"
            icon={Briefcase}
            variant="info"
            delay={160}
          />

          <MetricCard
            label="Pending Approvals"
            value={metrics.pendingApprovals.toString()}
            subtitle="Awaiting review"
            icon={Clock}
            variant="default"
            delay={240}
          />

          <MetricCard
            label="Success Stories"
            value={metrics.successStories.toString()}
            icon={TrendingUp}
            variant="primary"
            delay={450}
          />
        </div>
      </div>
    </AppLayout>
  );
}
