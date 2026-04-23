"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Search, Bell, ChevronDown, User, LogOut, Setting, 
  HelpCircle, Globe, ChevronRight, Building2, Check,
  UserCircle2
} from "lucide-react";
import { useAuth, ROLES } from "@/context/AuthContext";
import { useParams, usePathname, useRouter } from "next/navigation";
import Breadcrumb from "./Breadcrumb";
import { Badge } from "@/components/ui/Badge";

export default function Topbar() {
  const router = useRouter();
  const { orgId } = useParams();
  const { role, ROLES, organizations, activeOrg, switchWorkspace, logout, isAuthenticated, user } = useAuth();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrgSwitcherOpen, setIsOrgSwitcherOpen] = useState(false);
  
  const profileRef = useRef(null);
  const orgRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
      if (orgRef.current && !orgRef.current.contains(event.target)) setIsOrgSwitcherOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOrgSwitch = (id) => {
    switchWorkspace(id);
    router.push(`/org/${id}/dashboard`);
    setIsOrgSwitcherOpen(false);
  };

  const currentRole = orgId ? "Organization Owner" : role;

  if (!isAuthenticated) return null;

  return (
    <header className="h-[90px] bg-white_70 backdrop-blur-xl border-b border-slate-200/50 px-8 flex items-center justify-between sticky top-0 z-40">
      
      {/* Search & Breadcrumbs */}
      <div className="flex flex-col gap-1">
        <Breadcrumb />
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-1.5 w-80 group focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
           <Search className="w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-500" />
           <input type="text" placeholder="Global search..." className="bg-transparent border-none outline-none text-[12px] font-bold text-slate-700 w-full" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        
        {/* Notifications */}
        <button className="relative w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all group">
          <Bell className="w-5 h-5 group-hover:animate-bounce" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-2 ring-rose-500/10" />
        </button>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 pr-4 rounded-3xl bg-white border border-slate-200 hover:border-indigo-200 transition-all group shadow-sm"
          >
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden ring-2 ring-slate-100 ring-offset-2 transition-all group-hover:ring-indigo-500/20">
               <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=Admin&backgroundColor=f1f5f9`} alt="Profile" />
            </div>
            <div className="text-left">
               <div className="flex items-center gap-1.5">
                  <p className="text-[13px] font-black text-slate-900 tracking-tight leading-none">{user?.name || user?.email || "User"}</p>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
               </div>
               <Badge className={`px-1.5 py-0 text-[9px] font-black border-none uppercase mt-1 ${orgId ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
                  {currentRole}
               </Badge>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-[24px] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-5 py-3 border-b border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Security</p>
              </div>
              <div className="p-1">
                 <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 rounded-xl transition-all font-bold text-[13px] text-slate-700">
                    <UserCircle2 className="w-4 h-4 text-slate-400" /> My Profile
                 </button>
                 <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 rounded-xl transition-all font-bold text-[13px] text-slate-700">
                    <HelpCircle className="w-4 h-4 text-slate-400" /> Support Hub
                 </button>
              </div>
              <div className="mx-4 my-2 h-[1px] bg-slate-100" />
              <div className="p-1">
                 <button 
                  onClick={() => { logout(); router.push("/login"); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-rose-50 rounded-xl transition-all font-bold text-[13px] text-rose-600"
                 >
                    <LogOut className="w-4 h-4" /> Sign Out
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
