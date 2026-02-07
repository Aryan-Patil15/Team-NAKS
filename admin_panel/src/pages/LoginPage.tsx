import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

/* 🍪 Cookie helpers */
const setCookie = (name: string, value: string, days = 1) => {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const getCookie = (name: string) => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* 🔹 AUTO REDIRECT IF COOKIE + ACTIVE */
  useEffect(() => {
    const checkSession = async () => {
      const adminId = getCookie("admin_session");
      if (!adminId) return;

      const ref = doc(db, "admin", adminId);
      const snap = await getDoc(ref);

      if (snap.exists() && snap.data().status === "active") {
        navigate("/dashboard");
      }
    };

    checkSession();
  }, [navigate]);

  /* 🔹 LOGIN HANDLER */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);

    try {
      const adminRef = doc(db, "admin", username);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        alert("Invalid username");
        return;
      }

      const adminData = adminSnap.data();

      if (adminData.Password !== password) {
        alert("Invalid password");
        return;
      }

      // 🔹 Update DB status
      await updateDoc(adminRef, {
        recent_login: serverTimestamp(),
        status: "active",
      });

      // 🔹 Set cookie
      setCookie("admin_session", username);

      // 🔹 Redirect
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
