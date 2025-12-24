import React from "react";

const Login = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      {/* Background Blobs for Login Page */}
      <div className="glass-world fixed inset-0 -z-10">
        <div className="shine-blob blob-indigo"></div>
      </div>

      <div className="w-96 rounded-[3rem] thin-glass p-12 text-center shadow-2xl">
        <h2 className="text-3xl font-black text-slate-900">Login</h2>
        <p className="mt-4 text-slate-500">Welcome to Ecomic</p>
        <div className="mt-8 space-y-4">
           <input type="text" placeholder="Email" className="w-full rounded-2xl bg-white/20 p-4 border border-white/60 outline-none" />
           <button className="w-full rounded-2xl bg-blue-600 p-4 font-bold text-white shadow-lg">Enter</button>
        </div>
      </div>
    </div>
  );
};

export default Login; // This line fixes your error!