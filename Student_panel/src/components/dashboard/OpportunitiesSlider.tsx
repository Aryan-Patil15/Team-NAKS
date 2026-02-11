import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock, Bookmark, ExternalLink, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

interface Opportunity {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  posted: string;
  tags: string[];
  status: string;
  description: string;
}

export function OpportunitiesSlider() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState<number>(3);

  // --- HELPER: CALCULATE "X DAYS AGO" ---
  const getTimeAgo = (dateString: string) => {
    if (!dateString) return "Recently";
    try {
      // Formats 'February 6, 2026 at 7:22:21 PM...' to valid Date
      const cleanedDate = dateString.replace(' at ', ' ');
      const postDate = new Date(cleanedDate);
      const now = new Date();

      const diffInMs = now.getTime() - postDate.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays < 1) return "Today";
      if (diffInDays === 1) return "Yesterday";
      return `${diffInDays} days ago`;
    } catch (error) {
      return "Recently";
    }
  };

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsRef = collection(db, "job_opportunities");
        const q = query(jobsRef, where("status", "==", "approved"));
        const querySnapshot = await getDocs(q);
        
        const fetchedJobs = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            posted: getTimeAgo(data.posted || "") 
          };
        }) as Opportunity[];

        setOpportunities(fetchedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // --- RESPONSIVE CALCULATION ---
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 640) return 1;
      if (w < 1024) return 2;
      return 3;
    };
    const onResize = () => setVisibleCards(calc());
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const maxIndex = Math.max(0, opportunities.length - visibleCards);
  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));

  if (loading) {
    return (
      <div className="glass-card p-12 flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-3xl">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground animate-pulse">Syncing with Nexus Hub...</p>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="glass-card p-12 text-center text-muted-foreground border border-dashed border-white/10 rounded-3xl">
        No approved opportunities match your profile right now.
      </div>
    );
  }

  return (
    <div className="glass-card p-6 border border-white/10 bg-white/5 rounded-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-1">Featured Opportunities</h3>
          <p className="text-sm text-muted-foreground">Hand-picked roles for you</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentIndex === 0} className="rounded-xl bg-white/5 border-white/10">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext} disabled={currentIndex >= maxIndex} className="rounded-xl bg-white/5 border-white/10">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` }}
        >
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="glass-card-hover flex-shrink-0 p-5 group bg-[#1c162d]/50 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300"
              style={{ width: `calc((100% - ${Math.max(0, (visibleCards - 1) * 1)}rem) / ${visibleCards})` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg font-bold border border-white/10 text-white shadow-lg">
                    {opp.logo || (opp.company ? opp.company[0] : "J")}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{opp.company || "Company"}</p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider">
                      <MapPin className="h-3 w-3 text-primary" />
                      <span>{opp.location || "Remote"}</span>
                    </div>
                  </div>
                </div>
                <Bookmark className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>

              <h4 className="font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-1">
                {opp.title || "Untitled Position"}
              </h4>

              <div className="flex items-center gap-1 text-[10px] text-muted-foreground tracking-wider">
                <span>{opp.description || "Remote"}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Badge variant={(opp.type || "").toLowerCase() === "internship" ? "neonCyan" : "neonViolet"}>
                    {opp.type || "Job"}
                  </Badge>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                    <Clock className="h-3 w-3" />
                    {opp.posted}
                  </span>
                </div>

                <button onClick={() => navigate('/jobs')}
                  className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
                  title="View all jobs">
                    <ExternalLink className="h-3 w-3" />
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-8 bg-primary shadow-[0_0_10px_rgba(138,79,255,0.5)]" : "w-2 bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}