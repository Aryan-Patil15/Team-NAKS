import { MapPin, MessageSquare, Linkedin, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AlumniCardProps {
  alumni: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    company: string;
    companyLogo: string;
    location: string;
    graduationYear: number;
    skills: string[];
    isMentor: boolean;
    isAvailable: boolean;
  };
  onConnect?: () => void;
}

export function AlumniCard({ alumni }: AlumniCardProps) {
  const navigate = useNavigate();

  const handleQuickConnect = () => {
    navigate(`/chat/${alumni.id}`);
  };

  return (
    <div className="glass-card-hover p-6 group relative overflow-hidden">
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Header with avatar and company */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-2xl font-bold border border-white/20">
              {alumni.avatar}
            </div>
            {alumni.isAvailable && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-card flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {alumni.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{alumni.role}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-xs font-bold">
                {alumni.companyLogo}
              </div>
              <span className="text-sm text-foreground">{alumni.company}</span>
            </div>
          </div>
        </div>

        {/* Location and year */}
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{alumni.location}</span>
          </div>
          <span>Class of {alumni.graduationYear}</span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {alumni.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="glass" className="text-xs">
              {skill}
            </Badge>
          ))}
          {alumni.skills.length > 3 && (
            <Badge variant="glass" className="text-xs">
              +{alumni.skills.length - 3}
            </Badge>
          )}
        </div>

        {/* Mentor badge */}
        {alumni.isMentor && (
          <div className="mb-4">
            <Badge variant="neonViolet" className="text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Available for Mentoring
            </Badge>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-white/10">
          <Button variant="neonViolet" size="sm" className="flex-1" onClick={handleQuickConnect}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Quick Connect
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Linkedin className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}