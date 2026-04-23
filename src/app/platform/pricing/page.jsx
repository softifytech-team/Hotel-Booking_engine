"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { XCircle, CalendarRange, Percent, DollarSign } from "lucide-react";

export default function PricingManagement() {
  const { role, ROLES } = useAuth();
  
  if (![ROLES.SUPER_ADMIN, ROLES.HOTEL_ADMIN].includes(role)) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-12">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold tracking-tight">Access Denied</h2>
        <p className="text-muted-foreground mt-2">You do not have permission to view Pricing Management.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pricing</h1>
          <p className="text-muted-foreground mt-1">Configure base prices, seasonal multipliers, and discounts.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Base Pricing Context */}
        <Card>
          <CardHeader>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <DollarSign className="w-5 h-5" />
            </div>
            <CardTitle>Base Default Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Set up flat rates for your rooms during normal operations.</p>
            <button className="w-full py-2 bg-muted text-foreground font-medium rounded-md text-sm hover:bg-muted/80 transition-colors">
              Manage Base Rates
            </button>
          </CardContent>
        </Card>

        {/* Seasonal Pricing */}
        <Card>
          <CardHeader>
             <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
              <CalendarRange className="w-5 h-5" />
            </div>
            <CardTitle>Seasonal Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Increase or decrease rates based on high and low seasons.</p>
            <button className="w-full py-2 bg-muted text-foreground font-medium rounded-md text-sm hover:bg-muted/80 transition-colors">
              Configure Seasons
            </button>
          </CardContent>
        </Card>

        {/* Discounts */}
        <Card>
          <CardHeader>
             <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
              <Percent className="w-5 h-5" />
            </div>
            <CardTitle>Discounts & Promos</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground mb-4">Create coupon codes, long-stay discounts, or early bird bonuses.</p>
            <button className="w-full py-2 bg-muted text-foreground font-medium rounded-md text-sm hover:bg-muted/80 transition-colors">
              View Discounts
            </button>
          </CardContent>
        </Card>
      </div>
      
      {/* Active Seasonal Configs Mock */}
      <Card>
        <CardHeader>
          <CardTitle>Active Multipliers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
               <div>
                 <h4 className="font-semibold text-sm">Summer Peak</h4>
                 <p className="text-xs text-muted-foreground mt-1">Jun 1, 2024 - Aug 31, 2024</p>
               </div>
               <div className="text-right">
                 <span className="inline-block px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded text-xs font-bold">+25% Base Rate</span>
               </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
               <div>
                 <h4 className="font-semibold text-sm">Winter Slump</h4>
                 <p className="text-xs text-muted-foreground mt-1">Jan 10, 2024 - Mar 15, 2024</p>
               </div>
               <div className="text-right">
                 <span className="inline-block px-2 py-1 bg-red-500/10 text-red-600 rounded text-xs font-bold">-15% Base Rate</span>
               </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
