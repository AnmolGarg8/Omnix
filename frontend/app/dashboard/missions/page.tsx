"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getMissions } from "@/lib/api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Play, MoreVertical, Search, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MissionsPage() {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const data = await getMissions();
      setMissions(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active": return "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20";
      case "paused": return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20";
      case "failed": return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20";
      default: return "bg-[#94A3B8]/10 text-[#94A3B8] border-[#94A3B8]/20";
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black font-heading tracking-tight">Active Missions</h2>
          <p className="text-[#94A3B8]">Manage and monitor your browser automation agents.</p>
        </div>
        <Link href="/dashboard/missions/new">
          <Button className="bg-[#6366F1] hover:bg-[#5254E0] gap-2">
            <Plus className="w-5 h-5" /> Deploy New Agent
          </Button>
        </Link>
      </div>

      <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#1E1E2E] flex items-center justify-between gap-4">
           <div className="relative flex-1 max-w-md">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525B]" />
             <input 
               type="text" 
               placeholder="Search missions..." 
               className="w-full pl-10 h-10 bg-[#0A0A0F] border-[#1E1E2E] rounded-lg text-sm focus:border-[#6366F1] transition-colors"
             />
           </div>
           <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="bg-transparent border-[#1E1E2E] gap-2">
                <Filter className="w-4 h-4" /> Filter
              </Button>
           </div>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full bg-[#1E1E2E] rounded-xl" />)}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-[#0A0A0F]/50">
              <TableRow className="border-[#1E1E2E] hover:bg-transparent">
                <TableHead className="text-[#52525B] font-bold">Mission Name</TableHead>
                <TableHead className="text-[#52525B] font-bold">Status</TableHead>
                <TableHead className="text-[#52525B] font-bold">Schedule</TableHead>
                <TableHead className="text-[#52525B] font-bold">Intelligence</TableHead>
                <TableHead className="text-[#52525B] font-bold">Next Run</TableHead>
                <TableHead className="w-[100px] text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {missions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-[#52525B]">
                    No missions found. Deploy your first agent to start monitoring.
                  </TableCell>
                </TableRow>
              ) : (
                missions.map((mission) => (
                  <TableRow key={mission.mission_id} className="border-[#1E1E2E] transition-colors hover:bg-[#1E1E2E]/50 group">
                    <TableCell className="font-semibold py-4">
                      <Link href={`/dashboard/missions/${mission.mission_id}`} className="hover:text-[#6366F1] transition-colors">
                        {mission.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(mission.status)}>
                        {mission.status || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-[#94A3B8]">
                      {mission.schedule}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-[#A855F7]/10 text-[#A855F7] border-0">
                        {mission.category || "General"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-[#52525B]">
                      {mission.next_run || "Calculating..."}
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" className="group-hover:text-[#6366F1]">
                          <Play className="w-4 h-4" />
                       </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
