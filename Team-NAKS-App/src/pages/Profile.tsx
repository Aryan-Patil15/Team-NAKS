import { useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  MapPin,
  Building2,
  Briefcase,
  Mail,
  Edit3,
  Award,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const skills = ["React", "TypeScript", "Product Strategy", "Machine Learning", "Go", "AWS"];
const achievements = [
  { title: "Series A Funded", desc: "Raised $4.2M for my AI startup", date: "Jan 2024" },
  { title: "Forbes 30 Under 30", desc: "Recognized in Technology category", date: "Nov 2023" },
  { title: "Open Source Contributor", desc: "500+ stars on GitHub project", date: "Aug 2023" },
];

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="elevated-card overflow-hidden"
      >
        {/* Cover */}
        <div className="h-36 gradient-hero relative overflow-hidden">
          <div className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 80% 60% at 30% 50%, hsl(210 100% 56% / 0.15), transparent)",
            }}
          />
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
            }}
          />
        </div>

        <div className="px-8 pb-8">
          {/* Avatar area */}
          <div className="flex items-end gap-6 -mt-12 mb-6">
            <div className="h-24 w-24 rounded-2xl gradient-electric flex items-center justify-center text-primary-foreground text-2xl font-bold border-4 border-card shadow-lg"
              style={{ boxShadow: "0 0 30px hsl(210 100% 56% / 0.3)" }}
            >
              AR
            </div>
            <div className="flex-1 pt-14">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">Arjun Raghavan</h1>
                <span className="badge-verified">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Batch of 2024
                </span>
              </div>
              <p className="text-muted-foreground text-sm mt-0.5">
                Co-Founder & CTO · AI Enthusiast · Open Source Advocate
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="shrink-0"
            >
              <Edit3 className="h-4 w-4 mr-1.5" />
              Edit Profile
            </Button>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <InfoItem icon={Building2} label="Company" value="NeuralStack AI" />
            <InfoItem icon={Briefcase} label="Role" value="Co-Founder & CTO" />
            <InfoItem icon={MapPin} label="Location" value="Bangalore, India" />
            <InfoItem icon={Mail} label="Email" value="arjun@neuralstack.ai" />
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs font-mono">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Achievements</h2>
        </div>
        <div className="space-y-3">
          {achievements.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors duration-200"
            >
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <span className="text-xs text-muted-foreground font-mono shrink-0">{item.date}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 p-3 rounded-lg bg-secondary/30">
      <Icon className="h-4 w-4 text-primary shrink-0" />
      <div>
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-mono">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default Profile;
