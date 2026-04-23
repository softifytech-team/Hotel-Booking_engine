"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home, Building2 } from "lucide-react";
import { useAuth, ROLES } from "@/context/AuthContext";

export function Breadcrumbs() {
  const pathname = usePathname();
  const { role, organizations, activeOrg, activeHotel } = useAuth();
  
  if (pathname === "/") return null;
  
  const segments = pathname.split("/").filter(Boolean);
  
  // Transform segments for display
  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    let label = segment.charAt(0).toUpperCase() + segment.slice(1);
    
    // Handle specific dynamic segments
    if (segment === "org") return null; // Skip "org" word
    
    // Replace IDs with Names
    if (index > 0 && segments[index-1] === "org") {
       const org = organizations.find(o => o.id === segment);
       label = org ? org.name : segment;
    }
    
    if (segment === "dashboard") label = "Overview";
    if (segment === "staff") label = "Team";

    return { label, href };
  }).filter(Boolean);

  return (
    <nav className="flex items-center space-x-2 text-[12px] font-bold text-slate-400">
      <Link href="/" className="flex items-center hover:text-indigo-600 transition-colors">
        <Home className="w-3.5 h-3.5" />
      </Link>
      
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <React.Fragment key={crumb.href}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <Link 
              href={crumb.href}
              className={`transition-colors whitespace-nowrap ${isLast ? 'text-slate-900 font-extrabold cursor-default' : 'hover:text-indigo-600'}`}
              onClick={(e) => isLast && e.preventDefault()}
            >
              {crumb.label}
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
