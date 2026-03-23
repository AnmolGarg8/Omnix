"use client";
import React from "react";
import Link from "next/link";
import { Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";

export const Topbar = () => {
  const pathname = usePathname();
  
  const getPageTitle = (path: string) => {
    if (path === "/dashboard") return "Dashboard";
    if (path.includes("/missions")) return "Missions";
    if (path.includes("/results")) return "Results";
    if (path.includes("/alerts")) return "Alerts";
    if (path.includes("/settings")) return "Settings";
    return "Dashboard";
  };

  return (
    <header style={{
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      borderBottom: '1px solid #1A2E1A',
      background: 'rgba(6,10,6,0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_8px_rgba(0,255,106,0.4)] transition-transform group-hover:scale-110">
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
          <span className="text-[20px] font-bold tracking-tight flex items-baseline leading-none">
            <span className="text-[#E8FFE8]">Agent</span>
            <span className="text-[#00FF6A]">For</span>
            <span className="text-[#E8FFE8]">It</span>
          </span>
        </Link>
        <div className="h-6 w-px bg-[#1A2E1A]"></div>
        <h1 className="text-[22px] font-bold text-[#E8FFE8] tracking-[-0.5px]">
          {getPageTitle(pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/dashboard/missions/new">
          <Button className="bg-[#00FF6A] text-[#060A06] hover:bg-[#00D156] font-semibold flex items-center gap-2 shadow-[0_0_16px_rgba(0,255,106,0.35)] rounded-lg transition-all hover:-translate-y-0.5 px-6">
            <Plus className="w-4 h-4" />
            New Mission
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="relative text-[#6B9E6B] hover:text-[#00FF6A] rounded-md h-10 w-10">
          <Bell className="w-5 h-5" />
          <Badge className="absolute top-1.5 right-1.5 px-1 min-w-[1rem] h-4 flex items-center justify-center bg-[#00FF6A] border-[#060A06] text-[#060A06] text-[9px] font-bold">
            3
          </Badge>
        </Button>
      </div>
    </header>
  );
};
