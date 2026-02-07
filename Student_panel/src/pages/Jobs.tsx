import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Building2,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: "Internal Referral" | "Internship";
  postedBy: string;
  postedAt: string;
  description: string;
}

const initialJobs: Job[] = [
  {
    id: 1,
    title: "Frontend Engineer",
    company: "Google",
    location: "Bangalore",
    type: "Internal Referral",
    postedBy: "Arjun Raghavan",
    postedAt: "2 hours ago",
    description: "Looking for a strong React/TypeScript developer for the Search team.",
  },
  {
    id: 2,
    title: "Product Design Intern",
    company: "Figma",
    location: "Remote",
    type: "Internship",
    postedBy: "Kavya Nair",
    postedAt: "1 day ago",
    description: "6-month internship opportunity for design students passionate about tooling.",
  },
  {
    id: 3,
    title: "ML Research Intern",
    company: "DeepMind",
    location: "London, UK",
    type: "Internship",
    postedBy: "Rohan Mehta",
    postedAt: "3 days ago",
    description: "Research internship focused on reinforcement learning and generative models.",
  },
];

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "" as string,
    description: "",
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!form.title || !form.company || !form.type) return;

    const newJob: Job = {
      id: jobs.length + 1,
      title: form.title,
      company: form.company,
      location: form.location || "Remote",
      type: form.type as Job["type"],
      postedBy: "Arjun Raghavan",
      postedAt: "Just now",
      description: form.description,
    };

    setJobs([newJob, ...jobs]);
    setForm({ title: "", company: "", location: "", type: "", description: "" });
    setOpen(false);
    toast({
      title: "Opportunity Posted!",
      description: "Your listing is now visible to students.",
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
            Opportunities
          </p>
          <h1 className="text-3xl font-bold text-foreground">Opportunity Board</h1>
          <p className="text-muted-foreground mt-1">
            Share exclusive referrals and internships for your juniors.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1.5" />
              Post Opportunity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Post an Opportunity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Job Title</label>
                <Input
                  placeholder="e.g. Frontend Engineer"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Company</label>
                  <Input
                    placeholder="e.g. Google"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Location</label>
                  <Input
                    placeholder="e.g. Bangalore"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Type</label>
                <Select onValueChange={(val) => setForm({ ...form, type: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Internal Referral">Internal Referral</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
                <Textarea
                  placeholder="Brief description of the role..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <Button className="w-full" onClick={handleSubmit}>
                Publish Opportunity
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="glass-card p-5 flex flex-col gap-3 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">{job.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-primary" />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-primary" />
                    {job.location}
                  </span>
                </div>
              </div>
              <Badge
                variant={job.type === "Internal Referral" ? "default" : "secondary"}
                className="text-[10px] shrink-0 font-mono"
              >
                {job.type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                <Clock className="h-3 w-3" />
                {job.postedAt} · by {job.postedBy}
              </span>
              <Button variant="ghost" size="sm" className="text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                Apply
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
