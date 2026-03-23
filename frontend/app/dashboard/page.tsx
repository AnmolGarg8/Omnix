"use client";
import React, { useEffect, useState } from "react";
import { getMissions } from "@/lib/api";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Globe, 
  Zap, 
  Plus, 
  Rocket, 
  ArrowRight,
  Bell, 
  TrendingUp,
  BrainCircuit
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const EXAMPLES = [
  "Price tracking for Nike running shoes",
  "TechCrunch AI startup funding news",
  "Competitor landing page changes",
  "LinkedIn job postings for React Dev",
  "Amazon RTX 5090 stock availability"
];

export default function DashboardPage() {
  const [missions, setMissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    activeMissions: 0,
    totalRuns: 0,
    alertsSent: 0,
    sitesMonitored: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const missionsData = await getMissions();
        setMissions(missionsData || []);
        setStats({
          activeMissions: missionsData?.filter((m:any) => m.status === 'active')?.length || 0,
          totalRuns: missionsData?.reduce((acc:any, m:any) => acc + (m.total_runs || 0), 0) || 0,
          alertsSent: (missionsData?.length || 0) * 2, 
          sitesMonitored: missionsData?.reduce((acc:any, m:any) => acc + (m.agent_tasks?.length || 0), 0) || 0
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-12 pb-20 max-w-[1600px] mx-auto">
      {/* 4-Column Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Active Missions" value={stats.activeMissions} icon={<Activity className="w-4 h-4" />} />
        <StatCard label="Total Runs" value={stats.totalRuns} icon={<Zap className="w-4 h-4" />} />
        <StatCard label="Alerts Sent" value={stats.alertsSent} icon={<Bell className="w-4 h-4" />} />
        <StatCard label="Nodes Monitored" value={stats.sitesMonitored} icon={<Globe className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
        {/* Agent Swarm Section */}
        <div className="xl:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-[#E8FFE8] tracking-tight">
              <BrainCircuit className="w-4 h-4 text-[#00FF6A]" />
              Agent swarm
            </h3>
            <Link href="/dashboard/missions/new">
               <Button className="bg-[#00FF6A] text-[#060A06] hover:bg-[#00D156] font-semibold gap-2 rounded-lg px-6 shadow-[0_0_15px_rgba(0,255,106,0.3)] h-9 text-xs">
                 <Plus className="w-3.5 h-3.5" /> New mission
               </Button>
            </Link>
          </div>

          {missions.length === 0 ? (
            <div className="cyber-card p-20 text-center space-y-8 flex flex-col items-center bg-[#0D130D]/40 border-dashed border-[#1A2E1A]">
              <div className="w-20 h-20 rounded-full bg-[#111A11] border border-[#1A2E1A] flex items-center justify-center text-3xl shadow-inner shadow-[#00FF6A]/5">
                 🤖
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-[#E8FFE8] tracking-tight">Initialize intelligence</h4>
                <p className="text-xs text-[#6B9E6B] max-w-sm mx-auto leading-relaxed">No active missions detected. Deploy your first agent swarm to begin surveillance.</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {EXAMPLES.map((ex) => (
                  <Link key={ex} href={`/dashboard/missions/new?goal=${encodeURIComponent(ex)}`}>
                    <button className="text-[11px] font-medium px-4 py-2 rounded-full bg-[#0D130D] border border-[#1A2E1A] hover:border-[#00FF6A]/30 transition-all text-[#6B9E6B] hover:text-[#00FF6A] hover:bg-[#00FF6A]/5">
                      {ex}
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {missions.map(mission => (
                  <MissionCard key={mission.mission_id} mission={mission} />
                ))}
            </div>
          )}
        </div>

        {/* Signal Log Section */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-[#E8FFE8] tracking-tight">
            <Bell className="w-4 h-4 text-[#00FF6A]" />
            Signal log
          </h3>
          <div className="space-y-3">
            {[
              { id: 1, priority: 'CRITICAL', time: '2m ago', color: '#FF4444', text: 'Price drop detected on Target B-12' },
              { id: 2, priority: 'HIGH', time: '14m ago', color: '#FF6B35', text: 'Structural change in Competitor Alpha' },
              { id: 3, priority: 'MEDIUM', time: '1h ago', color: '#F59E0B', text: 'New job posting matched criteria' },
              { id: 4, priority: 'MEDIUM', time: '2h ago', color: '#F59E0B', text: 'Routine sync complete for Swarm 04' },
            ].map(log => (
              <div key={log.id} className="cyber-card group bg-[#0D130D] border-[#1A2E1A] p-4 flex gap-4 items-start relative overflow-hidden h-auto">
                {/* Left Edge Indicator */}
                <div className="absolute left-0 top-0 bottom-0 w-[2.5px]" style={{ backgroundColor: log.color }}></div>
                <div className="flex-1 space-y-1.5 pl-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-[4px] border border-opacity-20" 
                          style={{ color: log.color, borderColor: log.color, backgroundColor: `${log.color}15` }}>
                      {log.priority}
                    </span>
                    <span className="text-[10px] text-[#6B9E6B] font-mono">{log.time}</span>
                  </div>
                  <h5 className="text-[13px] font-semibold text-[#E8FFE8] group-hover:text-[#00FF6A] transition-colors leading-tight">
                    {log.text}
                  </h5>
                  <p className="text-[12px] text-[#6B9E6B] line-clamp-1">Anomaly detected in target cluster sequence...</p>
                </div>
              </div>
            ))}
            <Link href="/dashboard/alerts" className="block w-full">
              <Button variant="outline" className="w-full bg-transparent border-[#1A2E1A] text-[#6B9E6B] hover:text-[#00FF6A] hover:border-[#00FF6A]/30 text-[11px] h-10 font-bold uppercase tracking-widest mt-4">
                View all signals
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, icon }: any) => (
  <Card className="cyber-card bg-[#0D130D] border-[#1A2E1A] p-6 group">
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#6B9E6B]">
          {label}
        </span>
        <div className="text-[#00FF6A] group-hover:scale-110 transition-transform opacity-70">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[32px] font-bold text-[#E8FFE8] tracking-tight leading-none">
          {value}
        </span>
        <span className="text-[10px] font-bold text-[#00FF6A] font-mono">+12%</span>
      </div>
    </div>
  </Card>
);

const MissionCard = ({ mission }: { mission: any }) => {
  const isRunning = mission.status === "running";
  
  return (
    <Card className="cyber-card bg-[#0D130D] border-[#1A2E1A] p-6 group">
      <div className="flex items-start justify-between mb-6">
         <div className="w-11 h-11 rounded-lg bg-[#111A11] border border-[#1A2E1A] flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all shadow-inner">
            {mission.category === 'prices' ? '💰' : 
             mission.category === 'news' ? '📰' : 
             mission.category === 'jobs' ? '💼' : '🔍'}
         </div>
         <Badge className={`text-[10px] font-bold border-none px-3 py-0.5 rounded-full
           ${isRunning ? "bg-[#00FF6A]/10 text-[#00FF6A]" : 
             mission.status === "paused" ? "bg-[#F59E0B]/10 text-[#F59E0B]" : 
             "bg-[#111A11] text-[#6B9E6B]"}`}>
           {mission.status}
         </Badge>
      </div>
      
      <div className="space-y-1">
         <h4 className="text-lg font-bold text-[#E8FFE8] group-hover:text-[#00FF6A] transition-colors tracking-tight truncate">
           {mission.name}
         </h4>
         <p className="text-[11px] text-[#6B9E6B] font-mono lowercase opacity-50">ID://{mission.mission_id.substring(0,8)}</p>
      </div>

      <div className="mt-8 pt-4 border-t border-[#1A2E1A] flex items-center justify-between">
         <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#6B9E6B]">Next Sync</span>
            <span className="text-xs font-bold text-[#E8FFE8] font-mono">{mission.next_run || "STANDBY"}</span>
         </div>
         <Link href={`/dashboard/missions/${mission.mission_id}`}>
            <Button size="icon" className="h-9 w-9 rounded-md bg-[#111A11] border border-[#1A2E1A] hover:bg-[#00FF6A] text-[#00FF6A] hover:text-[#060A06] transition-all group/btn">
               <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>
         </Link>
      </div>
    </Card>
  );
};

const DashboardSkeleton = () => (
  <div className="space-y-12">
     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 w-full bg-[#0D130D] border border-[#1A2E1A] rounded-xl" />)}
     </div>
     <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-8">
           <Skeleton className="h-10 w-64 bg-[#0D130D]" />
           <div className="grid grid-cols-2 gap-6">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-56 w-full bg-[#0D130D] rounded-xl" />)}
           </div>
        </div>
        <Skeleton className="h-[600px] w-full bg-[#0D130D] rounded-xl" />
     </div>
  </div>
);
