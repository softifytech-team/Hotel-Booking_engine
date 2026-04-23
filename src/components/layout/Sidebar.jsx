"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useAuth, ROLES } from "@/context/AuthContext";
import { 
  BarChart3, Building2, BedDouble, CalendarDays, 
  Users as UsersIcon, Settings, ChevronLeft,
  LogOut, ShieldCheck, Zap, DollarSign, LayoutDashboard,
  ShieldAlert
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { orgId } = useParams();
  const { role, ROLES, activeOrgId: ctxOrgId, isAuthenticated } = useAuth();
  const activeOrgIdFromParams = orgId;
  const activeOrgId = activeOrgIdFromParams || ctxOrgId;
  
  // Decide mode based on pathname for robustness
  const isOrgMode = pathname.startsWith('/org/');

  const globalMenu = [
    { name: "Dashboard", icon: BarChart3, path: "/platform/dashboard", roles: [ROLES.SUPER_ADMIN] },
    { name: "Organizations", icon: Building2, path: "/platform/organizations", roles: [ROLES.SUPER_ADMIN] },
    { name: "Hotels", icon: BedDouble, path: "/platform/hotels", roles: [ROLES.SUPER_ADMIN] },
    { name: "Inventory (Rooms)", icon: BedDouble, path: "/platform/rooms", roles: [ROLES.SUPER_ADMIN] },
    { name: "Global Payments", icon: DollarSign, path: "/platform/payments", roles: [ROLES.SUPER_ADMIN] },
    { name: "Platform Users", icon: UsersIcon, path: "/platform/users", roles: [ROLES.SUPER_ADMIN] },
    { name: "System Settings", icon: Settings, path: "/platform/settings", roles: [ROLES.SUPER_ADMIN] },
  ];

  const orgMenu = [
    { name: "Org Dashboard", icon: LayoutDashboard, path: `/org/${activeOrgId}/dashboard`, roles: [ROLES.ORG_OWNER, ROLES.EMPLOYEE, ROLES.SUPER_ADMIN] },
    { name: "Hotels", icon: BedDouble, path: `/org/${activeOrgId}/hotels`, roles: [ROLES.ORG_OWNER, ROLES.SUPER_ADMIN] },
    { name: "Inventory (Rooms)", icon: BedDouble, path: `/org/${activeOrgId}/rooms`, roles: [ROLES.ORG_OWNER, ROLES.EMPLOYEE, ROLES.SUPER_ADMIN] },
    { name: "Reservations", icon: CalendarDays, path: `/org/${activeOrgId}/bookings`, roles: [ROLES.ORG_OWNER, ROLES.EMPLOYEE, ROLES.SUPER_ADMIN] },
    { name: "Staff Directory", icon: UsersIcon, path: `/org/${activeOrgId}/staff`, roles: [ROLES.ORG_OWNER, ROLES.SUPER_ADMIN] },
    { name: "Org Payments", icon: DollarSign, path: `/org/${activeOrgId}/payments`, roles: [ROLES.ORG_OWNER, ROLES.SUPER_ADMIN] },
  ];

  let menuItems = isOrgMode ? [...orgMenu] : [...globalMenu];
  
  // If Super Admin and in Org Mode, ensure "Organizations" is still visible
  if (isOrgMode && role === ROLES.SUPER_ADMIN) {
    menuItems.unshift({ name: "Organizations", icon: Building2, path: "/platform/organizations", roles: [ROLES.SUPER_ADMIN] });
  }

  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  if (!isAuthenticated) return null;
 
  return (
    <aside className="w-[280px] bg-slate-900 h-screen flex flex-col relative z-40 transition-all border-r border-white/5">
      {/* Brand Header */}
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl ring-1 ring-white/10 group cursor-pointer overflow-hidden">
          <Zap className="w-7 h-7 text-white fill-white group-hover:rotate-12 transition-transform" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tighter">SaaSBook</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.25em] leading-none mt-1">
             {role === ROLES.SUPER_ADMIN ? "Platform Mode" : "Workspace Mode"}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto scrollbar-hide">
        <div className="mb-6 px-4">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
             {isOrgMode ? "Management Console" : "Infrastructure"}
           </p>
        </div>
        
        {filteredMenu.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[14px] font-bold transition-all relative group ${
                isActive 
                ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`} />
              {item.name}
              {isActive && (
                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5">
         <div className="p-4 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col gap-3">
            <div className="flex items-center gap-3">
               <ShieldCheck className="w-5 h-5 text-indigo-400" />
               <div className="flex-1">
                  <p className="text-[11px] font-black text-slate-100 leading-tight">License: 85% Usage</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Scale Available</p>
               </div>
            </div>
         </div>
      </div>
    </aside>
  );
}
