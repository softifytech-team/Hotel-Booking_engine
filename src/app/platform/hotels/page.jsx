"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { MapPin, Plus, Star, Home, ArrowRight, Building2 } from "lucide-react";

export default function PlatformHotelsPage() {
  const router = useRouter();
  const { hotels, organizations, addHotel } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    orgId: organizations?.[0]?.id || "",
    city: "",
    state: "",
    location: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    image: ""
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: url }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.city || !formData.state || !formData.orgId) return;
    await addHotel(formData);
    setIsModalOpen(false);
    setFormData({
      name: "",
      orgId: organizations?.[0]?.id || "",
      city: "",
      state: "",
      location: "",
      phone: "",
      email: "",
      address: "",
      description: "",
      image: ""
    });
  };

  const handleViewRooms = (hotelId) => {
    router.push(`/platform/rooms?hotelId=${hotelId}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Hotels</h1>
          <p className="text-slate-500 text-[15px] font-medium mt-1">Manage all hotel properties across platform tenants.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-2 transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" /> Add New Hotel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hotels.map((hotel) => {
          const org = organizations.find(o => o.id === hotel.orgId);
          return (
            <Card key={hotel.id} className="group overflow-hidden flex flex-col border-slate-200/60 hover:border-indigo-300 shadow-sm transition-all bg-white rounded-[32px]">
              <div className="relative h-32 w-full overflow-hidden bg-slate-200 flex items-center justify-center">
                {hotel.image && (hotel.image.startsWith("http") || hotel.image.startsWith("blob")) ? (
                  <img src={hotel.image} alt={hotel.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-3xl">
                    <Home className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Badge variant={hotel.status === "Active" ? "success" : "warning"} className="absolute top-5 right-5 shadow-xl border-white/20 px-4 py-1.5 font-black uppercase tracking-widest text-[10px]">
                  {hotel.status}
                </Badge>
              </div>

              <CardContent className="p-8 flex flex-col flex-1 gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-black text-2xl text-slate-900 tracking-tight uppercase">{hotel.name}</h3>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mt-2">{org?.name || "Standalone"}</p>
                  </div>
                  <ActionMenu />
                </div>

                <div className="flex items-center text-[11px] font-black text-slate-400 uppercase tracking-widest gap-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  {hotel.location}
                </div>

                <div className="grid grid-cols-3 gap-4 mt-5 bg-slate-50 border border-slate-100 rounded-[28px] p-5 transition-all group-hover:bg-indigo-50 group-hover:border-indigo-100">
                  <div className="text-center">
                    <p className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] mb-1">Inventory</p>
                    <p className="text-lg font-black text-slate-900">{hotel.rooms}</p>
                  </div>
                  <div className="text-center border-l border-r border-slate-200/60 px-2">
                    <p className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] mb-1">Staff</p>
                    <p className="text-lg font-black text-slate-900">{hotel.staff}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] mb-1">Rating</p>
                    <p className="text-lg font-black text-slate-900 flex items-center justify-center gap-1.5"><Star className="w-4 h-4 text-amber-500 fill-amber-500" />{hotel.rating}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleViewRooms(hotel.id)}
                  className="mt-auto py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-center text-[12px] font-black tracking-[0.15em] uppercase transition-all shadow-2xl shadow-indigo-500/10 active:scale-95"
                >
                  View Rooms
                </button>
              </CardContent>
            </Card>
          );
        })}

        {hotels.length === 0 && (
          <div className="col-span-full border-4 border-dashed border-slate-200 rounded-[40px] py-32 flex flex-col items-center bg-slate-50/50 animate-in fade-in zoom-in-95 duration-700">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl mb-6 border border-slate-100 ring-4 ring-white text-slate-200">
              <Building2 className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">No hotels registered yet.</h3>
            <p className="text-slate-500 mt-2 font-medium max-w-xs text-center leading-relaxed">Create your first property for a tenant to manage within the platform.</p>
            <button onClick={() => setIsModalOpen(true)} className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20">
              Add Hotel Now
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Platform Hotel"
        description="Register a hotel property under one of your tenant organizations."
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">Tenant Organization</label>
            <select
              required
              value={formData.orgId}
              onChange={(e) => setFormData({...formData, orgId: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all"
            >
              <option value="">Select organization</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">Hotel Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Grand Palace Resort"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="e.g. New York"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">State *</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                placeholder="e.g. NY"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">Location / Neighborhood (optional)</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="e.g. Downtown"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">Contact Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="e.g. +1 234 567 890"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">Contact Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="hotel@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="e.g. 123 Paradise Lane"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">Property Image</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Home className="w-6 h-6 text-slate-300" />
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-all cursor-pointer" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="A short description of the hotel"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold h-24 focus:border-indigo-500 transition-all resize-none"
            />
          </div>
          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-400">Cancel</button>
            <button type="submit" className="px-10 py-3 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">REGISTER HOTEL</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
