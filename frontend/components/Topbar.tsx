"use client";
import React from "react";
import Link from "next/link";
import { Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";

export const Topbar = () => {
  const pathname = usePathname();
  
  // Dynamic page title based on route
  const getPageTitle = (path: string) => {
    if (path === "/dashboard") return "Dashboard";
    if (path.includes("/missions")) return "Missions";
    if (path.includes("/results")) return "Results";
    if (path.includes("/alerts")) return "Alerts";
    if (path.includes("/settings")) return "Settings";
    return "Dashboard";
  };

  return (
    <header className="h-[56px] flex items-center justify-between px-6 border-b border-[#1A2E1A] bg-[#060A06]/85 backdrop-blur-[12px] sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-[28px] h-[28px] bg-[#00FF6A] rounded-[6px] shadow-[0_0_12px_rgba(0,255,106,0.3)] flex items-center justify-center">
           <div className="w-4 h-4 bg-[#060A06] rounded-[2px]"></div>
        </div>
        <h1 className="text-xl font-heading font-bold text-[#E8FFE8]">
          {getPageTitle(pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/dashboard/missions/new">
          <Button className="bg-[#00FF6A] text-[#060A06] hover:bg-[#00D156] font-bold flex items-center gap-2 shadow-[0_0_16px_rgba(0,255,106,0.3)] hover:-translate-y-0.5 transition-all">
            <Plus className="w-4 h-4" />
            New Mission
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="relative text-[#6B9E6B] hover:text-[#00FF6A] holographic rounded-md">
          <Bell className="w-5 h-5" />
          <Badge className="absolute top-1 right-1 px-1 min-w-[1.25rem] h-5 flex items-center justify-center bg-[#FF4444] border-[#060A06] text-white">
            3
          </Badge>
        </Button>
      </div>
    </header>
  );
};
