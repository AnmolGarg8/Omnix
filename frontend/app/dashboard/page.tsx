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
  TrendingUp 
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const EXAMPLES = [
  "Monitor Nike, Adidas, Zara for price changes on running shoes under ₹5000",
  "Check TechCrunch, ProductHunt, HackerNews daily for AI startup funding news",
  "Track my 5 competitors' landing pages for copy or pricing changes",
  "Scrape top 20 LinkedIn job postings for React Developer in Bangalore",
  "Monitor Amazon and Flipkart for RTX 5090 stock availability"
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
    <div className="space-y-12 pb-20">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Active Missions" value={stats.activeMissions} icon={<Activity />} delta="+2 NEW" />
        <StatCard label="Total Runs" value={stats.totalRuns} icon={<Zap />} delta="LIVE" />
        <StatCard label="Alerts Dispatched" value={stats.alertsSent} icon={<Bell />} delta="PRIORITY" />
        <StatCard label="Nodes Monitored" value={stats.sitesMonitored} icon={<Globe />} delta="GLOBAL" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
        {/* Missions Grid */}
        <div className="xl:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter">
              <Rocket className="w-6 h-6 text-[#00FF6A]" />
              Agent Swarm
            </h3>
            <Link href="/dashboard/missions/new">
               <Button className="bg-[#00FF6A] text-[#060A06] hover:bg-[#00D156] font-bold gap-2 rounded-full px-6 shadow-[0_0_15px_rgba(0,255,106,0.3)]">
                 <Plus className="w-4 h-4" /> New Mission
               </Button>
            </Link>
          </div>

          {missions.length === 0 ? (
            <div className="cyber-card p-16 text-center space-y-8 flex flex-col items-center bg-[#0D130D]/50 border-dashed">
              <div className="w-24 h-24 rounded-full bg-[#111A11] border border-[#1A2E1A] flex items-center justify-center text-5xl">
                 🤖
              </div>
              <div className="space-y-3">
                <h4 className="text-3xl font-black text-[#E8FFE8] uppercase tracking-tighter">Initialize Intelligence</h4>
                <p className="text-[#6B9E6B] max-w-md mx-auto font-medium">No active missions detected. Deploy your first agent swarm to begin surveillance.</p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center max-w-2xl mt-4">
                {EXAMPLES.map((ex) => (
                  <Link key={ex} href={`/dashboard/missions/new?goal=${encodeURIComponent(ex)}`}>
                    <button className="text-[10px] uppercase font-bold tracking-widest px-5 py-2.5 rounded-full bg-[#111A11] border border-[#1A2E1A] hover:border-[#00FF6A] transition-all text-[#6B9E6B] hover:text-[#00FF6A] hover:shadow-[0_0_15px_rgba(0,255,106,0.1)]">
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

        {/* Recent Alerts Feed */}
        <Card className="cyber-card bg-[#0D130D] border-[#1A2E1A] shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-[#1A2E1A] p-6 bg-[#111A11]">
             <CardTitle className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter">
                <Bell className="w-6 h-6 text-[#FF4444]" />
                Signal Log
             </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-[#1A2E1A]">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="p-5 hover:bg-[#111A11]/50 transition-colors cursor-pointer group">
                     <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-[#FF4444]/10 text-[#FF4444] text-[9px] font-black border-none tracking-widest">CRITICAL</Badge>
                        <span className="text-[10px] text-[#6B9E6B] font-mono">{i * 2}h ago</span>
                     </div>
                     <p className="text-sm font-bold text-[#E8FFE8] group-hover:text-[#00FF6A] transition-colors">Anomaly detected in target cluster...</p>
                     <p className="text-xs text-[#6B9E6B] mt-1 line-clamp-1 font-medium">Significant structural change identified on monitored endpoint...</p>
                  </div>
                ))}
             </div>
          </CardContent>
          <CardContent className="p-5 border-t border-[#1A2E1A] bg-[#111A11]/30">
            <Link href="/dashboard/alerts">
              <Button variant="link" className="text-xs text-[#00FF6A] w-full font-bold uppercase tracking-widest">Access All Signals</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, delta, icon }: any) => (
  <Card className="cyber-card bg-[#0D130D] border-[#1A2E1A] overflow-hidden group">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black uppercase tracking-[2px] text-[#6B9E6B]">
          {label}
        </span>
        <div className="w-9 h-9 rounded-lg bg-[#111A11] flex items-center justify-center text-[#00FF6A] border border-[#1A2E1A] group-hover:border-[#00FF6A]/30 transition-colors">
          {icon}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-4xl font-black text-[#E8FFE8] tracking-tighter leading-none">
          {value}
        </span>
        <div className="flex items-center gap-1.5 mt-2">
           <TrendingUp className="w-3 h-3 text-[#00FF6A]" />
           <span className="text-[10px] font-black text-[#00FF6A] uppercase tracking-tighter">
             {delta}
           </span>
        </div>
      </div>
      {/* 3px Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#111118]">
         <div className="h-full bg-[#00FF6A] shadow-[0_0_8px_#00FF6A] w-[75%]"></div>
      </div>
    </CardContent>
  </Card>
);

const MissionCard = ({ mission }: { mission: any }) => {
  const isRunning = mission.status === "running";
  
  return (
    <Card className="cyber-card bg-[#0D130D] border-[#1A2E1A] group hover:border-[#00FF6A]/30">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-start justify-between">
           <div className="w-12 h-12 rounded-xl bg-[#111A11] border border-[#1A2E1A] flex items-center justify-center text-2xl grayscale group-hover:grayscale-0 transition-all">
              {mission.category === 'prices' ? '💰' : 
               mission.category === 'news' ? '📰' : 
               mission.category === 'jobs' ? '💼' : '🔍'}
           </div>
           <Badge className={`uppercase text-[9px] tracking-[2px] font-black border-none px-3 py-1
             ${isRunning ? "bg-[#00FF6A] text-[#060A06] animate-pulse" : 
               mission.status === "paused" ? "bg-[#F59E0B] text-[#060A06]" : 
               "bg-[#111A11] text-[#00FF6A] border border-[#00FF6A]/30"}`}>
             {mission.status}
           </Badge>
        </div>
        
        <div>
           <h4 className="text-xl font-black text-[#E8FFE8] group-hover:text-[#00FF6A] transition-colors uppercase tracking-tighter truncate">
             {mission.name}
           </h4>
           <p className="text-[10px] text-[#6B9E6B] font-mono mt-1 uppercase tracking-widest opacity-60">ID://{mission.mission_id.substring(0,8)}</p>
        </div>

        <div className="pt-4 border-t border-[#1A2E1A] flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#6B9E6B]">Next Sync</span>
              <span className="text-sm font-black text-[#E8FFE8] font-mono">{mission.next_run || "STANDBY"}</span>
           </div>
           <Link href={`/dashboard/missions/${mission.mission_id}`}>
              <Button size="icon" className="h-10 w-10 rounded-lg bg-[#111A11] border border-[#1A2E1A] hover:bg-[#00FF6A] text-[#00FF6A] hover:text-[#060A06] transition-all group/btn">
                 <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
           </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardSkeleton = () => (
  <div className="space-y-12">
     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full bg-[#0D130D] border border-[#1A2E1A] rounded-xl" />)}
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
