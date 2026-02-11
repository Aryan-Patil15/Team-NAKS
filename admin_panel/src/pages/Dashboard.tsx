import AppLayout from "@/components/layout/AppLayout";
import { useEffect, useState } from "react";
import {
  Users,
  IndianRupeeIcon,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* 📊 Recharts */
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    alumini: 0,
    students: 0,
    totalDonations: 0,
    activeJobListings: 0,
    pendingApprovals: 0,
    eventsThisMonth: 0,
    successStories: 0,
  });

  const [donationTrend, setDonationTrend] = useState<any[]>([]);
  const [jobData, setJobData] = useState<any[]>([]);

  useEffect(() => {

    /* Alumni */
    const unsubAlumni = onSnapshot(collection(db, "alumini"), (snap) => {
      setMetrics((p) => ({ ...p, alumini: snap.size }));
    });

    /* Students */
    const unsubStudents = onSnapshot(collection(db, "student"), (snap) => {
      setMetrics((p) => ({
        ...p,
        students: snap.size,
        totalUsers: snap.size + p.alumini,
      }));
    });

    const unsubsuccesstories = onSnapshot(collection(db, "success_feed"), (snap) => {
      setMetrics((p) => ({
        ...p,
        successStories: snap.size,
      }));
    });

    /* Donations Trend */
    const unsubDonations = onSnapshot(collection(db, "donation"), (snap) => {
      const total = snap.docs.reduce((sum, d) => {
        const rawAmount = d.data().raised_amount || "₹0";
        const numericAmount = Number(
          rawAmount.toString().replace("₹", "")
        );
        return sum + (isNaN(numericAmount) ? 0 : numericAmount);
      }, 0);

      setMetrics((p) => ({ ...p, totalDonations: total }));

      setDonationTrend([
        { name: "Total", amount: total },
      ]);
    });

    /* Jobs */
    const approvedQuery = query(
      collection(db, "job_opportunities"),
      where("status", "==", "approved")
    );

    const pendingQuery = query(
      collection(db, "job_opportunities"),
      where("status", "==", "pending")
    );

    const unsubApproved = onSnapshot(approvedQuery, (snap) => {
      setMetrics((p) => ({
        ...p,
        activeJobListings: snap.size,
      }));

      setJobData((prev) => [
        { name: "Approved", value: snap.size },
        prev[1] || { name: "Pending", value: 0 },
      ]);
    });

    const unsubPending = onSnapshot(pendingQuery, (snap) => {
      setMetrics((p) => ({
        ...p,
        pendingApprovals: snap.size,
      }));

      setJobData((prev) => [
        prev[0] || { name: "Approved", value: 0 },
        { name: "Pending", value: snap.size },
      ]);
    });

    return () => {
      unsubAlumni();
      unsubStudents();
      unsubsuccesstories();
      unsubDonations();
      unsubApproved();
      unsubPending();
    };
  }, []);

  const userPieData = [
    { name: "Alumni", value: metrics.alumini },
    { name: "Students", value: metrics.students },
  ];

  const COLORS = ["#3b82f6", "#10b981"];

  return (
    <AppLayout>
      <div className="space-y-10 animate-fade-in">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time network activity
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Users"
            value={metrics.totalUsers.toLocaleString()}
            icon={Users}
            variant="primary"
          />
          <MetricCard
            label="Total Donations"
            value={`₹${(metrics.totalDonations / 1000).toFixed(1)}K`}
            icon={IndianRupeeIcon}
            variant="accent"
          />
          <MetricCard
            label="Active Jobs"
            value={metrics.activeJobListings.toString()}
            icon={Briefcase}
            variant="info"
          />
          <MetricCard
            label="Success Stories"
            value={metrics.successStories.toString()}
            icon={TrendingUp}
            variant="primary"
          />
        </div>

        {/* 📊 Graph Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Donation Trend */}
          <div className="bg-card p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Donation Overview</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={donationTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* User Distribution */}
          <div className="bg-card p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">User Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={userPieData}
                  dataKey="value"
                  outerRadius={80}
                  label
                >
                  {userPieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Job Status */}
          <div className="bg-card p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Job Status</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={jobData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Placeholder for Growth Trend */}
          <div className="bg-card p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Growth Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={donationTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#6366f1" />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
