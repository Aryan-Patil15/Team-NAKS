import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Heart, Building, GraduationCap, TrendingUp } from "lucide-react";

interface Campaign {
  id: number;
  title: string;
  icon: any;
  raised: number;
  goal: number;
  donors: number;
}

const initialCampaigns: Campaign[] = [
  {
    id: 1,
    title: "Campus Infrastructure",
    icon: Building,
    raised: 842000,
    goal: 1200000,
    donors: 1240,
  },
  {
    id: 2,
    title: "Student Scholarships",
    icon: GraduationCap,
    raised: 356000,
    goal: 500000,
    donors: 680,
  },
];

export function DonationPortal() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const { toast } = useToast();

  const handleDonate = (id: number, amount: number) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, raised: c.raised + amount, donors: c.donors + 1 }
          : c
      )
    );
    toast({
      title: "Thank you for your contribution! 💛",
      description: `$${amount.toLocaleString()} donated successfully.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Heart className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Giving Back</h2>
      </div>

      {campaigns.map((campaign, i) => {
        const progress = Math.min((campaign.raised / campaign.goal) * 100, 100);
        return (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <campaign.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{campaign.title}</h3>
                <p className="text-xs text-muted-foreground font-mono">{campaign.donors} donors</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">
                  ${(campaign.raised / 1000).toFixed(0)}K raised
                </span>
                <span className="text-muted-foreground font-mono">
                  ${(campaign.goal / 1000).toFixed(0)}K goal
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                <TrendingUp className="h-3 w-3" />
                {progress.toFixed(0)}% funded
              </p>
            </div>

            <div className="flex gap-2">
              {[100, 500, 1000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs font-mono"
                  onClick={() => handleDonate(campaign.id, amount)}
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
