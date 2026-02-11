import React, { useState } from 'react';
import { db } from "../lib/firebase";
import { collection, writeBatch, doc } from "firebase/firestore";
import { Database, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// --- UPDATED DATA & LOGIC SECTION ---
const alumniData = [
  {
    name: "Yogesh Singh",
    phoneNumber: "9833528038",
    emailId: "yogeshsingh2810@gmail.com",
    branch: "Computers",
    graduationYear: "2028",
    password: "yogesh2028",
    username: "yogesh2810" // Adding a username field for your login logic
  },
  {
    name: "Brendan Fernandes",
    phoneNumber: "7039362160",
    emailId: "bferns11@gmail.com",
    branch: "Mechanical",
    graduationYear: "2027",
    password: "brenden2027",
    username: "bferns11"
  },
  {
    name: "Sandeep kumar",
    phoneNumber: "9022682100",
    emailId: "sandeep1992@gmail.com",
    branch: "Civil",
    graduationYear: "2026",
    password: "sandeep2026",
    username: "sandeep1992"
  },
  {
    name: "Prathamesh Sarang",
    phoneNumber: "8082000608",
    emailId: "prathrocks12@gmail.com",
    branch: "Big Data",
    graduationYear: "2029",
    password: "prathamesh2029",
    username: "prathrocks12"
  },
  {
    name: "Simran Nazareth",
    phoneNumber: "7303557262",
    emailId: "simrannazareth25@gmail.com",
    branch: "AIDS",
    graduationYear: "2027",
    password: "simran2027",
    username: "simran25"
  },
  {
    name: "Anita Gupta",
    phoneNumber: "9664924682",
    emailId: "anitaguptaj@gmail.com",
    branch: "Computers",
    graduationYear: "2029",
    password: "anita2029",
    username: "anitaguptaj"
  }
];

const seedDatabase = async () => {
  const batch = writeBatch(db);
  // This will insert into the 'student' collection in 'alumini2' database
  const studentRef = collection(db, "student");

  alumniData.forEach((data) => {
    const newDocRef = doc(studentRef);
    batch.set(newDocRef, data);
  });

  await batch.commit();
};

// --- COMPONENT SECTION ---
const Test = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSeed = async () => {
    setStatus('loading');
    try {
      await seedDatabase();
      setStatus('success');
      console.log("✅ New Alumni data successfully uploaded!");
    } catch (err) {
      console.error("❌ Error uploading data: ", err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center p-6 text-white font-sans relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/10 blur-[120px]" />

      <div className="max-w-md w-full bg-[#1a1c2e]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl text-center z-10">
        <div className="inline-flex p-4 bg-cyan-500/10 rounded-full mb-6 text-cyan-400">
          <Database size={48} />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Nexus Data Seeder</h1>
        <p className="text-slate-400 mb-8">
          Ready to insert the latest batch of students into the <span className="text-purple-400 font-mono">student</span> collection.
        </p>

        {status === 'success' && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-2xl text-green-200 flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 size={20} />
            6 Records Uploaded Successfully!
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-200 flex items-center justify-center gap-2">
            <AlertCircle size={20} />
            Upload Failed. Check console logs.
          </div>
        )}

        <button
          onClick={handleSeed}
          disabled={status === 'loading'}
          className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all shadow-lg shadow-purple-500/20 active:scale-95 group"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="animate-spin" />
              <span>Syncing with Firebase...</span>
            </>
          ) : (
            <>
              <span>Insert New Student Batch</span>
            </>
          )}
        </button>
        
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-6 text-sm text-slate-500 hover:text-white transition-colors"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Test;