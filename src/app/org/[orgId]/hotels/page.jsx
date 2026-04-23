"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { MapPin, Plus, Star, Home, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function HotelsPage() {
  const router = useRouter();
  const { orgId } = useParams();
  const { orgHotels, addHotel, activeOrg, setSelectedHotelId, loading, role, ROLES } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    location: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    image: "",
  });

  const handleBackToPlatform = () => {
    setSelectedHotelId(null);
    router.push("/platform/organizations");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: url }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.city || !formData.state) return;
    setSubmitting(true);
    await addHotel({ ...formData, orgId: parseInt(orgId) });
    setSubmitting(false);
    setIsModalOpen(false);
    setFormData({ name: "", city: "", state: "", location: "", phone: "", email: "", address: "", description: "", image: "" });
  };

  const handleViewRooms = (hotelId) => {
    setSelectedHotelId(hotelId);
    router.push(`/org/${orgId}/rooms`);
  };

  const isLoading = loading.hotels;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {role === ROLES.SUPER_ADMIN && (
            <button
              onClick={handleBackToPlatform}
              className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Hotels</h1>
            <p className="text-slate-500 text-[15px] font-medium mt-1">
              Manage properties for{" "}
              <span className="font-black text-slate-700">{activeOrg?.name || "your organization"}</span>.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-2 transform hover:-translate-y-1 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add Hotel
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        </div>
      )}

      {/* Hotels Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orgHotels.map((hotel) => (
            <Card
              key={hotel.id}
              className="group overflow-hidden flex flex-col border-slate-200/60 hover:border-indigo-300 shadow-sm transition-all card-hover bg-white rounded-[32px]"
            >
              <div className="h-36 relative w-full overflow-hidden bg-gradient-to-br from-indigo-100 to-violet-100">
                {hotel.image ? (
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Home className="w-12 h-12 text-indigo-200" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Badge
                  variant={hotel.status === "Active" ? "success" : "warning"}
                  className="absolute top-4 right-4 shadow-xl border-white/20 px-3 py-1 font-black uppercase tracking-widest text-[10px]"
                >
                  {hotel.status || "Active"}
                </Badge>
              </div>

              <CardContent className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-black text-xl text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                    {hotel.name}
                  </h3>
                </div>
                <div className="flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                  {hotel.city ? `${hotel.city}, ${hotel.state || ""}` : hotel.location || "—"}
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6 mb-6 bg-slate-50 border border-slate-100 rounded-[20px] p-4 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-all">
                  <div className="text-center">
                    <p className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] mb-1">Rooms</p>
                    <p className="text-lg font-black text-slate-900">{hotel.rooms || 0}</p>
                  </div>
                  <div className="text-center border-l border-r border-slate-200/60">
                    <p className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] mb-1">Staff</p>
                    <p className="text-lg font-black text-slate-900">{hotel.staff || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] mb-1">Rating</p>
                    <p className="text-lg font-black text-slate-900 flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {hotel.rating || "—"}
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  <button
                    onClick={() => handleViewRooms(hotel.id)}
                    className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-center text-[12px] font-black tracking-[0.15em] uppercase transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 group/btn"
                  >
                    Manage Rooms <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}

          {orgHotels.length === 0 && (
            <div className="col-span-full border-4 border-dashed border-slate-200 rounded-[40px] py-28 flex flex-col items-center bg-slate-50/50">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-5 border border-slate-100">
                <Home className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-800">No hotels yet</h3>
              <p className="text-slate-500 mt-2 font-medium max-w-xs text-center text-sm leading-relaxed">
                Add your first hotel property to get started.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl"
              >
                Add Hotel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Hotel Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Hotel"
        description="Add a new property to this organization's portfolio."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">
                Hotel Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Grand Palace Resort"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. New York"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">
                State *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="e.g. New York"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 234 567 890"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="hotel@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Luxury Ave, Suite 100"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief overview of the property..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">
              Property Image
            </label>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Home className="w-6 h-6 text-slate-300" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-[11px] text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-all cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100 flex justify-end gap-3">
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
              className="px-8 py-3 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Register Hotel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
