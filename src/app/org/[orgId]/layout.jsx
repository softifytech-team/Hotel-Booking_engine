"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, ROLES } from "@/context/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function OrgLayout({ children }) {
  const { orgId } = useParams();
  const { isAuthenticated, user, role, switchWorkspace } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Sync the active organization context with the URL
    if (orgId) {
      switchWorkspace(orgId);
    }
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    
    // Ensure ORG_OWNER only accesses their own org
    if (role !== ROLES.SUPER_ADMIN && user?.orgId !== orgId) {
      router.push(`/org/${user?.orgId}/dashboard`);
    }
  }, [orgId, isAuthenticated, user, role, router, ROLES]);

  if (!isAuthenticated) return null;

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
