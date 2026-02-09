import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase"; // Ensure your firebase config is exported from here
import { collection, onSnapshot, doc, updateDoc, increment } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Heart, GraduationCap, TrendingUp, BookOpen, Landmark } from "lucide-react";

// Helper to map Firestore "type" to Lucide icons
const getIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case "education": return GraduationCap;
    case "infrastructure": return Landmark;
    default: return BookOpen;
  }
};

// Helper to clean currency strings like "₹10000" into numbers
const parseCurrency = (val: string | number) => {
  if (typeof val === "number") return val;
  return parseFloat(val.replace(/[^\d.]/g, "")) || 0;
};

interface Campaign {
  id: string;
   title_of_the_cause: string;
  type: string;
  raised_amount: string | number;
  goalAmount: string | number;
  donoursCount: string | number;
}

export function DonationPortal() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 1. Fetch Real-time Data
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "donation"), (snapshot) => {
      const campaignData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Campaign[];
      setCampaigns(campaignData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Update Database on Donation
  const handleDonate = async (id: string, amount: number) => {
    try {
      const docRef = doc(db, "donation", id);
      
      // Note: If your DB stores amounts as strings with "₹", 
      // simple incrementing might fail. It's better to store numbers.
      // Assuming you might want to keep the string format:
      const campaign = campaigns.find(c => c.id === id);
      const currentRaised = parseCurrency(campaign?.raised_amount || 0);
      const newTotal = currentRaised + amount;

      await updateDoc(docRef, {
        raised_amount: `₹${newTotal}`,
        donoursCount: increment(1)
      });

      toast({
        title: "Thank you for your contribution! 💛",
        description: `₹${amount.toLocaleString()} donated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not process donation. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div className="p-5 text-center text-xs animate-pulse">Loading Campaigns...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Heart className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Giving Back</h2>
      </div>

      {campaigns.map((campaign, i) => {
        const raised = parseCurrency(campaign.raised_amount);
        const goal = parseCurrency(campaign.goalAmount);
        const progress = Math.min((raised / goal) * 100, 100);
        const Icon = getIcon(campaign.type);

        return (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 space-y-4 border rounded-xl bg-card"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {campaign. title_of_the_cause}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {campaign.donoursCount} donors
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">
                  ₹{raised.toLocaleString()} raised
                </span>
                <span className="text-muted-foreground font-mono">
                  ₹{goal.toLocaleString()} goal
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
                  ₹{amount}
                </Button>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}