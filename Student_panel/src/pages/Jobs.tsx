import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Search, MapPin, Clock, Building2, Bookmark, BookmarkCheck, ExternalLink, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase"; 
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useStudent } from "@/hooks/useStudents";

interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  description: string;
  requirements: string[];
  tags: string[];
  status: string;
}

export default function Jobs() {
  const { student } = useStudent(); 
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  const getSessionData = () => {
    const name = "user_session=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        try {
          return JSON.parse(c.substring(name.length, c.length));
        } catch (e) { return null; }
      }
    }
    return null;
  };

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return "Recently";
    try {
      const cleanedDate = dateString.replace(' at ', ' ');
      const postDate = new Date(cleanedDate);
      const now = new Date();
      const diffInMs = now.getTime() - postDate.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      if (diffInDays < 1) return "Today";
      if (diffInDays === 1) return "Yesterday";
      return `${diffInDays} days ago`;
    } catch (error) { return "Recently"; }
  };

  // --- FETCH JOBS & USER'S PREVIOUS APPLICATIONS ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = getSessionData();
        const currentUserId = session?.userId || student?.userId;

        // Fetch Jobs
        const jobsRef = collection(db, "job_opportunities");
        const qJobs = query(jobsRef, where("status", "==", "approved"));
        const querySnapshot = await getDocs(qJobs);
        const fetchedJobs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          posted: getTimeAgo(doc.data().posted || "") 
        })) as Job[];
        setJobs(fetchedJobs);
        if (fetchedJobs.length > 0) setSelectedJob(fetchedJobs[0]);

        // Fetch user's applications to mark "Applied" status
        if (currentUserId) {
          const appsRef = collection(db, "job_applications");
          const qApps = query(appsRef, where("studentid", "==", currentUserId));
          const appSnapshot = await getDocs(qApps);
          const appliedIds = new Set(appSnapshot.docs.map(doc => doc.data().jobid));
          setAppliedJobIds(appliedIds);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [student?.userId]);

  const handleApply = async () => {
    const session = getSessionData();
    const finalStudentId = session?.userId || student?.userId;

    if (!selectedJob || !finalStudentId) {
      alert("Session expired. Please log in again.");
      return;
    }

    setApplying(true);
    try {
      await addDoc(collection(db, "job_applications"), {
        jobid: selectedJob.id,
        jobtitle: selectedJob.title,
        studentid: finalStudentId,
        studentname: student?.name || "N/A",
        studentemail: student?.emailId || "N/A",
        appliedat: new Date().toLocaleString('en-US', { 
          month: 'long', day: 'numeric', year: 'numeric' 
        }) + " at " + new Date().toLocaleTimeString(),
        status: "applied", // Added status field as requested
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        requirements: selectedJob.requirements,
      });

      // Update local state to reflect applied status immediately
      setAppliedJobIds(prev => new Set(prev).add(selectedJob.id));
      alert(`Applied for ${selectedJob.title}!`);
    } catch (error) {
      console.error("Error applying:", error);
      alert("Failed to submit application.");
    } finally {
      setApplying(false);
    }
  };

  const toggleBookmark = (jobId: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasApplied = selectedJob ? appliedJobIds.has(selectedJob.id) : false;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="animate-pulse text-gray-400">Loading opportunities...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/20 border border-primary/30">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-white">Job & Internship Hub</h1>
          </div>
          <p className="text-gray-400">Discover hand-picked roles approved by the Nexus team</p>
        </div>

        {/* Search Bar */}
        <div className="glass-card p-4 mb-6 bg-white/5 border border-white/10 rounded-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by role, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Job List */}
          <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group ${
                  selectedJob?.id === job.id ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(138,79,255,0.1)]" : "bg-white/5 border-white/10"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg font-bold border border-white/10 text-white">
                    {job.logo || job.company?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-white truncate group-hover:text-primary transition-colors">{job.title}</h3>
                      <div onClick={(e) => { e.stopPropagation(); toggleBookmark(job.id); }}>
                        {bookmarks.has(job.id) ? (
                          <BookmarkCheck className="h-5 w-5 text-primary" />
                        ) : (
                          <Bookmark className="h-5 w-5 text-gray-500 hover:text-primary transition-colors" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{job.company}</p>
                    <div className="flex items-center gap-3 mt-3">
                      {appliedJobIds.has(job.id) && <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">Applied</Badge>}
                      <Badge variant={(job.type || "").toLowerCase() === "internship" ? "neonCyan" : "neonViolet"}>{job.type || "Job"}</Badge>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Job Details */}
          <div className="lg:col-span-3">
            {selectedJob && (
              <div className="glass-card p-8 sticky top-8 bg-white/5 border border-white/10 rounded-3xl animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-3xl font-bold border border-white/10 text-white shadow-2xl">
                    {selectedJob.logo || selectedJob.company?.[0]}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedJob.title}</h2>
                    <p className="text-xl text-gray-400 flex items-center gap-2">
                      {selectedJob.company}
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                      <span className="text-primary text-lg font-medium">{selectedJob.salary}</span>
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">About the Role</h3>
                  <p className="text-gray-400 leading-relaxed text-lg italic border-l-2 border-primary/30 pl-4">{selectedJob.description}</p>
                </div>

                {/* Updated Key Requirements Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Key Requirements</h3>
                  <div className="text-gray-400 bg-white/5 p-4 rounded-xl border border-white/5 leading-relaxed">
                    <p className="whitespace-pre-line text-sm md:text-base">
                      {selectedJob.requirements}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Dynamic Button Section */}
                  <Button 
                    variant={hasApplied ? "outline" : "gradient"} 
                    size="lg" 
                    className={`flex-1 h-14 text-lg font-bold transition-all duration-500 ${hasApplied ? 'border-green-500/50 text-green-400 bg-green-500/10 cursor-default' : 'shadow-lg shadow-primary/20'}`}
                    onClick={hasApplied ? undefined : handleApply}
                    disabled={applying}
                  >
                    {applying ? (
                      <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Processing...</>
                    ) : hasApplied ? (
                      <><CheckCircle2 className="h-5 w-5 mr-2" /> Applied</>
                    ) : (
                      <>Apply Now <ExternalLink className="h-5 w-5 ml-2" /></>
                    )}
                  </Button>

                  {/* Hide Save button if applied */}
                  {!hasApplied && (
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="h-14 px-8 border-white/10 hover:bg-white/5" 
                      onClick={() => toggleBookmark(selectedJob.id)}
                    >
                      {bookmarks.has(selectedJob.id) ? "Saved" : "Save for Later"}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}