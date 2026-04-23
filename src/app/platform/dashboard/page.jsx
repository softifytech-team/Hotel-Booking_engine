"use client";

import React, { useEffect } from "react";
import { useAuth, ROLES, PORTALS } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  Building2, Users, Wallet, Target, 
  ArrowUpRight, Zap, CalendarDays
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from "recharts";

const data = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 6890 },
  { name: 'Sat', revenue: 8390 },
  { name: 'Sun', revenue: 7490 },
];

export default function PlatformDashboard() {
  const router = useRouter();
  const { isAuthenticated, role, organizations, hotels, bookings, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (role !== ROLES.SUPER_ADMIN) {
      // If NOT a platform admin, redirect to their org dashboard if possible
      if (user?.orgId) {
        router.push(`/org/${user.orgId}/dashboard`);
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, role, router, user, ROLES]);

  if (!isAuthenticated || role !== ROLES.SUPER_ADMIN) return null;

  // Platform Admin View (Global Dashboard)
  const stats = [
    { label: "Active Tenants", value: organizations.length, change: "+12%", trend: "up", icon: Building2, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Global Revenue", value: "$412,850", change: "+18%", trend: "up", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Hotels", value: hotels.length, change: "+3", trend: "up", icon: Target, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Total Bookings", value: "1,204", change: "+150", trend: "up", icon: CalendarDays, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Platform Performance</h1>
          <p className="text-slate-500 text-[15px] font-medium mt-1">Cross-tenant infrastructure analytics and global growth metrics.</p>
        </div>
        <div className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest leading-none">Global Nodes Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 border-slate-200/50 bg-white shadow-sm border-b-4 !border-b-indigo-500/10">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black ${stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3 rotate-90" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8 border-slate-200/50 bg-white shadow-sm">
          <h3 className="text-xl font-black tracking-tight text-slate-900 mb-8">Aggregate Revenue Projection</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                   <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#94a3b8'}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 border-slate-200/50 bg-white h-full relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
              <Zap className="w-24 h-24" />
           </div>
           <h3 className="text-xl font-black tracking-tight mb-8">Tenant Activity</h3>
           <div className="space-y-6">
              {organizations.map((org, i) => (
                <div key={i} className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-indigo-600 text-xs border border-slate-100 uppercase">
                      {org.name.slice(0, 2)}
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 leading-tight">{org.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{org.hotelsCount} Assets</p>
                   </div>
                   <Badge variant="success" className="text-[9px] px-2">LIVE</Badge>
                </div>
              ))}
           </div>
        </Card>
      </div>
    </div>
  );
}
