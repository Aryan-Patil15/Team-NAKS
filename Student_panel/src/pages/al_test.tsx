import React, { useState } from 'react';
import { db } from "../lib/firebase";
import { collection, writeBatch, doc } from "firebase/firestore";
import { Database, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// --- DATA & LOGIC SECTION ---
const alumniData = [
  {
    name: "Jayesh Shinde",
    phoneNumber: "8104732268",
    emailId: "jayeshshinde008@gmail.com",
    branch: "EXTC",
    yearOfPassing: "2022",
    employerDetails: "Brillio",
    designation: "Engineer",
    currentCity: "Mumbai",
    password:"jayesh2022"
  },
  {
    name: "Hrushikesh Panigrahi",
    phoneNumber: "9594128629",
    emailId: "hrushi.official@gmail.com",
    branch: "EXTC",
    yearOfPassing: "2015",
    employerDetails: "Quantiphi Analytics",
    designation: "Sr. Cybersecurity Engineer",
    currentCity: "Mumbai",
    password:"hrushi2015"
  },
  {
    name: "Mauli Pawar",
    phoneNumber: "8452071347",
    emailId: "pawarmauli16@gmail.com",
    branch: "EXTC",
    yearOfPassing: "2022",
    employerDetails: "Newfold Digital",
    designation: "Web Solutions Specialist",
    currentCity: "Mumbai",
    password:"mauli2022"
  },
  {
    name: "Rohit Kadav",
    phoneNumber: "9702657278",
    emailId: "rohitbkadav@gmail.com",
    branch: "EXTC",
    yearOfPassing: "2019",
    employerDetails: "Test Lead Engineer",
    designation: "Team Lead",
    currentCity: "Navi Mumbai",
    password:"rohit2019"
  },
  {
    name: "Zalak Pandya",
    phoneNumber: "8552032602",
    emailId: "zalakpandya7@gmail.com",
    branch: "EXTC",
    yearOfPassing: "2020",
    employerDetails: "LTIMindtree",
    designation: "Senior Cloud Engineer",
    currentCity: "Mumbai",
    password:"zalak2020"
  }
];

const seedDatabase = async () => {
  const batch = writeBatch(db);
  const studentRef = collection(db, "alumini");

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
      console.log("✅ Data successfully uploaded!");
    } catch (err) {
      console.error("❌ Error uploading data: ", err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center p-6 text-white font-sans">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/10 blur-[120px]" />

      <div className="max-w-md w-full bg-[#1a1c2e]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl text-center z-10">
        <div className="inline-flex p-4 bg-purple-500/10 rounded-full mb-6 text-purple-400">
          <Database size={48} />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Database Seeder</h1>
        <p className="text-slate-400 mb-8">
          Populate the <span className="text-cyan-400 font-mono">student</span> collection in your Firebase database.
        </p>

        {status === 'success' && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-2xl text-green-200 flex items-center justify-center gap-2">
            <CheckCircle2 size={20} />
            Data Uploaded!
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-200 flex items-center justify-center gap-2">
            <AlertCircle size={20} />
            Upload Failed. Check console.
          </div>
        )}

        <button
          onClick={handleSeed}
          disabled={status === 'loading'}
          className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all shadow-lg shadow-purple-500/20 active:scale-95"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            "Insert Alumni Data"
          )}
        </button>
      </div>
    </div>
  );
};

export default Test;