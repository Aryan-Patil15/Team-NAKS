import { useState, useEffect } from "react";
import { 
  Plus, Briefcase, FlaskConical, MapPin, Trash2, 
  Clock, CheckCircle2, Building2, Loader2, Bell, Search
} from "lucide-react";
import { db } from "@/lib/firebase";
import { 
  collection, query, where, onSnapshot, addDoc, 
  deleteDoc, doc, getDoc, serverTimestamp, Timestamp 
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// --- Strict Type Definitions ---
type OpportunityType = "job" | "research" | "internship";

interface JobOpportunity {
  id: string;
  title: string;
  company: string;       
  location: string;
  description: string;
  requirements: string;  
  type: OpportunityType;
  status: "pending"|"rejected" | "approved";
  postedBy: string;
  postedByEmail: string;
  createdAt: Timestamp | null;
}

interface OpportunityFormData {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  type: OpportunityType;
}

export default function JobsResearchPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [opportunities, setOpportunities] = useState<JobOpportunity[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State to hold resolved user info
  const [userProfile, setUserProfile] = useState<{ email: string; name: string } | null>(null);
  
  const { toast } = useToast();

  const [formData, setFormData] = useState<OpportunityFormData>({
    title: "",
    company: "",
    location: "",
    description: "",
    requirements: "",
    type: "job",
  });

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  /**
   * 1. Resolve User Details from ID stored in cookie
   */
  useEffect(() => {
  const fId = getCookie("facultyId"); // Explicitly looking for facultyId
  
  if (!fId) {
    setLoading(false);
    return;
  }

  const resolveFaculty = async () => {
    try {
      // Query the specific document in the 'faculty' collection
      const docRef = doc(db, "faculty", fId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserProfile({ email: data.email, name: data.name });
      } else {
        console.error("No faculty record found for this ID");
      }
    } catch (err) {
      console.error("Database error during session resolution:", err);
    }
  };

  resolveFaculty();
}, []);

  /**
   * 2. Fetch Opportunities once User Email is resolved
   */
  useEffect(() => {
    if (!userProfile?.email) return;

    const q = query(
      collection(db, "job_opportunities"),
      where("postedByEmail", "==", userProfile.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JobOpportunity[];
      
      setOpportunities(data.sort((a, b) => 
        (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)
      ));
      setLoading(false);
    }, (error) => {
      console.error("Firestore Listen Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userProfile]);

  const handleSubmit = async () => {
    if (!userProfile?.email) {
      toast({ title: "Session Error", description: "Could not verify user identity.", variant: "destructive" });
      return;
    }

    if (!formData.title || !formData.company || !formData.description) {
      toast({ title: "Missing Fields", description: "Please fill Title, Company, and Description.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "job_opportunities"), {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        description: formData.description,
        requirements: formData.requirements,
        type: formData.type,
        postedBy: userProfile.name,
        postedByEmail: userProfile.email,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      toast({ title: "Success", description: "Submitted for admin approval!" });
      setIsDialogOpen(false);
      setFormData({ title: "", company: "", location: "", description: "", requirements: "", type: "job" });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Submission failed.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple Session Guard
  if (!getCookie("facultyId")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-4">
          <p className="text-slate-400">Session expired. Please log in.</p>
          <Button onClick={() => window.location.href = '/login'}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const filteredOpportunities = opportunities.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(term) ||
      item.company.toLowerCase().includes(term) ||
      item.location.toLowerCase().includes(term) ||
      item.type.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Jobs & Research</h1>
          <p className="text-sm text-muted-foreground">Manage Professional Opportunities</p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground transition-smooth"
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground border-0">
            3
          </Badge>
        </Button>
        </div>
    </header>
      
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
             <h2 className="text-xl font-bold text-white">My Postings</h2>
             <p className="text-xs text-slate-500">Posting as: {userProfile?.name || 'Resolving session...'}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <Plus className="h-4 w-4" /> Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-white/10 text-white sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>New Opportunity</DialogTitle>
                <DialogDescription className="text-slate-400">All posts require admin approval.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={formData.type} onValueChange={(v: OpportunityType) => setFormData({...formData, type: v})}>
                      <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white">
                        <SelectItem value="job">Job</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2"><Label>Company / Lab</Label><Input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="bg-white/5 border-white/10" /></div>
                <div className="space-y-2"><Label>Location</Label><Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="bg-white/5 border-white/10" /></div>
                <div className="space-y-2"><Label>Requirements</Label><Input value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} placeholder="e.g. React, SQL" className="bg-white/5 border-white/10" /></div>
                <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-white/5 border-white/10" rows={3} /></div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-white hover:bg-white/5">Cancel</Button>
                <Button onClick={handleSubmit} disabled={isSubmitting || !userProfile} className="bg-blue-600 text-white hover:bg-blue-700">
                  {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Post"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search by title, company, location, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="grid gap-4">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-blue-500" /></div>
          ) : filteredOpportunities.map((item) => (
            <div key={item.id} className="p-5 rounded-xl border border-white/10 bg-slate-900/50 flex justify-between group hover:border-blue-500/50 transition-all">
              <div className="flex gap-4">
                <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center border", item.type === "research" ? "bg-purple-500/10 text-purple-500 border-purple-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20")}>
                  {item.type === "research" ? <FlaskConical /> : <Briefcase />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white">{item.title}</h3>
                    <Badge variant="outline" className="text-[10px] uppercase text-slate-400">{item.type}</Badge>
                  </div>
                  <div className="text-sm text-slate-400 flex gap-3 mt-1">
                    <span className="flex items-center"><Building2 className="h-3 w-3 mr-1" />{item.company}</span>
                    <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{item.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge
                  className={cn(
                    "border-none capitalize",
                    item.status === "pending" && "bg-amber-500/10 text-amber-500",
                    item.status === "approved" && "bg-green-500/10 text-green-500",
                    item.status === "rejected" && "bg-red-500/10 text-red-500"
                  )}
                >
                  {item.status}
                </Badge>

                <Button variant="ghost" size="icon" onClick={() => deleteDoc(doc(db, "job_opportunities", item.id))} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500 transition-all">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}