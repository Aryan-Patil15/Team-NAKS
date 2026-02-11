import { useState, useEffect } from "react";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { SuccessFeed } from "@/components/dashboard/SuccessFeed";
import { DonationPortal } from "@/components/dashboard/DonationPortal";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Calendar, Users, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// Firebase
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

/* =============================
   COOKIE UTILITY
============================= */
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

/* =============================
   QUICK LINKS
============================= */
const quickLinks = [
  {
    title: "Post a Job",
    desc: "Share opportunities with students",
    icon: Briefcase,
    to: "/jobs",
  },
  {
    title: "Upcoming Events",
    desc: "Reunions & networking nights",
    icon: Calendar,
    to: "/events",
  },
  {
    title: "Mentorship",
    desc: "Guide the next generation",
    icon: Users,
    to: "/networking",
  },
];

const Index = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1️⃣ Instant load from cookie (prevents flicker)
    const cachedName = getCookie("userName");
    if (cachedName) {
      setUserName(decodeURIComponent(cachedName));
    }

    let unsubscribeDoc: (() => void) | undefined;

    // 2️⃣ Auth listener
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeDoc) unsubscribeDoc();

      if (!userName) {
        if (!cachedName) setUserName("Guest");
        setLoading(false);
        return;
      }

      // 3️⃣ Alumni profile listener
      const alumniDocRef = doc(db, "alumini", user.uid);

      unsubscribeDoc = onSnapshot(
        alumniDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const fullName =
              data.name ||
              data.fullName ||
              user.displayName ||
              "Alumni";

            const firstName = fullName.split(" ")[0];

            setUserName(firstName);

            // Sync cookie
            document.cookie = `user_name=${encodeURIComponent(
              firstName
            )}; path=/; max-age=86400; SameSite=Lax`;
          } else {
            // Fallback: auth display name
            const authName =
              user.displayName?.split(" ")[0] || "Alumni";
            setUserName(authName);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Firestore error:", error);
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* WELCOME HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
          Dashboard Overview
        </p>

        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          Welcome back,
          <span className="text-gradient-electric">
            {loading ? (
              <Loader2 className="inline h-6 w-6 animate-spin text-primary/40" />
            ) : (
              userName
            )}
          </span>
        </h1>

        <p className="text-muted-foreground mt-1">
          Here's what's happening in your alumni community today.
        </p>
      </motion.div>

      {/* STATS */}
      <StatsOverview />

      {/* QUICK LINKS */}
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
              className="glass-card p-5 flex items-center gap-4 group"
            >
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition">
                <link.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{link.title}</p>
                <p className="text-xs text-muted-foreground">
                  {link.desc}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* MAIN CONTENT */}
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
