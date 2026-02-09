import { useState } from "react";
import { db } from "@/lib/firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; 
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Lock, Mail, Loader2, Sparkles } from "lucide-react";
import Cookies from "js-cookie";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Query the 'alumini' collection directly
      const alumniRef = collection(db, "alumini");
      const q = query(
        alumniRef, 
        where("email", "==", email),
        where("password", "==", password) 
      );
      
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const alumniData = querySnapshot.docs[0].data();
        const foundUserName = alumniData.name || "Alumni Member";

        // 1. Store ONLY the userName (and a verification flag) in the cookie
        // We set 'secure: true' for safety and 'expires: 7' for a week-long session
        Cookies.set("alumni_user", foundUserName, { expires: 7, secure: true });
        Cookies.set("is_authenticated", "true", { expires: 7, secure: true });

        toast({ 
          title: "Welcome Back", 
          description: `Logged in as ${foundUserName}` 
        });
        
        navigate("/"); 
      } else {
        toast({ 
          variant: "destructive", 
          title: "Invalid Credentials", 
          description: "No matching alumni record found." 
        });
      }
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Connection Error", 
        description: "Failed to reach the alumni database." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden">
      {/* Majestic Blue Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md px-4 z-10">
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] shadow-2xl shadow-blue-900/20">
          
          <div className="text-center mb-10">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-lg shadow-blue-500/40 mb-6">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              Alumni <span className="text-blue-500">Portal</span>
            </h1>
            <p className="text-slate-400 font-medium">Connect with your legacy</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input 
                  type="email" 
                  placeholder="alumni@university.com" 
                  className="bg-slate-900/50 border-slate-800 text-white h-14 pl-12 rounded-xl focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="bg-slate-900/50 border-slate-800 text-white h-14 pl-12 rounded-xl focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin w-6 h-6" />
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <Sparkles className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <p className="text-slate-500 text-sm">
              Official Alumni Database Access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}