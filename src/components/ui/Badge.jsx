import React from "react";
import { cn } from "./Card";

const badgeVariants = {
  default: "bg-indigo-50 text-indigo-700 border-indigo-200/50",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
  warning: "bg-amber-50 text-amber-700 border-amber-200/50",
  destructive: "bg-rose-50 text-rose-700 border-rose-200/50",
  outline: "text-slate-600 border-slate-200",
};

export function Badge({ className, variant = "default", ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}
