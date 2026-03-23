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
    <header className="h-16 flex items-center justify-between px-6 border-b border-[#1E1E2E] bg-[#0A0A0F]">
      <h1 className="text-xl font-heading font-semibold text-[#F1F5F9]">
        {getPageTitle(pathname)}
      </h1>

      <div className="flex items-center gap-4">
        <Link href="/dashboard/missions/new">
          <Button className="bg-[#6366F1] hover:bg-[#5254E0] flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Mission
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="relative text-[#94A3B8] hover:text-[#F1F5F9]">
          <Bell className="w-5 h-5" />
          <Badge className="absolute top-1 right-1 px-1 min-w-[1.25rem] h-5 flex items-center justify-center bg-[#EF4444] border-[#0A0A0F]">
            3
          </Badge>
        </Button>
      </div>
    </header>
  );
};
