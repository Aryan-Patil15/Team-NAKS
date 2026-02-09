import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  MapPin,
  Mail,
  Award,
  Star,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
};

const Profile = () => {
  const navigate = useNavigate();
  
  const activeName = decodeURIComponent(getCookie("userName") || "Alumni Member");
  const activeEmail = getCookie("userEmail") || "Not logged in";
  
  const initials = activeName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    document.cookie = "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 pt-10">
      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden"
      >
        <div className="px-8 py-8">
          {/* Avatar and Name Area */}
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left border-b border-slate-800 pb-8 mb-8">
            <div className="h-24 w-24 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-blue-500/20 shrink-0">
              {initials}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h1 className="text-3xl font-black text-white tracking-tight">{activeName}</h1>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 gap-1 px-3 py-1">
                  <BadgeCheck className="h-4 w-4" />
                  Verified Alumni
                </Badge>
              </div>
              <p className="text-slate-400 text-sm mt-2 font-medium">
                Mumbai University Network · Class of 2024
              </p>
            </div>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="shrink-0 gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20 transition-all"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem icon={User} label="Full Name" value={activeName} />
            <InfoItem icon={Mail} label="Contact Email" value={activeEmail} />
            <InfoItem icon={MapPin} label="Current Location" value="Mumbai, India" />
          </div>
        </div>
      </motion.div>

      {/* Verification Status */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Award className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-bold text-white tracking-tight">University Credentials</h2>
        </div>
        
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <Star className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Official Alumni Member</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Your profile is verified and linked to your Mumbai University records. You have full access to post jobs and network with students.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
      <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800">
        <Icon className="h-4 w-4 text-blue-500" />
      </div>
      <div className="overflow-hidden">
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{label}</p>
        <p className="text-sm font-semibold text-slate-200 truncate">{value}</p>
      </div>
    </div>
  );
}

export default Profile;