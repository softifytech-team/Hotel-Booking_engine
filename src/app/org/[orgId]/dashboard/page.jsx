"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Building2, Wallet, Target, ArrowUpRight,
  Zap, CalendarDays, BedDouble, Loader2
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

const chartData = [
  { name: "Mon", revenue: 2400 },
  { name: "Tue", revenue: 1398 },
  { name: "Wed", revenue: 3800 },
  { name: "Thu", revenue: 3908 },
  { name: "Fri", revenue: 4800 },
  { name: "Sat", revenue: 5890 },
  { name: "Sun", revenue: 5390 },
];

export default function OrgDashboard() {
  const router = useRouter();
  const { activeOrg, orgHotels, orgBookings, orgRooms, orgPayments, loading } = useAuth();

  const isLoading = loading.organizations || loading.hotels;

  if (isLoading && !activeOrg) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!activeOrg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Building2 className="w-12 h-12 text-slate-200 mb-4" />
        <h2 className="text-xl font-black text-slate-700">Organization not found</h2>
        <p className="text-slate-400 text-sm mt-2">
          Please go back and select an organization.
        </p>
      </div>
    );
  }

  const totalRevenue = orgPayments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const availableRooms = orgRooms.filter((r) => r.status === "Available").length;
  const occupancyRate =
    orgRooms.length > 0
      ? Math.round(((orgRooms.length - availableRooms) / orgRooms.length) * 100)
      : 0;

  const activeBookings = orgBookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "CHECKED_IN"
  ).length;

  const stats = [
    {
      label: "Hotels",
      value: orgHotels.length,
      change: `${orgRooms.length} rooms`,
      trend: "up",
      icon: Building2,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Revenue (All Time)",
      value: `$${totalRevenue.toFixed(0)}`,
      change: `${orgPayments.filter((p) => p.status === "PAID").length} payments`,
      trend: "up",
      icon: Wallet,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Occupancy",
      value: `${occupancyRate}%`,
      change: `${availableRooms} available`,
      trend: occupancyRate > 50 ? "up" : "neutral",
      icon: Target,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Active Bookings",
      value: activeBookings,
      change: `${orgBookings.length} total`,
      trend: "up",
      icon: CalendarDays,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">{activeOrg.name}</h1>
        <p className="text-slate-500 text-[15px] font-medium mt-1">
          Organization dashboard · {activeOrg.code && (
            <span className="font-black text-slate-700 uppercase">{activeOrg.code}</span>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 border-slate-200/50 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600">
                <ArrowUpRight className="w-3 h-3" />
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
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 p-6 border-slate-200/50 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black tracking-tight text-slate-900">Revenue Trend</h3>
            <Badge variant="outline" className="text-[10px] font-black uppercase border-slate-200 text-slate-400">
              This Week
            </Badge>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 700, fill: "#94a3b8" }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 bg-slate-900 text-white relative overflow-hidden flex flex-col justify-between min-h-[320px]">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Zap className="w-32 h-32" />
          </div>
          <div>
            <Badge variant="outline" className="w-fit mb-4 bg-white/10 text-white border-white/20 text-[10px]">
              QUICK ACTIONS
            </Badge>
            <h3 className="text-xl font-black tracking-tight mb-2">Manage your workspace</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {orgHotels.length === 0
                ? "Get started by adding your first hotel property."
                : `${orgHotels.length} hotel${orgHotels.length !== 1 ? "s" : ""} · ${orgRooms.length} rooms · ${activeBookings} active bookings`}
            </p>
          </div>

          <div className="space-y-3 mt-6">
            <button
              onClick={() => router.push(`/org/${activeOrg.id}/hotels`)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" /> Manage Hotels
            </button>
            <button
              onClick={() => router.push(`/org/${activeOrg.id}/bookings`)}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <CalendarDays className="w-4 h-4" /> View Bookings
            </button>
            <button
              onClick={() => router.push(`/org/${activeOrg.id}/rooms`)}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <BedDouble className="w-4 h-4" /> Room Inventory
            </button>
          </div>
        </Card>
      </div>

      {/* Recent Bookings */}
      {orgBookings.length > 0 && (
        <Card className="p-6 border-slate-200/50 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black text-slate-900">Recent Bookings</h3>
            <button
              onClick={() => router.push(`/org/${activeOrg.id}/bookings`)}
              className="text-[12px] font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {orgBookings.slice(0, 5).map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl hover:bg-indigo-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs">
                    {b.guest?.charAt(0)?.toUpperCase() || "G"}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">{b.guest}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{b.room} · {b.hotel}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">${b.amount?.toFixed(2)}</p>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    b.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-600" :
                    b.status === "CHECKED_IN" ? "bg-blue-50 text-blue-600" :
                    b.status === "CHECKED_OUT" ? "bg-slate-100 text-slate-500" :
                    "bg-rose-50 text-rose-500"
                  }`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
