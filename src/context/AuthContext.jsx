"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";

const AuthContext = createContext();

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ORG_OWNER: "OWNER",
  EMPLOYEE: "EMPLOYEE",
};

export const PORTALS = {
  PLATFORM: "Platform Portal",
  CLIENT: "Client Portal",
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL.replace(/\/$/, '')}/api`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);

  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [activeOrgId, setActiveOrgId] = useState(null);

  const [organizations, setOrganizations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState({
    organizations: false,
    hotels: false,
    rooms: false,
    bookings: false,
    payments: false,
    users: false,
  });

  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const apiCall = async (endpoint, options = {}) => {
    const currentToken = token || (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);
    const headers = {
      "Content-Type": "application/json",
      ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
    };
    try {
      const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401 || res.status === 403) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
        }
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setRole(null);
        addToast("Session expired — please log in again.", "error");
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
        throw new Error("SESSION_EXPIRED");
      }
      if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
      return data;
    } catch (err) {
      if (err.message !== "SESSION_EXPIRED") addToast(err.message, "error");
      throw err;
    }
  };

  // Restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");
    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsed);
        setIsAuthenticated(true);
        setRole(parsed.role);
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    }
  }, []);

  // Fetch all data when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchOrganizations();
      fetchHotels();
      fetchRooms();
      fetchBookings();
      fetchPayments();
      fetchUsers();
    }
  }, [isAuthenticated, token, activeOrgId]); // eslint-disable-line

  // ─── Data Fetchers ────────────────────────────────────────

  const fetchOrganizations = async () => {
    setLoading((p) => ({ ...p, organizations: true }));
    try {
      const { data } = await apiCall("/fetchOrganizations");
      setOrganizations(
        data.map((o) => ({
          ...o,
          hotelsCount: parseInt(o.hotels_count || 0),
          logoUrl: o.logo_url || null,
          bannerImages: Array.isArray(o.banner_images) ? o.banner_images : [],
          domain: o.website || null,
          orgCode: o.code || null,
          ownerName: o.owner_name || null,
          ownerEmail: o.owner_email || null,
          status: o.status || "active",
        }))
      );
    } catch (err) {
      console.error("fetchOrganizations:", err.message);
    } finally {
      setLoading((p) => ({ ...p, organizations: false }));
    }
  };

  const fetchHotels = async () => {
    setLoading((p) => ({ ...p, hotels: true }));
    try {
      let endpoint = "/fetchHotels";
      const currentRole = role || JSON.parse(localStorage.getItem("auth_user") || "{}").role;
      const currentActiveOrgId = activeOrgId;
      if (currentRole === ROLES.SUPER_ADMIN && currentActiveOrgId) {
        endpoint += `?orgId=${currentActiveOrgId}`;
      }
      const { data } = await apiCall(endpoint);
      setHotels(
        data.map((h) => ({
          ...h,
          orgId: h.organization_id,
          rooms: parseInt(h.rooms_count || 0),
          image: h.image_urls?.length > 0 ? h.image_urls[0] : null,
        }))
      );
    } catch (err) {
      console.error("fetchHotels:", err.message);
    } finally {
      setLoading((p) => ({ ...p, hotels: false }));
    }
  };

  const fetchRooms = async () => {
    setLoading((p) => ({ ...p, rooms: true }));
    try {
      const { data } = await apiCall("/fetchRooms");
      setRooms(
        data.map((r) => ({
          ...r,
          hotelId: r.hotel_id,
          orgId: r.organization_id,
          roomNumber: r.room_number,
          price: parseFloat(r.price || 0),
          maxGuests: r.max_guests,
          image: r.image_urls?.length > 0 ? r.image_urls[0] : null,
        }))
      );
    } catch (err) {
      console.error("fetchRooms:", err.message);
    } finally {
      setLoading((p) => ({ ...p, rooms: false }));
    }
  };

  const fetchBookings = async () => {
    setLoading((p) => ({ ...p, bookings: true }));
    try {
      const { data } = await apiCall("/fetchBookings");
      setBookings(
        data.map((b) => ({
          ...b,
          orgId: b.organization_id,
          hotelId: b.hotel_id,
          guest: b.guest_name,
          guestEmail: b.guest_email,
          guestPhone: b.guest_phone,
          amount: parseFloat(b.total_price || 0),
          checkIn: b.check_in,
          checkOut: b.check_out,
          room: b.room_number ? `Room ${b.room_number}` : "",
          hotel: b.hotel_name || "",
          roomType: b.room_type || "",
        }))
      );
    } catch (err) {
      console.error("fetchBookings:", err.message);
    } finally {
      setLoading((p) => ({ ...p, bookings: false }));
    }
  };

  const fetchPayments = async () => {
    setLoading((p) => ({ ...p, payments: true }));
    try {
      const { data } = await apiCall("/fetchPayments");
      setPayments(
        data.map((p) => ({
          ...p,
          orgId: p.organization_id,
          guest: p.guest_name,
          date: p.created_at
            ? new Date(p.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "",
        }))
      );
    } catch (err) {
      console.error("fetchPayments:", err.message);
    } finally {
      setLoading((p) => ({ ...p, payments: false }));
    }
  };

  const fetchUsers = async () => {
    setLoading((p) => ({ ...p, users: true }));
    try {
      const { data } = await apiCall("/fetchUsers");
      setUsers(
        data.map((u) => ({
          ...u,
          orgId: u.organization_id,
          userRole: u.role,
          lastActive: u.last_active
            ? new Date(u.last_active).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "Never",
        }))
      );
    } catch (err) {
      console.error("fetchUsers:", err.message);
    } finally {
      setLoading((p) => ({ ...p, users: false }));
    }
  };

  // ─── Auth ─────────────────────────────────────────────────

  const login = async (email, password) => {
    try {
      const { data } = await apiCall("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const { user: loggedInUser, accessToken } = data;
      const uiUser = { ...loggedInUser, orgId: loggedInUser.organization_id };

      setToken(accessToken);
      setUser(uiUser);
      setIsAuthenticated(true);
      setRole(uiUser.role);

      localStorage.setItem("auth_token", accessToken);
      localStorage.setItem("auth_user", JSON.stringify(uiUser));

      addToast(`Welcome back, ${uiUser.name}!`);
      return { success: true, role: uiUser.role, orgId: uiUser.orgId };
    } catch {
      return { success: false };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
    setToken(null);
    setActiveOrgId(null);
    setOrganizations([]);
    setHotels([]);
    setRooms([]);
    setBookings([]);
    setPayments([]);
    setUsers([]);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    addToast("Logged out successfully");
  };

  // ─── CRUD Actions ─────────────────────────────────────────

  const createOrganization = async (orgData) => {
    try {
      // Ensure code is exactly 3 alphanumeric chars
      let rawCode = (orgData.orgCode || orgData.name || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
      rawCode = rawCode.substring(0, 3).padEnd(3, "X");

      const { data } = await apiCall("/createOrganization", {
        method: "POST",
        body: JSON.stringify({
          name: orgData.name,
          code: rawCode,
          ownerName: orgData.ownerName,
          ownerEmail: orgData.ownerEmail,
          ownerPassword: orgData.ownerPassword || "Welcome@123",
          website: orgData.website || null,
          phone: orgData.phone || null,
          address: orgData.address || null,
          logo_url: orgData.logoUrl || null,
          banner_images: Array.isArray(orgData.bannerImages) ? orgData.bannerImages : [],
        }),
      });
      addToast(`Organization "${orgData.name}" created!`);
      await fetchOrganizations();
      return { success: true, org: data.organization, user: data.owner };
    } catch (err) {
      return { success: false, error: err.message || "Failed to create organization" };
    }
  };

  const addHotel = async (hotelData) => {
    try {
      const currentRole = role || JSON.parse(localStorage.getItem("auth_user") || "{}").role;
      const payload = {
        name: hotelData.name,
        city: hotelData.city,
        state: hotelData.state,
        location: hotelData.location || `${hotelData.city}, ${hotelData.state}`,
        description: hotelData.description || null,
        phone: hotelData.phone || null,
        email: hotelData.email || null,
        address: hotelData.address || null,
        image_urls: hotelData.image ? [hotelData.image] : [],
      };
      if (currentRole === ROLES.SUPER_ADMIN) {
        payload.organization_id = hotelData.orgId || activeOrgId;
      }
      await apiCall("/createHotel", { method: "POST", body: JSON.stringify(payload) });
      addToast(`${hotelData.name} registered!`);
      await fetchHotels();
      await fetchOrganizations();
    } catch { /* error shown via toast */ }
  };

  const deleteHotel = async (hotelId) => {
    try {
      await apiCall(`/deleteHotel/${hotelId}`, { method: "DELETE" });
      addToast("Hotel deleted");
      await fetchHotels();
      await fetchOrganizations();
    } catch { /* error shown via toast */ }
  };

  const addRoom = async (roomData) => {
    try {
      const amenities = Array.isArray(roomData.amenities)
        ? roomData.amenities
        : roomData.features
          ? roomData.features.split(",").map((f) => f.trim()).filter(Boolean)
          : [];
      await apiCall("/createRoom", {
        method: "POST",
        body: JSON.stringify({
          hotel_id: roomData.hotelId,
          room_number: roomData.roomNumber,
          type: roomData.type,
          price: parseFloat(roomData.price),
          floor: roomData.floor || null,
          max_guests: parseInt(roomData.maxGuests) || 2,
          amenities,
          image_urls: roomData.image ? [roomData.image] : [],
        }),
      });
      addToast(`Room ${roomData.roomNumber} added!`);
      await fetchRooms();
      await fetchHotels();
    } catch { /* error shown via toast */ }
  };

  const deleteRoom = async (roomId) => {
    try {
      await apiCall(`/deleteRoom/${roomId}`, { method: "DELETE" });
      addToast("Room deleted");
      await fetchRooms();
    } catch { /* error shown via toast */ }
  };

  const addBooking = async (bookingData) => {
    try {
      // Step 1: Upsert customer
      const { data: customer } = await apiCall("/createCustomer", {
        method: "POST",
        body: JSON.stringify({
          name: bookingData.guestName,
          email: bookingData.guestEmail,
          phone: bookingData.guestPhone || null,
        }),
      });

      // Step 2: Build booking payload
      const currentRole = role || JSON.parse(localStorage.getItem("auth_user") || "{}").role;
      const payload = {
        room_id: bookingData.roomId,
        customer_id: customer.id,
        check_in: bookingData.checkIn,
        check_out: bookingData.checkOut,
        notes: bookingData.notes || null,
        adults_count: parseInt(bookingData.adultsCount) || 1,
        children_count: parseInt(bookingData.childrenCount) || 0,
      };
      if (currentRole === ROLES.SUPER_ADMIN) {
        payload.organization_id = activeOrgId;
      }

      const { data } = await apiCall("/createBooking", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      addToast(`Booking confirmed for ${bookingData.guestName}!`);
      await fetchBookings();
      await fetchRooms();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateBookingStatus = async (id, action) => {
    try {
      const endpointMap = {
        CHECKED_IN: `/checkInBooking/${id}`,
        checkin: `/checkInBooking/${id}`,
        CHECKED_OUT: `/checkOutBooking/${id}`,
        checkout: `/checkOutBooking/${id}`,
        CANCELLED: `/cancelBooking/${id}`,
        cancel: `/cancelBooking/${id}`,
      };
      const endpoint = endpointMap[action];
      if (!endpoint) return;
      await apiCall(endpoint, { method: "PATCH" });
      addToast("Booking status updated");
      await fetchBookings();
      await fetchRooms();
    } catch { /* error shown via toast */ }
  };

  const addStaff = async (staffData) => {
    try {
      const orgId = activeOrgId || user?.orgId;
      const result = await apiCall("/createUser", {
        method: "POST",
        body: JSON.stringify({
          name: staffData.name,
          email: staffData.email,
          password: staffData.password || undefined,
          role: staffData.userRole === "Org Owner" ? "OWNER" : "EMPLOYEE",
          organization_id: orgId,
        }),
      });
      addToast(`${staffData.name} added! ${result.message ? `(${result.message})` : ""}`);
      await fetchUsers();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const switchWorkspace = (orgId) => {
    setActiveOrgId(orgId);
  };

  // ─── Derived State ─────────────────────────────────────────

  const resolvedOrgId = activeOrgId || user?.orgId;

  const activeOrg = organizations.find((o) => String(o.id) === String(resolvedOrgId));
  const activeHotel = hotels.find((h) => String(h.id) === String(selectedHotelId));

  const orgHotels = hotels.filter((h) => String(h.orgId) === String(resolvedOrgId));
  const orgBookings = bookings.filter((b) => String(b.orgId) === String(resolvedOrgId));
  const orgUsers = users.filter((u) => String(u.orgId) === String(resolvedOrgId));
  const orgRooms = rooms.filter((r) => String(r.orgId) === String(resolvedOrgId));
  const orgPayments = payments.filter((p) => String(p.orgId) === String(resolvedOrgId));

  // Keep legacy `transactions` alias for any existing refs
  const transactions = payments;
  const orgTransactions = orgPayments;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        PORTALS,
        role,
        ROLES,
        loading,
        selectedHotelId,
        setSelectedHotelId,
        activeOrgId,
        setActiveOrgId,
        switchWorkspace,
        activeOrg,
        activeHotel,
        organizations,
        hotels,
        bookings,
        users,
        rooms,
        payments,
        transactions,
        orgHotels,
        orgBookings,
        orgUsers,
        orgRooms,
        orgPayments,
        orgTransactions,
        createOrganization,
        addHotel,
        deleteHotel,
        addRoom,
        deleteRoom,
        addStaff,
        addBooking,
        updateBookingStatus,
        fetchOrganizations,
        fetchHotels,
        fetchRooms,
        fetchBookings,
        fetchPayments,
        fetchUsers,
        addToast,
      }}
    >
      {children}

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="animate-in slide-in-from-right fade-in duration-300">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border bg-white pointer-events-auto max-w-sm ${
                toast.type === "success"
                  ? "border-emerald-100"
                  : toast.type === "info"
                  ? "border-sky-100"
                  : "border-rose-200"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  toast.type === "success"
                    ? "bg-emerald-50"
                    : toast.type === "info"
                    ? "bg-sky-50"
                    : "bg-rose-50"
                }`}
              >
                {toast.type === "error" ? (
                  <XCircle className="w-4 h-4 text-rose-500" />
                ) : toast.type === "info" ? (
                  <Info className="w-4 h-4 text-sky-500" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </div>
              <span className="text-sm font-bold text-slate-800 tracking-tight leading-tight">
                {toast.message}
              </span>
            </div>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
