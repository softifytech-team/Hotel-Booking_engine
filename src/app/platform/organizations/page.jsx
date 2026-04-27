"use client";

import React, { useState } from "react";
import { useAuth, ROLES } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { Search, Plus, Filter, Navigation, XCircle, Building2, Mail, Globe, ExternalLink, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrganizationsPage() {
  const router = useRouter();
  const { role, ROLES, organizations, createOrganization, uploadImages, switchWorkspace, activeOrgId, setActiveOrgId } = useAuth();

  // Reset activeOrgId when returning to platform organizations view
  React.useEffect(() => {
    setActiveOrgId(null);
  }, [setActiveOrgId]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    name: "", orgCode: "", website: "", ownerName: "", ownerEmail: "", phone: "", address: "", ownerPassword: "",
    logoUrl: "", logoFile: null,
    bannerImages: [], bannerFiles: [],
  });

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logoUrl: URL.createObjectURL(file), logoFile: file }));
    }
  };

  const handleBannersUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const urls = files.map((f) => URL.createObjectURL(f));
    setFormData(prev => ({
      ...prev,
      bannerImages: [...prev.bannerImages, ...urls],
      bannerFiles: [...prev.bannerFiles, ...files],
    }));
    e.target.value = "";
  };

  const removeBanner = (index) => {
    setFormData(prev => ({
      ...prev,
      bannerImages: prev.bannerImages.filter((_, i) => i !== index),
      bannerFiles: prev.bannerFiles.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    let logoUrl = null;
    let bannerImages = [];

    try {
      const orgSlug = formData.name.toLowerCase().replace(/\s+/g, "-");
      if (formData.logoFile) {
        const { urls } = await uploadImages([formData.logoFile], `hotel-saas/${orgSlug}/logos`);
        logoUrl = urls[0];
      }
      if (formData.bannerFiles.length > 0) {
        const { urls } = await uploadImages(formData.bannerFiles, `hotel-saas/${orgSlug}/banners`);
        bannerImages = urls;
      }
    } catch {
      setFormError("Image upload failed. Please check your connection and try again.");
      setSubmitting(false);
      return;
    }

    const result = await createOrganization({ ...formData, logoUrl, bannerImages });
    setSubmitting(false);
    if (result?.success) {
      setIsModalOpen(false);
      setFormData({ name: "", orgCode: "", website: "", ownerName: "", ownerEmail: "", phone: "", address: "", ownerPassword: "", logoUrl: "", logoFile: null, bannerImages: [], bannerFiles: [] });
      setFormError("");
    } else {
      setFormError(result?.error || "Something went wrong. Please try again.");
    }
  };

  const handleOpenWorkspace = (orgId) => {
    switchWorkspace(orgId);
    router.push(`/org/${orgId}/hotels`);
  };

  if (role !== ROLES.SUPER_ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mb-6 shadow-2xl shadow-rose-500/10 border border-rose-100">
           <Building2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Access Restricted</h2>
        <p className="text-slate-500 mt-2 font-medium max-w-xs text-center">Log in as Platform Admin to manage enterprises.</p>
        <button onClick={() => router.push("/login")} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-2xl hover:bg-slate-800 transition-all active:scale-95">
           Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Organizations</h1>
          <p className="text-slate-500 text-[15px] font-medium mt-1">Manage platform-level enterprise tenant provisioning.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-2 transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" /> New Organization
        </button>
      </div>

      <Card className="overflow-hidden border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
           <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-2.5 w-96 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all shadow-inner group">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500" />
              <input type="text" placeholder="Search enterprises..." className="bg-transparent border-none outline-none w-full text-sm text-slate-700 font-semibold" />
           </div>
           <button className="flex items-center gap-2 text-[13px] font-bold text-slate-600 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl shadow-sm hover:bg-slate-50 transition-all">
              <Filter className="w-3.5 h-3.5" /> Filters
           </button>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="text-[11px] font-black uppercase tracking-[0.1em] py-4 pl-6">Enterprise Mapping</TableHead>
              <TableHead className="text-[11px] font-black uppercase tracking-[0.1em] text-center">Service Tier</TableHead>
              <TableHead className="text-[11px] font-black uppercase tracking-[0.1em] text-center">Assets</TableHead>
              <TableHead className="text-[11px] font-black uppercase tracking-[0.1em]">Lifecycle</TableHead>
              <TableHead className="text-[11px] font-black uppercase tracking-[0.1em]"></TableHead>
              <TableHead className="text-right pr-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id} className="group hover:bg-indigo-50/20 transition-all">
                <TableCell className="pl-6 py-4">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200">
                        {org.logoUrl ? <img src={org.logoUrl} alt="Logo" className="w-full h-full object-cover" /> : <Building2 className="w-5 h-5 text-slate-400" />}
                     </div>
                     <div>
                       <div className="font-black text-slate-900 text-[15px] tracking-tight">{org.name}</div>
                       <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                         <div className="flex items-center text-[10px] text-slate-500 font-bold uppercase">
                           <Globe className="w-3 h-3 mr-1" /> {org.domain}
                         </div>
                       </div>
                     </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className={`inline-flex items-center text-[11px] font-black px-4 py-1.5 rounded-full border shadow-sm ${
                    org.plan === 'Enterprise' ? 'bg-violet-50 text-violet-700 border-violet-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                  }`}>
                    {org.plan}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                   <div className="text-[15px] font-black text-slate-800">{org.hotelsCount}</div>
                   <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Physical Units</div>
                </TableCell>
                <TableCell>
                  <Badge variant={org.status === 'Active' ? 'success' : 'warning'}>{org.status}</Badge>
                </TableCell>
                <TableCell>
                  <button 
                    onClick={() => handleOpenWorkspace(org.id)}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
                  >
                    Open Workspace
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-3">
                    <ActionMenu />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Enterprise Provisioning"
        description="Register a high-level organization workspace for a new hotel client."
      >
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="col-span-2">
               <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">ORGANIZATION LOGO</label>
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                     {formData.logoUrl ? <img src={formData.logoUrl} alt="Preview" className="w-full h-full object-cover" /> : <Building2 className="w-6 h-6 text-slate-300" />}
                  </div>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-all cursor-pointer" />
               </div>
            </div>
            <div className="col-span-2">
               <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">BANNER IMAGES (optional)</label>
               <input type="file" accept="image/*" multiple onChange={handleBannersUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-all cursor-pointer" />
               {formData.bannerImages.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                     {formData.bannerImages.map((url, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group">
                           <img src={url} alt={`Banner ${i + 1}`} className="w-full h-full object-cover" />
                           <button type="button" onClick={() => removeBanner(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">×</button>
                        </div>
                     ))}
                  </div>
               )}
               <p className="text-[10px] text-slate-400 font-medium mt-1.5">Upload one or more banner images for the organization profile.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">ORG NAME</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g Hilton" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all" />
               </div>
               <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">OWNER NAME</label>
                  <input type="text" required value={formData.ownerName} onChange={(e) => setFormData({...formData, ownerName: e.target.value})} placeholder="John Doe" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all" />
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">ORG CODE</label>
                  <input type="text" required value={formData.orgCode} onChange={(e) => setFormData({...formData, orgCode: e.target.value})} placeholder="e.g HILTON001" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all" />
               </div>
               <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">OWNER EMAIL</label>
                  <input type="email" required value={formData.ownerEmail} onChange={(e) => setFormData({...formData, ownerEmail: e.target.value})} placeholder="owner@example.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all" />
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">PHONE</label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+1 555-0000" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all" />
               </div>
               <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">PASSWORD</label>
                  <input type="password" required value={formData.ownerPassword} onChange={(e) => setFormData({...formData, ownerPassword: e.target.value})} placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all" />
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">ADDRESS</label>
                  <input type="text" value={formData.address} required onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Business address..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-500 transition-all" />
               </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">WEBSITE URL</label>
                  <input type="text" required value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} placeholder="https://www.hilton.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all" />
               </div>
            </div>
            {formError && (
              <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-2xl text-sm font-bold text-rose-600">
                {formError}
              </div>
            )}
            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
               <button type="button" onClick={() => { setIsModalOpen(false); setFormError(""); }} className="px-6 py-2.5 text-sm font-bold text-slate-400">Cancel</button>
               <button type="submit" disabled={submitting} className="px-10 py-3 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2">
                 {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                 {submitting ? "PROVISIONING..." : "PROVISION"}
               </button>
            </div>
        </form>
      </Modal>

    </div>
  );
}
