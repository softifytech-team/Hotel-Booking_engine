"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, ROLES } from "@/context/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function PlatformLayout({ children }) {
  const { role, isAuthenticated, switchWorkspace } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Clear the active organization context when in platform mode
    switchWorkspace(null);

    if (!isAuthenticated) {
      router.push("/login");
    } else if (role !== ROLES.SUPER_ADMIN) {
      // If a non-admin tries to access platform routes, send them away
      router.push("/");
    }
  }, [role, isAuthenticated, router, ROLES, switchWorkspace]);

  if (!isAuthenticated || role !== ROLES.SUPER_ADMIN) return null;

  return (
    <div className="flex w-full h-full">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        <Topbar />
        <main className="flex-1 overflow-y-auto w-full">
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
