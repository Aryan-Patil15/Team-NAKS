import React, { useState } from 'react';
import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Eye, EyeOff, Loader2, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const usersRef = collection(db, "student");
        const q = query(usersRef, where("name", "==", username.trim()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            setError("Username not found in our records.");
        } else {
            let userAuthenticated = false;

            querySnapshot.forEach((doc) => {
            const userData = doc.data();

            if (userData.password === password) {
                userAuthenticated = true;
                
                // 1. Get the unique Firestore Document ID
                const dbId = doc.id; 

                // 2. Set the cookie (7-day expiry)
                Cookies.set('user_session', JSON.stringify({ userId: dbId }), { expires: 7 });

                // 3. Redirect to dashboard
                window.location.href = "/dashboard";
            }
            });

            // Only set this error if NONE of the documents matched the password
            if (!userAuthenticated) {
            setError("Incorrect password.");
            }
        }
        } catch (err) {
        console.error("Login Error:", err);
        setError("Database connection error.");
        } finally {
        setLoading(false);
        }
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1c2e]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Nexus<span className="text-cyan-400">Login</span></h2>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  className="w-full bg-[#0f1120] border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-purple-500/50"
                  placeholder="Enter username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full bg-[#0f1120] border border-white/5 rounded-2xl pl-12 pr-12 py-3.5 outline-none focus:ring-2 focus:ring-purple-500/50"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 py-4 rounded-2xl font-bold shadow-lg shadow-purple-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;