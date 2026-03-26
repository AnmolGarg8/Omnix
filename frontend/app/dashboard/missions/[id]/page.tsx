"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { getMission, runMissionNow } from "@/lib/api";

import { LiveAgentViewer } from "@/components/LiveAgentViewer";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Trash, History, Activity, Database, Target, Clock, Cpu } from "lucide-react";

export default function MissionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const [mission, setMission] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchMission = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const data = await getMission(id as string, token);
        setMission(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMission();
  }, [id, getToken]);


  const handleTriggerNow = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      await runMissionNow(id as string, token);
      setMission((prev: any) => ({ ...prev, status: "running" }));
    } catch (err) {
      console.error(err);
    }
  };


  if (isLoading) return <div className="flex h-screen items-center justify-center font-black animate-pulse uppercase tracking-[10px] text-[#3B82F6]">INITIALIZING DATASTREAM...</div>;
  if (!mission) return <div className="flex h-screen items-center justify-center font-black uppercase text-[#FF4444]">MISSION NOT IDENTIFIED</div>;

  const isRunning = mission.status === "running";

  return (
    <div className="space-y-12 pb-20 p-6">
      {/* Mission Header */}
      <div className="cyber-card flex flex-col md:flex-row items-center justify-between gap-8 p-10 bg-[rgba(13,17,23,0.8)] border-[rgba(59,130,246,0.12)] backdrop-blur-[20px] shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(59,130,246,0.2),0_1px_0_rgba(59,130,246,0.15)] relative rounded-[14px]">
        {/* Inner glow */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '120px', height: '120px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-xl bg-[#111927] border border-[#1C2A3A] flex items-center justify-center text-4xl shadow-inner group">
            <span className="group-hover:scale-110 transition-transform">
              {mission.category === 'prices' ? '💰' : 
               mission.category === 'news' ? '📰' : 
               mission.category === 'jobs' ? '💼' : '🔍'}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
              {mission.name}
              <Badge className={`uppercase text-[10px] tracking-[2px] font-bold px-3 py-1 ml-2 rounded-full border 
                ${isRunning ? "bg-[rgba(59,130,246,0.1)] text-[#3B82F6] border-[rgba(59,130,246,0.3)] animate-[badgePulse_1.5s_ease-in-out_infinite]" : 
                  mission.status === "paused" ? "bg-[rgba(245,158,11,0.1)] text-[#FCD34D] border-[rgba(245,158,11,0.2)]" : 
                  "bg-[rgba(59,130,246,0.1)] text-[#93C5FD] border-[rgba(59,130,246,0.2)]"}`}>
                {mission.status}
              </Badge>
            </h2>
            <div className="flex items-center gap-6 text-[11px] font-black text-[#6B8EAE] uppercase tracking-widest">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#3B82F6]" /> LAST SYNC: {mission.last_run || 'NONE'}</span>
              <span className="flex items-center gap-2 max-w-sm truncate"><Cpu className="w-4 h-4 text-[#3B82F6]" /> GOAL: {mission.goal_nl}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="h-12 border-[#1C2A3A] gap-3 px-6 bg-transparent hover:bg-[#111118] text-[#F0F6FF] font-bold uppercase tracking-widest text-[10px]">
             {mission.status === "paused" ? <Play className="w-4 h-4 text-[#3B82F6]" /> : <Pause className="w-4 h-4 text-[#F59E0B]" />} 
             {mission.status === "paused" ? "RESUME" : "PAUSE"}
          </Button>
          <Button 
            onClick={handleTriggerNow}
            disabled={isRunning}
            className="h-14 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-[#ffffff] hover:opacity-90 gap-3 px-8 font-bold uppercase tracking-widest rounded-[10px] border-none shadow-[0_0_0_1px_rgba(59,130,246,0.3),0_8px_32px_rgba(59,130,246,0.35),0_2px_8px_rgba(0,0,0,0.4)] transition-all hover:-translate-y-[2px] hover:shadow-[0_0_0_1px_rgba(59,130,246,0.5),0_12px_48px_rgba(59,130,246,0.5),0_2px_8px_rgba(0,0,0,0.4)] disabled:opacity-50">
            <Play className="w-5 h-5 fill-white" /> {isRunning ? "MISSION RUNNING..." : "TRIGGER NOW"}
          </Button>
          <Button variant="ghost" className="h-12 w-12 text-[#FF4444] hover:bg-[#FF4444]/10 rounded-xl p-0">
            <Trash className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="live" className="space-y-10">
        <TabsList className="bg-[#111927]/50 border border-[#1C2A3A] p-2 h-14 rounded-2xl">
          <TabsTrigger value="live" className="gap-3 data-[state=active]:bg-[#3B82F6] data-[state=active]:text-[#ffffff] px-8 rounded-xl font-black uppercase tracking-widest text-[10px] h-full"><Activity className="w-4 h-4" /> TACTICAL HUB</TabsTrigger>
          <TabsTrigger value="results" className="gap-3 data-[state=active]:bg-[#3B82F6] data-[state=active]:text-[#ffffff] px-8 rounded-xl font-black uppercase tracking-widest text-[10px] h-full"><Database className="w-4 h-4" /> SIGNAL BANK</TabsTrigger>
          <TabsTrigger value="history" className="gap-3 data-[state=active]:bg-[#3B82F6] data-[state=active]:text-[#ffffff] px-8 rounded-xl font-black uppercase tracking-widest text-[10px] h-full"><History className="w-4 h-4" /> ARCHIVES</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
          <LiveAgentViewer missionId={mission.mission_id} tasks={mission.agent_tasks} />
        </TabsContent>

        <TabsContent value="results" className="animate-in fade-in zoom-in-95 duration-500">
          <div className="cyber-card bg-[#0D1117] border-[#1C2A3A] rounded-2xl p-20 text-center space-y-6">
            <Database className="w-16 h-16 mx-auto opacity-20 text-[#3B82F6]" />
            <div className="space-y-2">
               <h5 className="text-2xl font-black uppercase text-[#F0F6FF] tracking-tighter">Standby for Signal</h5>
               <p className="text-[#6B8EAE] font-bold uppercase tracking-widest text-xs">Awaiting completion of the current autonomous swarm run.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="animate-in fade-in zoom-in-95 duration-500">
          <div className="cyber-card bg-[#0D1117] border-[#1C2A3A] rounded-2xl p-20 text-center space-y-6">
            <History className="w-16 h-16 mx-auto opacity-20 text-[#3B82F6]" />
            <div className="space-y-2">
               <h5 className="text-2xl font-black uppercase text-[#F0F6FF] tracking-tighter">Archival Logs</h5>
               <p className="text-[#6B8EAE] font-bold uppercase tracking-widest text-xs">Historical run data is restricted until first sequence is complete.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
