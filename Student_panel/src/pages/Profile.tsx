import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { MainLayout } from "@/components/layout/MainLayout";
import { LogOut, Loader2 } from "lucide-react"; 
import { useNavigate } from 'react-router-dom';
import { useStudent } from "../hooks/useStudents";

const Profile = () => {
  // Use the hook to handle all the Firebase logic automatically
  const { student, loading, error } = useStudent();
  const navigate = useNavigate();

  // SECURITY: Redirect if session cookie is missing
  useEffect(() => {
    const session = Cookies.get('user_session');
    if (!session) {
      navigate('/signup');
    }
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove('user_session');
    navigate('/signup');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
          <Loader2 className="h-10 w-10 animate-spin text-[#8a4fff] mb-4" />
          <p className="animate-pulse text-gray-400">Fetching your profile...</p>
        </div>
      </MainLayout>
    );
  }

  // If there's an error or no student found after loading
  if (error || !student) {
    return (
      <MainLayout>
        <div className="text-center p-10 text-white">
          <p className="text-red-400 mb-4">Profile not found.</p>
          <button onClick={() => navigate('/signup')} className="text-[#2ed8ff] underline">
            Return to Signup
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto bg-[#1c162d] border border-white/10 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#8a4fff] to-[#2ed8ff] flex items-center justify-center text-2xl font-bold text-white shadow-[0_0_20px_rgba(138,79,255,0.3)]">
            {student.name?.[0]}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{student.name}</h1>
            <p className="text-gray-400 font-medium">
              {student.branch} <span className="mx-2 text-white/10">|</span> Class of {student.graduationYear}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard label="Email Address" value={student.emailId} />
          <InfoCard label="Phone Number" value={student.phoneNumber} />
          <InfoCard label="Department" value={student.branch} />
          <InfoCard label="Graduation Year" value={student.graduationYear} />
        </div>

        {/* Logout Button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-8 py-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all duration-300 group font-semibold"
          >
            <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Sign Out of Session
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

// Reusable Info Card Component
const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-[#251d3a] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
    <p className="text-[10px] text-gray-500 uppercase tracking-[2px] mb-1 font-bold group-hover:text-[#8a4fff] transition-colors">
      {label}
    </p>
    <p className="text-lg font-medium text-white">{value || 'Not Provided'}</p>
  </div>
);

export default Profile;