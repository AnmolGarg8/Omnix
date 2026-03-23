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
import { Plus, Play, Search, Filter, Rocket, Target, Cpu } from "lucide-react";
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
      case "active": return "border-[#00FF6A]/30 text-[#00FF6A] bg-[#00FF6A]/5";
      case "running": return "bg-[#00FF6A] text-[#060A06] animate-pulse";
      case "paused": return "border-[#F59E0B]/30 text-[#F59E0B] bg-[#F59E0B]/5";
      case "failed": return "border-[#FF4444]/30 text-[#FF4444] bg-[#FF4444]/5";
      default: return "border-[#6B9E6B]/30 text-[#6B9E6B] bg-[#111A11]";
    }
  };

  return (
    <div className="space-y-12 p-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
             <Target className="w-10 h-10 text-[#00FF6A]" />
             Target Clusters
          </h2>
          <p className="text-[#6B9E6B] font-bold text-sm tracking-widest uppercase opacity-80">Orchestrate your autonomous agent swarms.</p>
        </div>
        <Link href="/dashboard/missions/new">
          <Button className="bg-[#00FF6A] text-[#060A06] hover:bg-[#00D156] font-bold gap-2 rounded-full px-8 shadow-[0_0_20px_rgba(0,255,106,0.3)] h-12">
            <Plus className="w-5 h-5" /> Deploy Swarm
          </Button>
        </Link>
      </div>

      <div className="cyber-card bg-[#0D130D]/80 border-[#1A2E1A] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#1A2E1A] flex items-center justify-between gap-6 bg-[#111A11]/30">
           <div className="relative flex-1 max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B9E6B]" />
             <input 
               type="text" 
               placeholder="IDENTIFY MISSION..." 
               className="w-full pl-12 h-12 bg-[#060A06] border-[#1A2E1A] rounded-xl text-xs font-bold uppercase tracking-widest focus:border-[#00FF6A] transition-all"
             />
           </div>
           <div className="flex items-center gap-3">
              <Button variant="outline" className="h-12 bg-transparent border-[#1A2E1A] gap-2 px-6 hover:bg-[#111A11] text-[#6B9E6B] font-bold uppercase tracking-widest text-[10px]">
                <Filter className="w-4 h-4" /> Filter SIGINT
              </Button>
           </div>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full bg-[#111A11] rounded-xl" />)}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-[#060A06]">
              <TableRow className="border-[#1A2E1A] hover:bg-transparent">
                <TableHead className="text-[#6B9E6B] font-black uppercase tracking-widest text-[10px] h-14 px-8">Nomenclature</TableHead>
                <TableHead className="text-[#6B9E6B] font-black uppercase tracking-widest text-[10px] h-14">Status</TableHead>
                <TableHead className="text-[#6B9E6B] font-black uppercase tracking-widest text-[10px] h-14">CRON</TableHead>
                <TableHead className="text-[#6B9E6B] font-black uppercase tracking-widest text-[10px] h-14">Class</TableHead>
                <TableHead className="text-[#6B9E6B] font-black uppercase tracking-widest text-[10px] h-14 px-8 text-right">Execution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {missions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-[#6B9E6B] font-bold uppercase tracking-widest opacity-40">
                    No active mission clusters detected.
                  </TableCell>
                </TableRow>
              ) : (
                missions.map((mission) => (
                  <TableRow key={mission.mission_id} className="border-[#1A2E1A] transition-colors hover:bg-[#00FF6A]/5 group animate-in fade-in slide-in-from-left duration-500">
                    <TableCell className="font-black py-6 px-8 text-[#E8FFE8] group-hover:text-[#00FF6A] transition-colors">
                      <Link href={`/dashboard/missions/${mission.mission_id}`} className="flex flex-col gap-1">
                        <span className="text-lg uppercase tracking-tight">{mission.name}</span>
                        <span className="text-[10px] font-mono text-[#6B9E6B]">REF://{mission.mission_id.substring(0,12)}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`uppercase text-[9px] font-black tracking-widest border px-3 py-1 ${getStatusColor(mission.status)}`}>
                        {mission.status || "IDLE"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[11px] font-mono text-[#6B9E6B] uppercase font-bold tracking-widest">
                      {mission.schedule}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-[#00FF6A]"></div>
                         <span className="text-[10px] font-black text-[#6B9E6B] uppercase tracking-widest">{mission.category || "GENERAL"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 text-right">
                       <Link href={`/dashboard/missions/${mission.mission_id}`}>
                          <Button size="icon" className="h-10 w-10 bg-[#111A11] border border-[#1A2E1A] hover:bg-[#00FF6A] text-[#00FF6A] hover:text-[#060A06] transition-all rounded-lg group/btn">
                             <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                       </Link>
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

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
