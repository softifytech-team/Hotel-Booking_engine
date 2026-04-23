"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, ROLES } from "@/context/AuthContext";

export default function RootRedirect() {
  const router = useRouter();
  const { isAuthenticated, role, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (role === ROLES.SUPER_ADMIN) {
      router.push("/platform/dashboard");
    } else if (role === ROLES.ORG_OWNER || role === ROLES.EMPLOYEE) {
      if (user?.orgId) {
        router.push(`/org/${user.orgId}/dashboard`);
      } else {
        router.push("/login"); // fallback
      }
    }
  }, [isAuthenticated, role, user, router]);

  return <div className="flex h-screen items-center justify-center bg-slate-50"><div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div></div>;
}
