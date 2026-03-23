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
    <header className="h-[64px] flex items-center justify-between px-6 border-b border-[#1A2E1A] bg-[#060A06]/85 backdrop-blur-[12px] sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_8px_rgba(0,255,106,0.4)]">
            <path d="M16 2L29.8564 10V22L16 30L2.14359 22V10L16 2Z" stroke="#00FF6A" strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="16" cy="16" r="3" fill="#00FF6A" />
            <circle cx="16" cy="6" r="1.5" fill="#00FF6A" />
            <circle cx="25" cy="11" r="1.5" fill="#00FF6A" />
            <circle cx="25" cy="21" r="1.5" fill="#00FF6A" />
            <circle cx="16" cy="26" r="1.5" fill="#00FF6A" />
            <circle cx="7" cy="21" r="1.5" fill="#00FF6A" />
            <circle cx="7" cy="11" r="1.5" fill="#00FF6A" />
            <path d="M16 16L16 6M16 16L25 11M16 16L25 21M16 16L16 26M16 16L7 21M16 16L7 11" stroke="#00FF6A" strokeWidth="1" strokeOpacity="0.5" />
            <path d="M25 11L29 7M29 7H26M29 7V10" stroke="#00FF6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 6L16 1M16 1L13 3M16 1L19 3" stroke="#00FF6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xl font-black tracking-tight flex items-baseline">
            <span className="text-[#E8FFE8]">Agent</span>
            <span className="text-[#00FF6A]">For</span>
            <span className="text-[#E8FFE8]">It</span>
          </span>
        </Link>
        <div className="h-6 w-px bg-[#1A2E1A]"></div>
        <h1 className="text-sm font-black text-[#6B9E6B] uppercase tracking-[2px]">
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
