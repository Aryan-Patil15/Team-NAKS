import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { SuccessFeed } from "@/components/dashboard/SuccessFeed";
import { DonationPortal } from "@/components/dashboard/DonationPortal";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";

const quickLinks = [
  { title: "Post a Job", desc: "Share opportunities with students", icon: Briefcase, to: "/jobs" },
  { title: "Upcoming Events", desc: "Reunions & networking nights", icon: Calendar, to: "/events" },
  { title: "Mentorship", desc: "Guide the next generation", icon: Users, to: "/networking" },
];

const Index = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
          Dashboard Overview
        </p>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, <span className="text-gradient-electric">Arjun</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening in your alumni community today.
        </p>
      </motion.div>

      {/* Stats */}
      <StatsOverview />

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickLinks.map((link, i) => (
          <motion.div
            key={link.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
          >
            <Link
              to={link.to}
              className="glass-card p-5 flex items-center gap-4 group transition-all duration-200"
            >
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-200">
                <link.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{link.title}</p>
                <p className="text-xs text-muted-foreground">{link.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <SuccessFeed />
        </div>
        <div className="lg:col-span-2">
          <DonationPortal />
        </div>
      </div>
    </div>
  );
};

export default Index;
