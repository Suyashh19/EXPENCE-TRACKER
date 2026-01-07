import React from "react";
import Navbar from "../components/Navbar";

const Profile = () => {
  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-24 md:pb-10">
      <Navbar />

      <div className="
        rounded-3xl md:rounded-[4rem]
        thin-glass
        p-6 sm:p-8 md:p-12
        shadow-2xl
        flex flex-col
        items-center
        text-center
      ">
        {/* AVATAR */}
        <div className="
          w-24 h-24
          sm:w-28 sm:h-28
          md:w-32 md:h-32
          rounded-full
          bg-gradient-to-tr from-blue-500 to-purple-500
          border-4 border-white/50
          mb-4 sm:mb-6
          shadow-xl
        " />

        {/* NAME */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
          Jubed Ahmed
        </h2>

        {/* ROLE */}
        <p className="text-sm sm:text-base text-slate-400 font-bold">
          Hackathon Participant
        </p>

        {/* STATS */}
        <div className="
          mt-8 sm:mt-10
          grid grid-cols-1 sm:grid-cols-2
          gap-4
          w-full
          max-w-md
        ">
          <div className="p-5 sm:p-6 rounded-3xl bg-white/10 border border-white/40">
            <p className="text-xs font-black text-slate-400 uppercase">
              Tier
            </p>
            <p className="text-lg sm:text-xl font-bold">
              Pro Member
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white/10 border border-white/40">
            <p className="text-xs font-black text-slate-400 uppercase">
              Joined
            </p>
            <p className="text-lg sm:text-xl font-bold">
              Dec 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
