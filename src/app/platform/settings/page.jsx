"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { 
  Building2, CreditCard, ShieldAlert, Zap, 
  Server, Activity, Globe, Scale
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function SettingsPage() {
  const { role, ROLES } = useAuth();
  
  if (role !== ROLES.SUPER_ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-12">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Access Denied</h2>
        <p className="text-slate-500 mt-2 font-medium">Platform settings are restricted to Super Administrators.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Infrastructure Settings</h1>
          <p className="text-slate-500 text-[15px] font-medium mt-1">Configure global multi-tenant policies, payouts, and system health.</p>
        </div>
        <div className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest leading-none">System Operational</span>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Global Payouts */}
        <Card className="border-slate-200/60 shadow-sm bg-white rounded-[32px] overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/30">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-indigo-500" />
              <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Global Payout Gateway</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="p-5 rounded-[24px] bg-slate-50 border border-slate-200/60 flex items-center justify-between group hover:bg-white hover:border-indigo-200 transition-all">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                     <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                     <p className="text-sm font-black text-slate-900">Stripe Connect (Master)</p>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Handling global tenant disbursements</p>
                  </div>
               </div>
               <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100">Live</Badge>
            </div>
            <div className="space-y-2">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">PLATFORM SERVICE FEE (%)</label>
               <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:bg-white focus:border-indigo-500 transition-all" defaultValue="15" />
            </div>
            <button className="w-full py-4 rounded-2xl bg-slate-900 text-white text-[12px] font-black tracking-widest uppercase shadow-xl hover:bg-slate-800 transition-all">
               Update Payout Logic
            </button>
          </CardContent>
        </Card>

        <div className="space-y-8">
           {/* Infrastructure Health */}
           <Card className="border-slate-200/60 shadow-sm bg-white rounded-[32px] overflow-hidden">
             <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/30">
               <div className="flex items-center gap-3">
                 <Server className="w-5 h-5 text-indigo-500" />
                 <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Cluster Health</CardTitle>
               </div>
             </CardHeader>
             <CardContent className="p-8 space-y-5">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                   <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Main API Node</span>
                   </div>
                   <span className="text-[10px] font-black text-emerald-600">99.9% Uptime</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                   <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-indigo-500" />
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">CDN Distribution</span>
                   </div>
                   <span className="text-[10px] font-black text-emerald-600">Global (24 PoPs)</span>
                </div>
             </CardContent>
           </Card>

           {/* Provisioning Policies */}
           <Card className="border-slate-200/60 shadow-sm bg-white rounded-[32px] overflow-hidden">
             <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/30">
                <div className="flex items-center gap-3">
                  <Scale className="w-5 h-5 text-indigo-500" />
                  <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Provisioning Limits</CardTitle>
               </div>
             </CardHeader>
             <CardContent className="p-8 space-y-6">
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <p className="text-[11px] font-black text-slate-500 uppercase">Max Hotels per Tenant</p>
                     <span className="text-sm font-black text-slate-900">50</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <p className="text-[11px] font-black text-slate-500 uppercase">Max Rooms per Asset</p>
                     <span className="text-sm font-black text-slate-900">500</span>
                  </div>
               </div>
               <button className="w-full py-4 rounded-2xl border-2 border-slate-200 text-slate-900 text-[11px] font-black tracking-widest uppercase hover:bg-slate-50 transition-all">
                 Configure Tier Limits
               </button>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
