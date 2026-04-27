"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { Search, Plus, Filter, BedDouble, ArrowLeft, Loader2 } from "lucide-react";

export default function PlatformRoomsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hotels, rooms, organizations, addRoom, uploadImages, deleteUploadedImages } = useAuth();

  const hotelIdFilter = searchParams.get("hotelId");
  const hotelContext = hotels.find(h => String(h.id) === String(hotelIdFilter));
  const filteredRooms = hotelIdFilter ? rooms.filter(r => String(r.hotelId) === String(hotelIdFilter)) : rooms;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    hotelId: hotels?.[0]?.id || "",
    roomNumber: "",
    type: "Standard",
    price: "",
    maxGuests: 2,
    floor: "1",
    features: "",
    image: "",
    imageFile: null,
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: URL.createObjectURL(file), imageFile: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.roomNumber || !formData.price || !formData.hotelId) return;
    setSubmitting(true);
    let image = null;
    let uploadedPublicIds = [];
    if (formData.imageFile) {
      const hotel = hotels.find(h => String(h.id) === String(formData.hotelId));
      const org = organizations.find(o => String(o.id) === String(hotel?.orgId));
      const orgSlug = org?.name?.toLowerCase().replace(/\s+/g, "-") || "general";
      const { urls, publicIds } = await uploadImages([formData.imageFile], `hotel-saas/${orgSlug}/rooms`);
      image = urls[0];
      uploadedPublicIds = publicIds;
    }
    const hotel = hotels.find(h => h.id === formData.hotelId);
    try {
      await addRoom({ ...formData, image, orgId: hotel?.orgId || "" });
    } catch {
      await deleteUploadedImages(uploadedPublicIds);
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    setIsModalOpen(false);
    setFormData({
      hotelId: hotels?.[0]?.id || "",
      roomNumber: "",
      type: "Standard",
      price: "",
      maxGuests: 2,
      floor: "1",
      features: "",
      image: "",
      imageFile: null,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/platform/hotels")} className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              {hotelContext ? `${hotelContext.name} Inventory` : "Global Inventory"}
            </h1>
            <p className="text-slate-500 text-[14px] font-medium mt-0.5">
              Manage unit inventory across platform hotels.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-2 transform hover:-translate-y-1"
          disabled={hotels.length === 0}
        >
          <Plus className="w-4 h-4" /> Add Unit
        </button>
      </div>

      {hotels.length === 0 ? (
        <div className="border-4 border-dashed border-slate-200 rounded-[40px] py-32 flex flex-col items-center bg-slate-50/50 animate-in fade-in zoom-in-95 duration-700">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl mb-6 border border-slate-100 ring-4 ring-white text-slate-200">
            <BedDouble className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">No hotels available yet.</h3>
          <p className="text-slate-500 mt-2 font-medium max-w-xs text-center leading-relaxed">Create a hotel first from the Hotels page before adding rooms.</p>
          <button onClick={() => router.push("/platform/hotels")} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl">
            Add Hotel First
          </button>
        </div>
      ) : (
        <Card className="overflow-hidden border-slate-200/50 shadow-sm bg-white rounded-[32px]">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-2.5 w-96 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search units..." className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700" />
            </div>
            <Badge variant="outline" className="px-4 py-2 border-slate-200 bg-white text-slate-500 font-black">{hotelContext ? `Hotel: ${hotelContext.name}` : "All Hotels"}</Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-5 pl-8 text-[11px] font-black uppercase tracking-widest">Unit</TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-widest">Type</TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-widest">Rate</TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-widest">Status</TableHead>
                <TableHead className="text-right pr-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map((room) => {
                const hotel = hotels.find(h => h.id === room.hotelId);
                return (
                  <TableRow key={room.id} className="group hover:bg-indigo-50/30 transition-colors">
                    <TableCell className="pl-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shadow-inner overflow-hidden">
                          {room.image ? (
                            <img src={room.image} alt="Room" className="w-full h-full object-cover" />
                          ) : (
                            <BedDouble className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-lg">#{room.roomNumber}</div>
                          <div className="text-[11px] text-slate-400 uppercase tracking-[0.2em] mt-1">{hotel?.name || "Unknown Hotel"}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-600">{room.type}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                          Floor {room.floor || "—"} • {room.maxGuests || 0} Guests
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-black text-slate-900">${room.price}</TableCell>
                    <TableCell>
                      <Badge variant={room.status === "Available" ? "success" : "default"}>{room.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => router.push(`/platform/hotels`)} className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white text-[11px] font-black opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest">
                          Hotels
                        </button>
                        <ActionMenu />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Room"
        description="Create a new inventory unit for one of your hotels."
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">Hotel</label>
            <select
              required
              value={formData.hotelId}
              onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all"
            >
              <option value="">Select hotel</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>{hotel.name} ({organizations.find(org => org.id === hotel.orgId)?.name || "Unknown Tenant"})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">Room Number</label>
              <input
                type="text"
                required
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                placeholder="e.g. 101"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">Price ($)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="150"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">Max Guests</label>
              <input
                type="number"
                required
                min="1"
                max="20"
                value={formData.maxGuests}
                onChange={(e) => setFormData({ ...formData, maxGuests: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">Floor</label>
              <input
                type="text"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                placeholder="e.g. 1"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">Room Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all"
              >
                <option>Standard</option>
                <option>Deluxe</option>
                <option>Suite</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">Amenities (comma separated)</label>
            <input
              type="text"
              placeholder="WiFi, AC, Ocean View, King Bed"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">Room Image</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                {formData.image ? (
                  <img src={formData.image} alt="Room preview" className="w-full h-full object-cover" />
                ) : (
                  <BedDouble className="w-6 h-6 text-slate-200" />
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-all cursor-pointer" />
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-400">Cancel</button>
            <button type="submit" disabled={submitting} className="px-10 py-3 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Uploading..." : "ADD UNIT"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
