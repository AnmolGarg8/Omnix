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
import { Plus, Play, Search, Filter, Rocket, Target, Cpu, ArrowRight, BrainCircuit, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

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
      case "active": return "#00FF6A";
      case "running": return "#00FF6A";
      case "paused": return "#F59E0B";
      case "failed": return "#FF4444";
      default: return "#6B9E6B";
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-8 space-y-10 pb-32">
      {/* Header Section */}
      <div className="flex items-end justify-between pb-6 border-b border-[#1A2E1A]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold text-[#00FF6A] uppercase tracking-[3px] mb-2 opacity-70">
            <Rocket size={12} /> AGENT_SWARM_ORCHESTRATOR
          </div>
          <h2 className="text-3xl font-bold uppercase tracking-tight flex items-center gap-3 text-[#E8FFE8]">
            <div className="p-2 bg-[#00FF6A]/10 rounded-lg border border-[#00FF6A]/20">
              <Target size={28} className="text-[#00FF6A]" />
            </div>
            Target Clusters
          </h2>
          <p className="text-[#6B9E6B] text-xs font-medium uppercase tracking-[2px] ml-1">MANAGE & OPERATE YOUR AUTONOMOUS ASSETS</p>
        </div>
        
        <Link href="/dashboard/missions/new">
          <Button className="bg-[#00FF6A] text-[#060A06] hover:bg-[#00D156] font-bold gap-2 rounded-lg px-8 shadow-[0_4px_20px_rgba(0,255,106,0.15)] h-11 text-xs uppercase tracking-tight transition-all">
            <Plus size={16} strokeWidth={3} /> DEPLOY_NEW_SWARM
          </Button>
        </Link>
      </div>

      <Card className="cyber-card bg-[#0D130D]/80 border-[#1A2E1A] overflow-hidden shadow-2xl">
        {/* Search & Filter Bar */}
        <div className="p-6 border-b border-[#1A2E1A] flex items-center justify-between gap-6 bg-[#111A11]/30">
           <div className="relative flex-1 max-w-md group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B9E6B] group-focus-within:text-[#00FF6A] transition-colors" />
             <input 
               type="text" 
               placeholder="IDENTIFY MISSION_REF..." 
               className="w-full pl-12 h-11 bg-[#060A06] border border-[#1A2E1A] rounded-xl text-[11px] font-bold uppercase tracking-widest focus:border-[#00FF6A] transition-all outline-none text-[#E8FFE8] placeholder:opacity-30"
             />
           </div>
           
           <div className="flex items-center gap-3">
              <Button variant="outline" className="h-11 bg-transparent border-[#1A2E1A] gap-2 px-6 hover:bg-[#111A11] text-[#6B9E6B] font-bold uppercase tracking-widest text-[10px] hover:text-[#00FF6A]">
                <Filter className="w-3.5 h-3.5" /> Filter Signals
              </Button>
              <div className="w-[1px] h-6 bg-[#1A2E1A]"></div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#060A06] border border-[#1A2E1A]">
                <div className="w-2 h-2 rounded-full bg-[#00FF6A] animate-pulse shadow-[0_0_8px_#00FF6A]"></div>
                <span className="text-[10px] font-bold text-[#6B9E6B] uppercase tracking-widest">{missions.length} ACTIVE_NODES</span>
              </div>
           </div>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full bg-[#111A11] rounded-xl outline-none" />)}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-[#060A06]/50">
              <TableRow className="border-[#1A2E1A] hover:bg-transparent">
                <TableHead className="text-[#6B9E6B] font-bold uppercase tracking-widest text-[9px] h-12 px-8">Nomenclature</TableHead>
                <TableHead className="text-[#6B9E6B] font-bold uppercase tracking-widest text-[9px] h-12">Status_Pulse</TableHead>
                <TableHead className="text-[#6B9E6B] font-bold uppercase tracking-widest text-[9px] h-12">Sync_Schedule</TableHead>
                <TableHead className="text-[#6B9E6B] font-bold uppercase tracking-widest text-[9px] h-12">Swarm_Class</TableHead>
                <TableHead className="text-[#6B9E6B] font-bold uppercase tracking-widest text-[9px] h-12 px-8 text-right">Access</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {missions.length === 0 ? (
                <TableRow className="border-none">
                  <TableCell colSpan={5} className="h-60 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 opacity-30 grayscale">
                       <Target className="w-12 h-12 text-[#6B9E6B]" />
                       <p className="font-black uppercase tracking-[4px] text-xs">NO_ACTIVE_CLUSTERS_DETECTED</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                missions.map((mission) => (
                  <TableRow key={mission.mission_id} className="border-[#1A2E1A] transition-colors hover:bg-[#00FF6A]/5 group relative h-24">
                    {/* Status Strip */}
                    <td className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background: getStatusColor(mission.status) }}></td>
                    
                    <TableCell className="px-8 py-0">
                      <Link href={`/dashboard/missions/${mission.mission_id}`} className="flex flex-col gap-1 group/link">
                        <span className="text-sm font-bold uppercase tracking-wide text-[#E8FFE8] group-hover/link:text-[#00FF6A] transition-colors">{mission.name}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-mono text-[#6B9E6B] uppercase tracking-tighter opacity-60">ID://{mission.mission_id.substring(0,16)}</span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                         <div className={`w-1.5 h-1.5 rounded-full ${mission.status?.toLowerCase() === 'running' ? 'animate-ping' : ''}`} style={{ background: getStatusColor(mission.status) }}></div>
                         <Badge variant="outline" className="uppercase text-[8px] font-black tracking-widest px-2 py-0.5" style={{ color: getStatusColor(mission.status), borderColor: `${getStatusColor(mission.status)}44`, background: `${getStatusColor(mission.status)}11` }}>
                           {mission.status || "IDLE"}
                         </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-[10px] font-mono text-[#6B9E6B] uppercase font-bold tracking-[1px]">
                      {mission.schedule}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <div className="p-1 rounded bg-[#111A11] border border-[#1A2E1A]">
                           {mission.category === 'SOCIAL' ? <BrainCircuit size={10} className="text-[#00FF6A]" /> : <Globe size={10} className="text-[#00FF6A]" />}
                         </div>
                         <span className="text-[9px] font-bold text-[#6B9E6B] uppercase tracking-widest">{mission.category || "GENERAL"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 text-right">
                       <Link href={`/dashboard/missions/${mission.mission_id}`}>
                          <Button size="icon" className="h-9 w-9 bg-[#111A11] border border-[#1A2E1A] hover:bg-[#00FF6A] text-[#00FF6A] hover:text-[#060A06] transition-all rounded-lg group/btn shadow-[0_0_15px_rgba(0,0,0,0.4)]">
                             <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                       </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
