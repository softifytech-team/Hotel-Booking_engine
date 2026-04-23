"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  Building2, ShieldCheck, Mail, Lock, 
  ArrowRight, Zap,
  ChevronRight, Globe
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user, ROLES, PORTALS } = useAuth();
  const [activePortal, setActivePortal] = useState(PORTALS.PLATFORM);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
        if (user.role === ROLES.SUPER_ADMIN) {
            router.push("/platform/dashboard");
        } else if (user.orgId) {
            router.push(`/org/${user.orgId}/dashboard`);
        }
    }
  }, [isAuthenticated, user, router, ROLES]);

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-200 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-xl relative animate-in fade-in zoom-in-95 duration-700">
         {/* Branding Header (Centered) */}
         <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[32px] bg-gradient-to-br from-indigo-600 to-violet-700 shadow-2xl shadow-indigo-500/30 mb-6 transform hover:rotate-6 transition-transform group cursor-pointer">
               <Zap className="w-10 h-10 text-white fill-white group-hover:scale-110 transition-transform" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">SaaSBook <span className="text-indigo-600">OS</span></h1>
            <p className="text-slate-500 font-medium mt-2 max-w-sm mx-auto">Accelerating the global hospitality infrastructure with multi-tenant intelligence.</p>
         </div>

         <div className="bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-200/60 overflow-hidden relative">
            <div className="p-10 md:p-12">
               {/* Portal Toggle */}
               <div className="flex p-1.5 bg-slate-100/80 rounded-2xl mb-10 border border-slate-200/40 backdrop-blur-sm">
                  <button 
                    onClick={() => setActivePortal(PORTALS.PLATFORM)}
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-[13px] font-black transition-all ${activePortal === PORTALS.PLATFORM ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <ShieldCheck className="w-4 h-4" /> Platform Admin
                  </button>
                  <button 
                    onClick={() => setActivePortal(PORTALS.CLIENT)}
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-[13px] font-black transition-all ${activePortal === PORTALS.CLIENT ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Building2 className="w-4 h-4" /> Client Portal
                  </button>
               </div>

               <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-5">
                    <div className="relative group">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                       <input 
                         type="email" 
                         required
                         placeholder={activePortal === PORTALS.PLATFORM ? "admin@saas.com" : "owner@example.com"}
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-700 placeholder:text-slate-300 text-sm" 
                       />
                       <label className="absolute -top-2.5 left-4 px-1 bg-white text-[10px] font-black text-slate-400 tracking-widest uppercase opacity-0 group-focus-within:opacity-100 transition-opacity">Email Identifier</label>
                    </div>

                    <div className="relative group">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                       <input 
                         type="password" 
                         required
                         placeholder="••••••••"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-700 placeholder:text-slate-300 text-sm" 
                       />
                       <label className="absolute -top-2.5 left-4 px-1 bg-white text-[10px] font-black text-slate-400 tracking-widest uppercase opacity-0 group-focus-within:opacity-100 transition-opacity">Secret Key</label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                     <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                        <span className="text-[12px] font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Keep Session Active</span>
                     </label>
                     <button type="button" className="text-[12px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">Forgot Key?</button>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-4.5 font-black text-[13px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-500/10 active:scale-[0.98] uppercase group"
                  >
                    Authenticate Access <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
               </form>

               <div className="mt-10 pt-8 border-t border-slate-100">
                  <div className="flex items-center justify-center gap-4">
                     <div className="flex -space-x-3">
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100" />
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400">+2k</div>
                     </div>
                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Global Security Compliance</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-10 left-0 w-full text-center px-6">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center justify-center gap-4">
            <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> Worldwide Nodes</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Encrypted Protocol</span>
         </p>
      </div>
    </div>
  );
}
