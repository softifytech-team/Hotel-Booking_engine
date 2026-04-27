"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Search, Plus, BedDouble, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function RoomsPage() {
  const router = useRouter();
  const { orgId } = useParams();
  const { orgHotels, orgRooms, addRoom, uploadImages, deleteUploadedImages, selectedHotelId, setSelectedHotelId, loading, activeOrg } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    roomNumber: "",
    type: "Standard",
    price: "",
    maxGuests: 2,
    floor: "",
    features: "",
    image: "",
    imageFile: null,
  });

  // Resolve hotel context from selectedHotelId
  const hotelContext = orgHotels.find((h) => String(h.id) === String(selectedHotelId));

  // Filter rooms: if hotel selected, show only that hotel's rooms
  const baseRooms = selectedHotelId
    ? orgRooms.filter((r) => String(r.hotelId) === String(selectedHotelId))
    : orgRooms;

  const filteredRooms = search
    ? baseRooms.filter(
        (r) =>
          String(r.roomNumber).toLowerCase().includes(search.toLowerCase()) ||
          r.type?.toLowerCase().includes(search.toLowerCase())
      )
    : baseRooms;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file), imageFile: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.roomNumber || !formData.price || !selectedHotelId) return;
    setSubmitting(true);
    let image = null;
    let uploadedPublicIds = [];
    if (formData.imageFile) {
      const orgSlug = activeOrg?.name?.toLowerCase().replace(/\s+/g, "-") || "general";
      const { urls, publicIds } = await uploadImages([formData.imageFile], `hotel-saas/${orgSlug}/rooms`);
      image = urls[0];
      uploadedPublicIds = publicIds;
    }
    try {
      await addRoom({ ...formData, image, hotelId: selectedHotelId, orgId });
    } catch {
      await deleteUploadedImages(uploadedPublicIds);
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    setIsModalOpen(false);
    setFormData({ roomNumber: "", type: "Standard", price: "", maxGuests: 2, floor: "", features: "", image: "", imageFile: null });
  };

  const isLoading = loading.rooms;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/org/${orgId}/hotels`)}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              {hotelContext ? `${hotelContext.name} — Rooms` : "Room Inventory"}
            </h1>
            <p className="text-slate-500 text-[14px] font-medium mt-0.5">
              {hotelContext
                ? `${baseRooms.length} unit${baseRooms.length !== 1 ? "s" : ""} in this property`
                : "Select a hotel from the hotels page to manage its rooms."}
            </p>
          </div>
        </div>
        {selectedHotelId && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Room
          </button>
        )}
      </div>

      {/* No hotel selected */}
      {!selectedHotelId && (
        <div className="border-4 border-dashed border-slate-200 rounded-[40px] py-28 flex flex-col items-center bg-slate-50/50">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-5 border border-slate-100">
            <BedDouble className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-black text-slate-800">No Hotel Selected</h3>
          <p className="text-slate-500 mt-2 font-medium max-w-xs text-center text-sm leading-relaxed">
            Go to the Hotels page and click "Manage Rooms" on a property.
          </p>

          {/* Quick-select hotel buttons */}
          {orgHotels.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              {orgHotels.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHotelId(h.id)}
                  className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
                >
                  {h.name}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => router.push(`/org/${orgId}/hotels`)}
            className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
          >
            Go to Hotels
          </button>
        </div>
      )}

      {/* Rooms table */}
      {selectedHotelId && (
        <Card className="overflow-hidden border-slate-200/50 shadow-sm bg-white rounded-[28px]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 w-72 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all shadow-sm">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700"
              />
            </div>
            <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {baseRooms.filter((r) => r.status === "Available").length} Available
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="py-4 pl-6 text-[11px] font-black uppercase tracking-widest">Room</TableHead>
                  <TableHead className="text-[11px] font-black uppercase tracking-widest">Type</TableHead>
                  <TableHead className="text-[11px] font-black uppercase tracking-widest">Capacity</TableHead>
                  <TableHead className="text-[11px] font-black uppercase tracking-widest">Price</TableHead>
                  <TableHead className="text-[11px] font-black uppercase tracking-widest">Status</TableHead>
                  <TableHead className="text-right pr-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.map((room) => (
                  <TableRow key={room.id} className="group hover:bg-indigo-50/30 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shadow-inner overflow-hidden flex-shrink-0">
                          {room.image ? (
                            <img src={room.image} alt="Room" className="w-full h-full object-cover" />
                          ) : (
                            <BedDouble className="w-5 h-5" />
                          )}
                        </div>
                        <span className="font-black text-slate-900 text-base">#{room.roomNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-slate-700">{room.type}</span>
                      {room.floor && (
                        <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                          Floor {room.floor}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-bold text-slate-600">
                        {room.maxGuests || 0} {(room.maxGuests || 0) === 1 ? "Guest" : "Guests"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-black text-slate-900 text-base">${room.price}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={room.status === "Available" ? "success" : room.status === "Maintenance" ? "warning" : "default"}>
                        {room.status || "Available"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <button
                        onClick={() => router.push(`/org/${orgId}/bookings`)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 text-[11px] font-black opacity-0 group-hover:opacity-100 transition-all uppercase tracking-wide"
                      >
                        Bookings
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRooms.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16 text-slate-400 font-bold">
                      No rooms found. Add your first room.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </Card>
      )}

      {/* Add Room Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Room">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">
                Room Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 101"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">
                Price / Night *
              </label>
              <input
                type="number"
                required
                placeholder="150"
                min="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">
                Room Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 outline-none transition-all"
              >
                <option>Standard</option>
                <option>Deluxe</option>
                <option>Executive Suite</option>
                <option>Presidential</option>
                <option>Family</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">
                Floor
              </label>
              <input
                type="text"
                placeholder="e.g. 3"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">
              Max Guests *
            </label>
            <input
              type="number"
              required
              min="1"
              max="20"
              value={formData.maxGuests}
              onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">
              Amenities (comma separated)
            </label>
            <input
              type="text"
              placeholder="WiFi, AC, Ocean View, King Bed"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black tracking-widest text-slate-500 mb-1.5 uppercase">
              Room Image
            </label>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <BedDouble className="w-5 h-5 text-slate-300" />
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
              className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Add Room
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
