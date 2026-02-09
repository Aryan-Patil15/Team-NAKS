import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, PlusCircle, Trash2, Briefcase, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const JobsPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: ""
  });

  const navigate = useNavigate();

  // AUTH LOGIC: Check for the userName cookie you set during login
  const activeName = Cookies.get("userName");
  // Optional: If you also store emailId in cookies, use it here, otherwise fallback to name for filtering
  const activeEmail = Cookies.get("userEmail") || ""; 

  useEffect(() => {
    // If userName cookie is missing, user is not authorized
    if (!activeName) {
      setLoading(false);
      return;
    }

    // Query jobs posted by this specific alumni name
    const q = query(
      collection(db, "job_opportunities"),
      where("postedBy", "==", activeName)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeName]);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, company, location, description } = formData;
    
    if (!title || !company || !location || !description) {
      alert("Please fill in all fields.");
      return;
    }

    setIsPosting(true);
    try {
      await addDoc(collection(db, "job_opportunities"), {
        title,
        company,
        location,
        description,
        postedBy: activeName, 
        postedByEmail: activeEmail, 
        status: "pending", 
        createdAt: serverTimestamp(),
      });

      setFormData({ title: "", company: "", location: "", description: "" });
      alert("Job submitted successfully! It will be visible to students once approved by the admin.");
    } catch (error) {
      console.error("Error adding job:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (window.confirm("Delete this job posting?")) {
      try {
        await deleteDoc(doc(db, "job_opportunities", id));
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  // If not logged in (no userName cookie), show login prompt
  if (!activeName) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#020617] text-white">
        <div className="text-center">
          <p className="mb-4 text-slate-400">Access Denied. Please log in as Alumni.</p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#020617] min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter">ALUMNI PANEL</h1>
            <p className="text-slate-400">Welcome, {activeName}</p>
          </div>
        </div>

        {/* --- POSTING FORM --- */}
        <Card className="bg-slate-900/40 border-slate-800 mb-12 border-l-4 border-l-blue-600">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-400">
              <PlusCircle className="w-5 h-5" />
              New Job Opportunity
            </h2>
            
            <form onSubmit={handlePostJob} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Job Title</label>
                  <Input
                    placeholder="e.g. Full Stack Developer"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="bg-slate-950 border-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Company</label>
                  <Input
                    placeholder="e.g. Google India"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="bg-slate-950 border-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="e.g. Mumbai / Remote"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="bg-slate-950 border-slate-800 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Job Description</label>
                <Textarea
                  placeholder="Paste job details and application link here..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-slate-950 border-slate-800 min-h-[100px]"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isPosting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12"
              >
                {isPosting ? <Loader2 className="animate-spin h-5 w-5" /> : "Submit for Admin Approval"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* --- LISTING SECTION --- */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-slate-400" />
            Your Postings History
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-blue-500" /></div>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} onDelete={() => handleDeleteJob(job.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const JobCard = ({ job, onDelete }: { job: any; onDelete: () => void }) => {
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "job_applications"), where("jobid", "==", job.id));
    return onSnapshot(q, (snapshot) => {
      setApps(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [job.id]);

  const isPending = job.status === "pending";

  return (
    <Card className={`bg-slate-900 border-slate-800 ${isPending ? 'opacity-80' : 'opacity-100'}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-black text-xl border ${isPending ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
              {job.company.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-white">{job.title}</h3>
                {isPending ? (
                  <span className="flex items-center gap-1 text-[10px] bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                    <Clock className="w-3 h-3" /> Pending Approval
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                    <CheckCircle2 className="w-3 h-3" /> Approved
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <span>{job.company}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="block text-2xl font-black text-blue-500 leading-none">{apps.length}</span>
              <span className="text-[10px] uppercase text-slate-600 font-bold">Applicants</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onDelete} className="text-slate-600 hover:text-red-500 hover:bg-red-500/10">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobsPage;