"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import {
  Search, CalendarDays, CheckCircle2, XCircle, LogOut,
  Loader2, Calendar
} from "lucide-react";

const STATUS_TABS = ["All", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"];

const statusVariant = (s) => {
  if (s === "CONFIRMED") return "success";
  if (s === "CHECKED_IN") return "info";
  if (s === "CHECKED_OUT") return "default";
  if (s === "CANCELLED") return "danger";
  return "default";
};

const statusLabel = (s) => {
  const map = { CONFIRMED: "Confirmed", CHECKED_IN: "Checked In", CHECKED_OUT: "Checked Out", CANCELLED: "Cancelled", PENDING: "Pending" };
  return map[s] || s;
};

export default function BookingsPage() {
  const { orgBookings, updateBookingStatus, loading } = useAuth();

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = orgBookings
    .filter((b) => activeTab === "All" || b.status === activeTab)
    .filter((b) =>
      search
        ? b.guest?.toLowerCase().includes(search.toLowerCase()) ||
          b.room?.toLowerCase().includes(search.toLowerCase()) ||
          b.hotel?.toLowerCase().includes(search.toLowerCase())
        : true
    );

  const counts = {
    All: orgBookings.length,
    CONFIRMED: orgBookings.filter((b) => b.status === "CONFIRMED").length,
    CHECKED_IN: orgBookings.filter((b) => b.status === "CHECKED_IN").length,
    CHECKED_OUT: orgBookings.filter((b) => b.status === "CHECKED_OUT").length,
    CANCELLED: orgBookings.filter((b) => b.status === "CANCELLED").length,
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Reservations</h1>
          <p className="text-slate-500 text-[14px] font-medium mt-0.5">
            {orgBookings.length} total booking{orgBookings.length !== 1 ? "s" : ""} for this organization.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200/50 shadow-sm bg-white rounded-[28px]">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/10">
          {/* Status Tabs */}
          <div className="flex bg-slate-100/60 p-1 rounded-xl w-fit border border-slate-200/50 gap-0.5 flex-wrap">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === tab
                    ? "bg-white text-indigo-600 shadow-sm border border-black/5"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab === "All" ? "All" : statusLabel(tab)}
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === tab ? "bg-indigo-50 text-indigo-600" : "bg-slate-200/60 text-slate-500"}`}>
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 w-64 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all shadow-sm">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search guest or hotel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-xs text-slate-700 font-medium"
            />
          </div>
        </div>

        {loading.bookings ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[11px] font-bold uppercase tracking-widest py-4 pl-6">Ref ID</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-widest">Guest</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-widest">Room / Hotel</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-widest">Stay</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-widest">Amount</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-widest">Status</TableHead>
                <TableHead className="text-right pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((booking) => (
                <TableRow key={booking.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-mono text-[11px] text-indigo-600 font-black pl-6 py-4">
                    #{String(booking.id).slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-800 text-sm">{booking.guest}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{booking.guestEmail}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-bold text-slate-700">{booking.room}</div>
                    <div className="text-[10px] text-slate-400 font-bold mt-0.5">{booking.hotel}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {booking.checkIn
                        ? new Date(booking.checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        : "—"}
                      {" → "}
                      {booking.checkOut
                        ? new Date(booking.checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        : "—"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-black text-slate-900">${booking.amount?.toFixed(2)}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(booking.status)}>
                      {statusLabel(booking.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                      {booking.status === "CONFIRMED" && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, "CHECKED_IN")}
                          title="Check In"
                          className="p-1.5 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      {booking.status === "CHECKED_IN" && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, "CHECKED_OUT")}
                          title="Check Out"
                          className="p-1.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      )}
                      {(booking.status === "CONFIRMED" || booking.status === "PENDING") && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, "CANCELLED")}
                          title="Cancel"
                          className="p-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center">
                    <CalendarDays className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="font-bold text-slate-400">No bookings found</p>
                    <p className="text-sm text-slate-300 mt-1">
                      {activeTab !== "All" ? "Try switching the status filter." : "Bookings will appear here once guests make reservations through the booking engine."}
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
