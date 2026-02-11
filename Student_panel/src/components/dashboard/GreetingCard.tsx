import { Sparkles, TrendingUp, Target } from "lucide-react";

interface GreetingCardProps {
  userName: string;
}

export function GreetingCard({ userName }: GreetingCardProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">Your Command Center</span>
        </div>
        
        <h1 className="text-4xl font-bold mb-2">
          {getGreeting()}, <span className="gradient-text">{userName}</span>
        </h1>
        
        <p className="text-muted-foreground text-lg mb-6">
          Ready to unlock new opportunities today?
        </p>

        {/* Quick stats */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
            <div className="p-2 rounded-lg bg-primary/20">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-xs text-muted-foreground">Profile Views</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
            <div className="p-2 rounded-lg bg-accent/20">
              <Target className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">87%</p>
              <p className="text-xs text-muted-foreground">Match Score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
