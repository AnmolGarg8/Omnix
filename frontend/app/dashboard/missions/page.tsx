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
import { Plus, Play, Search, Filter, Rocket, Target, Cpu, ArrowRight, BrainCircuit, Globe, Activity } from "lucide-react";
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
    <div className="max-w-6xl mx-auto px-10 py-12 space-y-16 pb-40">
      {/* Header Section */}
      <div className="space-y-10">
        <div className="flex items-end justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-[9px] font-bold text-[#00FF6A] uppercase tracking-[3px] opacity-60">
              <Activity size={12} /> AGENT_SWARM_ORCHESTRATOR
            </div>
            <h2 className="text-4xl font-bold uppercase tracking-tight flex items-center gap-4 text-[#E8FFE8]">
              <div className="p-2 bg-[#00FF6A]/10 rounded-lg border border-[#00FF6A]/20">
                <Target size={32} className="text-[#00FF6A]" />
              </div>
              Target Clusters
            </h2>
            <p className="text-[#6B9E6B] text-[11px] font-bold uppercase tracking-[2px] opacity-50">MANAGE & OPERATE YOUR AUTONOMOUS ASSETS</p>
          </div>
          
          <Link href="/dashboard/missions/new">
            <Button className="bg-[#00FF6A] text-[#060A06] hover:bg-[#00D156] font-bold gap-2 rounded-lg px-8 shadow-[0_4px_20px_rgba(0,255,106,0.15)] h-11 text-[10px] uppercase tracking-widest transition-all">
              <Plus size={14} strokeWidth={3} /> DEPLOY_NEW_SWARM
            </Button>
          </Link>
        </div>
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#1A2E1A] to-transparent"></div>
      </div>

      <Card className="cyber-card bg-[#0D130D]/30 border border-[#1A2E1A]/40 overflow-hidden shadow-none">
        {/* Search & Filter Bar */}
        <div className="p-8 border-b border-[#1A2E1A]/40 flex items-center justify-between gap-10 bg-[#111A11]/30">
           <div className="relative flex-1 max-w-sm group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B9E6B] opacity-50 group-focus-within:text-[#00FF6A] transition-colors" />
             <input 
               type="text" 
               placeholder="IDENTIFY MISSION_REF..." 
               className="w-full pl-12 h-10 bg-[#060A06] border border-[#1A2E1A]/40 rounded-lg text-[10px] font-bold uppercase tracking-widest focus:border-[#00FF6A] transition-all outline-none text-[#E8FFE8] placeholder:opacity-30"
             />
           </div>
           
           <div className="flex items-center gap-6">
              <Button variant="outline" className="h-10 bg-transparent border border-[#1A2E1A]/40 gap-2 px-6 hover:bg-[#111A11] text-[#6B9E6B] font-bold uppercase tracking-widest text-[9px] hover:text-[#00FF6A]">
                <Filter size={14} /> Filter Signals
              </Button>
              <div className="w-[1px] h-6 bg-[#1A2E1A]/40"></div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FF6A] animate-pulse shadow-[0_0_8px_#00FF6A]"></div>
                <span className="text-[10px] font-bold text-[#6B9E6B] uppercase tracking-widest opacity-60">{missions.length} ACTIVE_NODES</span>
              </div>
           </div>
        </div>

        {loading ? (
          <div className="p-10 space-y-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full bg-[#111A11] rounded-xl outline-none" />)}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-[#060A06]/30">
              <TableRow className="border-[#1A2E1A]/20 hover:bg-transparent">
                <TableHead className="text-[#6B9E6B] font-bold uppercase tracking-widest text-[9px] h-14 px-10">Nomenclature</TableHead>
                <TableHead className="text-[#6B9E6B] font-bold uppercase tracking-widest text-[9px] h-14">Status</TableHead>
                <TableHead className="text-[#6B9E6B] font-bold uppercase tracking-widest text-[9px] h-14">Schedule</TableHead>
                <TableHead className="text-[#6B9E6B] font-bold uppercase tracking-widest text-[9px] h-14 px-10 text-right">Access</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {missions.length === 0 ? (
                <TableRow className="border-none">
                  <TableCell colSpan={4} className="h-60 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 opacity-20 grayscale">
                       <Target className="w-12 h-12 text-[#6B9E6B]" />
                       <p className="font-black uppercase tracking-[4px] text-xs">NO_ACTIVE_CLUSTERS_DETECTED</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                missions.map((mission) => (
                  <TableRow key={mission.mission_id} className="border-[#1A2E1A]/20 transition-colors hover:bg-[#00FF6A]/5 group relative h-24">
                    <TableCell className="px-10 py-6">
                      <Link href={`/dashboard/missions/${mission.mission_id}`} className="flex flex-col gap-1 group/link">
                        <span className="text-sm font-bold uppercase tracking-wide text-[#E8FFE8] group-hover/link:text-[#00FF6A] transition-colors">{mission.name}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-mono text-[#6B9E6B] uppercase tracking-widest opacity-40">ID:{mission.mission_id.substring(0,8)}</span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                         <div className={`w-1 h-1 rounded-full ${mission.status?.toLowerCase() === 'running' ? 'animate-ping' : ''}`} style={{ background: getStatusColor(mission.status) }}></div>
                         <Badge variant="outline" className="uppercase text-[8px] font-black tracking-widest px-2 py-0.5 border-none" style={{ color: getStatusColor(mission.status), background: `${getStatusColor(mission.status)}11` }}>
                           {mission.status || "IDLE"}
                         </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-[10px] font-mono text-[#6B9E6B] uppercase font-bold tracking-widest opacity-60">
                      {mission.schedule}
                    </TableCell>
                    <TableCell className="px-10 text-right">
                       <Link href={`/dashboard/missions/${mission.mission_id}`}>
                          <Button size="icon" className="h-9 w-9 bg-[#111A11] border border-[#1A2E1A]/60 hover:bg-[#00FF6A] text-[#00FF6A] hover:text-[#060A06] transition-all rounded-lg group/btn shadow-none">
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
