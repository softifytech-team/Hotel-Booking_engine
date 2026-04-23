"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Search, Download, ArrowUpRight, Loader2, CreditCard, DollarSign } from "lucide-react";
import { useParams } from "next/navigation";

const methodBadge = (method) => {
  const map = { CASH: "default", CARD: "info", BANK_TRANSFER: "success", UPI: "success", OTHER: "default" };
  return map[method] || "default";
};

const statusVariant = (s) => {
  if (s === "PAID") return "success";
  if (s === "REFUNDED") return "warning";
  if (s === "FAILED") return "danger";
  return "default";
};

export default function OrgPaymentsPage() {
  const { orgId } = useParams();
  const { orgPayments, activeOrg, loading } = useAuth();

  const totalRevenue = orgPayments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const pendingAmount = orgPayments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const refundedAmount = orgPayments
    .filter((p) => p.status === "REFUNDED")
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Payments</h1>
          <p className="text-slate-500 text-[15px] font-medium mt-1">
            Financial ledger for{" "}
            <span className="font-black text-slate-700">{activeOrg?.name || "your organization"}</span>.
          </p>
        </div>
        <button className="px-5 py-2.5 rounded-2xl text-[12px] font-bold text-slate-600 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-all">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-2xl rounded-[28px]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-indigo-200 text-[11px] font-black uppercase tracking-[0.2em]">Total Revenue</p>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-black">${totalRevenue.toFixed(2)}</h2>
          <div className="flex items-center gap-1.5 mt-3 text-emerald-300 text-[11px] font-bold">
            <ArrowUpRight className="w-4 h-4" />
            {orgPayments.filter((p) => p.status === "PAID").length} successful transactions
          </div>
        </Card>

        <Card className="p-6 bg-white border-slate-200/60 shadow-sm rounded-[28px]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">Pending</p>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-900">${pendingAmount.toFixed(2)}</h2>
          <Badge variant="warning" className="mt-3 bg-amber-50 text-amber-600 border-none px-3 font-black text-[9px] uppercase">
            {orgPayments.filter((p) => p.status === "PENDING").length} pending
          </Badge>
        </Card>

        <Card className="p-6 bg-white border-slate-200/60 shadow-sm rounded-[28px]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">Refunded</p>
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-rose-400 rotate-180" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-900">${refundedAmount.toFixed(2)}</h2>
          <p className="text-slate-400 text-[10px] font-bold mt-3 uppercase tracking-widest">
            {orgPayments.filter((p) => p.status === "REFUNDED").length} refunds
          </p>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="overflow-hidden border-slate-200/60 shadow-sm bg-white rounded-[28px]">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 w-80 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700"
            />
          </div>
          <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">
            {orgPayments.length} records
          </span>
        </div>

        {loading.payments ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-4 pl-6 text-[11px] font-black uppercase tracking-widest">Transaction</TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-widest">Guest</TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-widest">Hotel / Room</TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-widest text-right pr-6">Amount</TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-widest">Method</TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-widest">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orgPayments.map((payment) => (
                <TableRow key={payment.id} className="group hover:bg-indigo-50/20 transition-all">
                  <TableCell className="pl-6 py-4">
                    <div className="font-black text-indigo-600 text-[12px] font-mono">
                      #{String(payment.id).slice(0, 8).toUpperCase()}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{payment.date}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-800 text-sm">{payment.guest}</div>
                    <div className="text-[10px] text-slate-400 font-bold">{payment.guest_email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-bold text-slate-700">{payment.hotel_name || "—"}</div>
                    <div className="text-[10px] text-slate-400 font-bold">
                      Room {payment.room_number || "—"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="text-base font-black text-slate-900">${parseFloat(payment.amount || 0).toFixed(2)}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={methodBadge(payment.method)} className="font-black text-[10px] uppercase">
                      {payment.method || "CASH"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(payment.status)} className="font-black text-[10px] uppercase">
                      {payment.status || "PAID"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {orgPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center">
                    <CreditCard className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="font-bold text-slate-400">No payment records yet</p>
                    <p className="text-sm text-slate-300 mt-1">Payments appear after bookings are completed.</p>
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
