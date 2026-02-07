import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin() {
    if (!name || !password) return alert("Enter name and password");

    setLoading(true);

    try {
      const q = query(
        collection(db, "faculty"),
        where("name", "==", name),
        where("password", "==", password)
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        alert("Invalid credentials");
      } else {
        // --- START COOKIE LOGIC ---
        
        // 1. Get ONLY the document ID
        const facultyId = snap.docs[0].id;

        // 2. Store only the ID in the cookie
        // max-age=86400 sets it to expire in 1 day (in seconds)
        // path=/ ensures it is available across the whole site
        document.cookie = `facultyId=${facultyId}; path=/; max-age=86400`;

        // --- END COOKIE LOGIC ---

        window.location.href = "/dashboard"; // Redirect to dashboard.
      }
    } catch (e) {
      console.error(e);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm rounded-xl border border-border/50 bg-card p-8 glow-card space-y-6">

        <h1 className="text-2xl font-semibold text-center text-foreground">
          Faculty Login
        </h1>

        {/* Name */}
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-secondary/40 border-border/50"
        />

        {/* Password */}
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-secondary/40 border-border/50 pr-10"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Login */}
        <Button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {loading ? "Signing in..." : "Login"}
        </Button>
      </div>
    </div>
  );
}