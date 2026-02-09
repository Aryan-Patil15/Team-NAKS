import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Building2, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  Loader2, 
  CheckCircle2, 
  BadgeCheck,
  Briefcase
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Jobs_opp() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, "job_opportunities"), where("status", "==", "approved")));
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJobs(fetched);
        if (fetched.length > 0) setSelectedJob(fetched[0]);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
      <Loader2 className="h-6 w-6 animate-spin text-blue-500/50" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-300 selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between bg-slate-900/40 border border-white/5 p-5 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Job Hub</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Find internship opportunities</p>
            </div>
          </div>
          
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
            <input
              type="text"
              placeholder="Search roles..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-slate-950 border border-white/5 text-sm focus:outline-none focus:border-blue-500/30 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Job List (Compact) */}
          <div className="lg:col-span-4 space-y-3 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
            {jobs.filter(j => j.title.toLowerCase().includes(searchQuery.toLowerCase())).map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedJob?.id === job.id 
                    ? "bg-blue-500/5 border-blue-500/40 shadow-sm" 
                    : "bg-slate-900/20 border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-950 border border-white/5 flex items-center justify-center font-bold text-blue-400 shrink-0">
                    {job.company?.[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-white truncate">{job.title}</h3>
                    <p className="text-xs text-slate-500 truncate">{job.company}</p>
                    <div className="flex gap-2 mt-2">
                       <Badge className="bg-slate-950 text-[10px] text-slate-500 border-white/5 px-2 py-0">
                         {job.type || "Full Time"}
                       </Badge>
                       {appliedJobIds.has(job.id) && <span className="text-[10px] text-green-500 font-bold uppercase">Applied</span>}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Preview (Clean & Minimal) */}
          <div className="lg:col-span-8">
            {selectedJob ? (
              <motion.div 
                layoutId={selectedJob.id}
                className="bg-slate-900/30 border border-white/5 rounded-2xl p-6 sticky top-6"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl font-black text-blue-400 border border-blue-500/20">
                      {selectedJob.company?.[0]}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white leading-none mb-1">{selectedJob.title}</h2>
                      <p className="text-sm text-blue-400/80 font-medium">{selectedJob.company} • {selectedJob.salary}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-600 hover:text-blue-400">
                    <Bookmark className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Description</h4>
                    <p className="text-sm leading-relaxed text-slate-400 bg-slate-950/30 p-4 rounded-xl border border-white/5">
                      {selectedJob.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Requirements</h4>
                    <div className="text-sm text-slate-400 whitespace-pre-line pl-4 border-l border-blue-500/20">
                      {selectedJob.requirements}
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 rounded-xl shadow-lg shadow-blue-600/10"
                    onClick={() => {
                       setAppliedJobIds(prev => new Set(prev).add(selectedJob.id));
                       alert("Application Sent!");
                    }}
                  >
                    {appliedJobIds.has(selectedJob.id) ? "Application Submitted" : "Express Interest"} <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="h-64 flex items-center justify-center border border-dashed border-white/5 rounded-2xl text-slate-600 text-xs uppercase tracking-widest">
                Select a position to preview
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}