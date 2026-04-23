"use client";

import React, { useState } from "react";
import { useAuth, ROLES } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { Search, Plus, Filter, ShieldAlert, ShieldCheck, Mail, Users as UsersIcon } from "lucide-react";

export default function UsersPage() {
  const { role, ROLES, users, addUser } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", userRole: ROLES.EMPLOYEE });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    addUser(formData);
    setTimeout(() => {
        setIsModalOpen(false);
        setFormData({ name: "", email: "", userRole: ROLES.EMPLOYEE });
    }, 200);
  };

  const filteredUsers = role === ROLES.SUPER_ADMIN ? users :
                        role === ROLES.ORG_OWNER ? users.filter(u => u.userRole !== ROLES.SUPER_ADMIN) :
                        users.filter(u => u.userRole === ROLES.EMPLOYEE);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
             {role === ROLES.SUPER_ADMIN ? "Global Directory" : "Team Members"}
          </h1>
          <p className="text-slate-500 text-[14px] font-medium mt-0.5">Manage administrative and operational access control levels.</p>
        </div>
        {role !== ROLES.EMPLOYEE && (
          <button 
             onClick={() => setIsModalOpen(true)}
             className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" /> Invite User
          </button>
        )}
      </div>

      <Card className="overflow-hidden border-slate-200/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
           <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-4 py-2 w-80 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all shadow-sm group">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500" />
              <input type="text" placeholder="Search people..." className="bg-transparent border-none outline-none w-full text-xs text-slate-700 font-medium" />
           </div>
           <button className="flex items-center gap-2 text-[12px] font-bold text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 transition-all">
              <Filter className="w-3.5 h-3.5" /> All Roles
           </button>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[11px] font-bold uppercase tracking-widest py-3">Account</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-widest">Authority Level</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-widest">Activity</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-widest">Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100/60">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-black/5 flex items-center justify-center font-bold text-xs ring-2 ring-transparent group-hover:ring-indigo-500/10 transition-all">
                       <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}&backgroundColor=f1f5f9`} className="rounded-full" alt="User" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-[14px] leading-tight">{user.name}</div>
                      <div className="flex items-center text-[11px] text-slate-400 font-semibold mt-0.5">
                        <Mail className="w-3 h-3 mr-1" /> {user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.userRole === ROLES.SUPER_ADMIN ? (
                      <ShieldAlert className="w-4 h-4 text-rose-500" />
                    ) : user.userRole === ROLES.ORG_OWNER ? (
                      <ShieldCheck className="w-4 h-4 text-indigo-500" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-slate-400" />
                    )}
                    <span className={`text-[12px] font-extrabold tracking-tight ${
                      user.userRole === ROLES.SUPER_ADMIN ? 'text-rose-600' :
                      user.userRole === ROLES.ORG_OWNER ? 'text-indigo-600' : 'text-slate-600'
                    }`}>
                      {user.userRole}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-[12px] text-slate-500 font-bold">{user.lastActive}</TableCell>
                <TableCell>
                  <Badge variant={user.status === 'Active' ? 'success' : 'outline'} className={user.status === 'Invited' ? 'bg-slate-100 text-slate-500 border-none' : ''}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                   <ActionMenu onEdit={() => {}} onDelete={() => {}} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredUsers.length === 0 && (
          <div className="py-24 flex flex-col items-center animate-in fade-in duration-700">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4 border border-slate-100">
                <UsersIcon className="w-10 h-10" />
             </div>
             <h3 className="text-lg font-bold text-slate-800">Directory is empty.</h3>
             <p className="text-sm text-slate-500 font-medium mt-1">Invite your team to begin collaboration.</p>
          </div>
        )}
      </Card>

      {/* Invite User Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Provision Access"
        description="Invite a new administrative or operational user to the Workspace."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
             <label className="block text-[11px] font-bold tracking-widest text-slate-400 mb-1.5 uppercase">FULL NAME</label>
             <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g John Doe" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-semibold" />
          </div>
          <div>
             <label className="block text-[11px] font-bold tracking-widest text-slate-400 mb-1.5 uppercase">EMAIL ADDRESS</label>
             <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="e.g team@company.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-semibold" />
          </div>
          <div>
             <label className="block text-[11px] font-bold tracking-widest text-slate-400 mb-1.5 uppercase">SYSTEM PERMISSIONS</label>
             <select value={formData.userRole} onChange={(e) => setFormData({...formData, userRole: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-semibold appearance-none cursor-pointer">
                <option value={ROLES.EMPLOYEE}>Employee - Operational View</option>
                <option value={ROLES.ORG_OWNER}>Org Owner - Full Property Control</option>
                {role === ROLES.SUPER_ADMIN && <option value={ROLES.SUPER_ADMIN}>Super Admin - Platform Access</option>}
             </select>
          </div>
          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-end gap-3">
             <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
             <button type="submit" className="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95">Send Invite</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
