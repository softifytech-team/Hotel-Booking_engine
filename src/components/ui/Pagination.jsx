"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ currentPage = 1, totalPages = 5, onPageChange }) {
  return (
    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/20">
      <p className="text-[12px] font-bold text-slate-500 tracking-tight">
        Showing <span className="text-slate-900">1-10</span> of <span className="text-slate-900">42</span> results
      </p>
      
      <div className="flex items-center gap-1.5">
        <button 
          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all disabled:opacity-30" 
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {[1, 2, 3, "...", 5].map((page, i) => (
          <button 
            key={i}
            className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-all ${
              page === currentPage 
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
              : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {page}
          </button>
        ))}
        
        <button 
          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all disabled:opacity-30"
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
