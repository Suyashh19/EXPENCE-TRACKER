import React from "react";
import Navbar from "../components/Navbar";

const Profile = () => {
  return (
    <div className="flex flex-col gap-8">
      <Navbar />
      <div className="rounded-[4rem] thin-glass p-12 shadow-2xl flex flex-col items-center text-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-4 border-white/50 mb-6 shadow-xl"></div>
        <h2 className="text-3xl font-black text-slate-900">Jubed Ahmed</h2>
        <p className="text-slate-400 font-bold">Hackathon Participant</p>
        
        <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-md">
           <div className="p-6 rounded-3xl bg-white/10 border border-white/40">
              <p className="text-xs font-black text-slate-400 uppercase">Tier</p>
              <p className="text-xl font-bold">Pro Member</p>
           </div>
           <div className="p-6 rounded-3xl bg-white/10 border border-white/40">
              <p className="text-xs font-black text-slate-400 uppercase">Joined</p>
              <p className="text-xl font-bold">Dec 2025</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;