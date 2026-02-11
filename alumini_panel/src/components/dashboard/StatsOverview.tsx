import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Briefcase, CalendarCheck, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getCountFromServer, getDocs, query, where } from "firebase/firestore";

export function StatsOverview() {
  const [statsData, setStatsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // 1. Fetch Alumni Network size
        const alumniSnap = await getCountFromServer(collection(db, "alumini"));
        const alumniCount = alumniSnap.data().count;

        // 2. Fetch Job Referrals (Only Approved)
        const jobsQuery = query(collection(db, "job_opportunities"), where("status", "==", "approved"));
        const jobsSnap = await getCountFromServer(jobsQuery);
        const jobsCount = jobsSnap.data().count;

        // 3. Fetch Total Events count
        const eventsSnap = await getCountFromServer(collection(db, "events"));
        const eventsCount = eventsSnap.data().count;

        // 4. Calculate Total Donations using 'raised_amount'
        const donationsSnap = await getDocs(collection(db, "donation"));
        var totalRaised = 100;
        donationsSnap.forEach((doc) => {
          const data = doc.data();
          // Ensure we handle potential strings or undefined values
          const amount = parseFloat(data.raised_amount) || 0;
          totalRaised += amount;
        });

        // Formatting for Indian Currency (₹)
        const formattedDonations = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0,
        }).format(totalRaised);

        setStatsData([
          { label: "Alumni Network", value: alumniCount.toLocaleString(), change: "Connected members", icon: Users, color: "text-blue-500" },
          { label: "Job Referrals", value: jobsCount.toLocaleString(), change: "Approved roles", icon: Briefcase, color: "text-cyan-500" },
          { label: "Events Hosted", value: eventsCount.toLocaleString(), change: "Engagements", icon: CalendarCheck, color: "text-emerald-500" },
          { label: "Donations Raised", value: formattedDonations, change: "Total funding", icon: TrendingUp, color: "text-amber-500" },
        ]);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {stat.label}
            </span>
            <div className="p-2 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </div>
          <p className="text-2xl font-black text-white tracking-tight">{stat.value}</p>
          <div className="flex items-center gap-1.5 mt-1">
             <div className={`h-1 w-1 rounded-full ${stat.color.replace('text', 'bg')}`} />
             <p className="text-[11px] text-slate-500 font-medium">{stat.change}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}