"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Search, UserPlus, Shield, UserCheck, Loader2, Users } from "lucide-react";

export default function StaffPage() {
  const { orgUsers, addStaff, activeOrg, loading } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userRole: "Employee",
  });

  const filteredUsers = orgUsers.filter(
    (u) =>
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitting(true);
    const result = await addStaff(formData);
    setSubmitting(false);
    if (result?.success !== false) {
      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "", userRole: "Employee" });
    }
  };

  const roleLabel = (role) => {
    if (role === "OWNER") return "Owner";
    if (role === "EMPLOYEE") return "Employee";
    return role || "Employee";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Staff</h1>
          <p className="text-slate-500 text-[15px] font-medium mt-1">
            Team members for{" "}
            <span className="font-black text-slate-700">{activeOrg?.name || "your organization"}</span>.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <UserPlus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      {/* Summary strip */}
      <div className="flex items-center gap-6 p-4 bg-white border border-slate-200/60 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Staff</p>
            <p className="text-xl font-black text-slate-900">{orgUsers.length}</p>
          </div>
        </div>
        <div className="w-px h-8 bg-slate-100" />
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active</p>
            <p className="text-xl font-black text-slate-900">
              {orgUsers.filter((u) => u.status === "Active").length}
            </p>
          </div>
        </div>
        <div className="w-px h-8 bg-slate-100" />
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <Shield className="w-4 h-4 text-violet-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Owners</p>
            <p className="text-xl font-black text-slate-900">
              {orgUsers.filter((u) => u.userRole === "OWNER").length}
            </p>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200/60 shadow-sm bg-white rounded-[28px]">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 w-80 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search team members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700"
            />
          </div>
          <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">
            {filteredUsers.length} member{filteredUsers.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading.users ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-4 pl-6 text-[11px] font-black uppercase tracking-widest">Member</TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-widest">Role</TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-widest">Status</TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-widest">Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="group hover:bg-indigo-50/20 transition-all">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || "U")}&backgroundColor=e0e7ff`}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-sm leading-tight">{user.name}</div>
                        <div className="text-[11px] text-slate-400 font-bold mt-0.5">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      {user.userRole === "OWNER" ? (
                        <Shield className="w-4 h-4 text-violet-500" />
                      ) : (
                        <UserCheck className="w-4 h-4 text-emerald-500" />
                      )}
                      {roleLabel(user.userRole)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "success" : "default"} className="font-black text-[10px] uppercase">
                      {user.status || "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[12px] font-bold text-slate-500">
                    {user.lastActive}
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-16 text-center">
                    <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="font-bold text-slate-400">No staff members yet</p>
                    <p className="text-sm text-slate-300 mt-1">Add your first team member.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Invite Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Staff Member">
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Michael Chen"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase">Work Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="staff@company.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase">
              Password <span className="text-slate-300 font-medium normal-case">(leave blank for auto-generated)</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Min 8 characters"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase">Access Role</label>
            <select
              value={formData.userRole}
              onChange={(e) => setFormData({ ...formData, userRole: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 outline-none transition-all"
            >
              <option value="Employee">Employee — Operational access</option>
              <option value="Org Owner">Owner — Administrative access</option>
            </select>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-[11px] font-bold text-amber-700">
              The staff member can log in immediately using their email and the provided password.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Add Member
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
