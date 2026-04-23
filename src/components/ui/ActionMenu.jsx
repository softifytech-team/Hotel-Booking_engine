"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Edit2, Trash2, Eye } from "lucide-react";

export function ActionMenu({ onEdit, onDelete, onView }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 rounded-lg transition-all ${isOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150">
          {onView && (
            <button 
              onClick={() => { onView(); setIsOpen(false); }}
              className="w-full px-3 py-2 text-left text-[12px] font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> View Details
            </button>
          )}
          {onEdit && (
            <button 
              onClick={() => { onEdit(); setIsOpen(false); }}
              className="w-full px-3 py-2 text-left text-[12px] font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Record
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => { onDelete(); setIsOpen(false); }}
              className="w-full px-3 py-2 text-left text-[12px] font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
