"use client";

import React from "react";
import { useAuth, ROLES } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Search, Filter, CreditCard, Download, ExternalLink, ArrowUpRight, DollarSign } from "lucide-react";

export default function PaymentsPage() {
  const { role, ROLES, transactions, orgTransactions } = useAuth();

  // Filter transactions based on role
  const filteredTransactions = role === ROLES.SUPER_ADMIN ? transactions : orgTransactions;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Payments</h1>
          <p className="text-slate-500 text-[15px] font-medium mt-1">Transaction ledger and automated billing oversight.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 rounded-2xl text-[13px] font-bold text-slate-600 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-2 transform hover:-translate-y-1">
            <DollarSign className="w-4 h-4" /> Settlement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-2xl shadow-indigo-500/20">
           <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                 <CreditCard className="w-5 h-5 text-indigo-100" />
              </div>
              <Badge variant="outline" className="bg-white/10 text-white border-white/20">MONTHLY</Badge>
           </div>
           <p className="text-indigo-100 text-[11px] font-black uppercase tracking-[0.2em]">Total Processing</p>
           <h2 className="text-3xl font-black mt-1">$42,910.00</h2>
           <div className="flex items-center gap-1.5 mt-4 text-emerald-300 text-[11px] font-bold">
              <ArrowUpRight className="w-4 h-4" /> 12% Growth this month
           </div>
        </Card>

        <Card className="p-6 bg-white border-slate-200/60 shadow-lg">
           <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100/50">
                 <DollarSign className="w-5 h-5 text-indigo-600" />
              </div>
              <Badge variant="success" className="bg-emerald-50 text-emerald-600 border-emerald-100">LIVE</Badge>
           </div>
           <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">Available Funds</p>
           <h2 className="text-3xl font-black text-slate-900 mt-1">$12,450.00</h2>
           <p className="text-slate-400 text-[10px] font-bold mt-4 uppercase">Next payout: Tomorrow</p>
        </Card>

        <Card className="p-6 bg-white border-slate-200/60 shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <CreditCard className="w-24 h-24" />
           </div>
           <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                 <ExternalLink className="w-5 h-5 text-slate-400" />
              </div>
           </div>
           <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">Active Disputes</p>
           <h2 className="text-3xl font-black text-slate-900 mt-1">2</h2>
           <p className="text-rose-500 text-[10px] font-bold mt-4 uppercase tracking-tighter">Requires Attention</p>
        </Card>
      </div>

      <Card className="overflow-hidden border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
           <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-2.5 w-96 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all shadow-inner group">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500" />
              <input type="text" placeholder="Search by amount, ID or guest..." className="bg-transparent border-none outline-none w-full text-sm text-slate-700 font-semibold" />
           </div>
           <button className="flex items-center gap-2 text-[13px] font-bold text-slate-600 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl shadow-sm hover:bg-slate-50 transition-all">
              <Filter className="w-3.5 h-3.5" /> All Methods
           </button>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="text-[11px] font-black uppercase tracking-[0.1em] py-4 pl-6">Transaction ID</TableHead>
              <TableHead className="text-[11px] font-black uppercase tracking-[0.1em]">Originator</TableHead>
              <TableHead className="text-[11px] font-black uppercase tracking-[0.1em]">Payment Method</TableHead>
              <TableHead className="text-[11px] font-black uppercase tracking-[0.1em]">System Status</TableHead>
              <TableHead className="text-right text-[11px] font-black uppercase tracking-[0.1em] pr-6">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((tx) => (
              <TableRow key={tx.id} className="group hover:bg-indigo-50/20 transition-all">
                <TableCell className="pl-6 py-4">
                  <div className="font-black text-indigo-600 text-[13px] font-mono tracking-tighter">{tx.id}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{tx.date}</div>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-slate-800 text-[14px]">{tx.guest}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
                    <CreditCard className="w-3.5 h-3.5" /> {tx.method}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={tx.status === 'Successful' ? 'success' : 'destructive'} className="uppercase font-black tracking-tighter shadow-sm border-none">
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="text-[16px] font-black text-slate-900 tracking-tight">${tx.amount.toFixed(2)}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
