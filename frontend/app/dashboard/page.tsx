"use client";
import React, { useEffect, useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Rocket, 
  ArrowRight,
  Bell, 
  BrainCircuit,
  Zap,
  Activity,
  ShieldCheck,
  Target
} from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const EXAMPLES = [
  "Monitor Nike, Adidas for price changes",
  "TechCrunch AI startup news",
  "Competitor pricing shifts",
  "LinkedIn job postings daily",
  "Amazon RTX 5090 restock"
];

export default function DashboardPage() {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [missions, setMissions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeMissions: 0,
    totalRuns: 0,
    sitesMonitored: 0,
    alertCount: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        
        // Fetch missions
        const misRes = await fetch(`${BACKEND}/api/missions`, { headers: { Authorization: `Bearer ${token}` } });
        const missionsData = await misRes.json().catch(() => []);
        
        // Fetch alerts
        const alRes = await fetch(`${BACKEND}/api/alerts`, { headers: { Authorization: `Bearer ${token}` } });
        const alertsData = await alRes.json().catch(() => []);
        
        const mArr = Array.isArray(missionsData) ? missionsData : [];
        setMissions(mArr);
        setStats({
          activeMissions: mArr.filter((m: any) => m.status === 'active').length,
          totalRuns: mArr.reduce((acc: number, m: any) => acc + (m.total_runs || 0), 0),
          sitesMonitored: mArr.reduce((acc: number, m: any) => acc + (m.agent_tasks?.length || 0), 0),
          alertCount: (alertsData || []).length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [getToken]);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="pb-32 animate-fadeUp">
      {/* Header with Breadth */}
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-[#F0F6FF] tracking-tight mb-2">Systems Overview</h2>
          <p className="text-[#6B8EAE] text-sm font-medium">Monitoring the autonomous web layer.</p>
        </div>
        <div className="flex gap-4 items-center">
           <div className="bg-[#0D1117] border border-blue-500/10 px-4 py-2 rounded-lg flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span className="text-xs font-bold text-[#6B8EAE] tracking-wider uppercase">Relay: Active</span>
           </div>
        </div>
      </div>
      
      {/* 4-Column Stat Grid with increased spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <StatCard index={0} label="Active Missions" value={stats.activeMissions} delta="+12%" icon={<Target size={18} />} />
        <StatCard index={1} label="Total Runs" value={stats.totalRuns} delta="STABLE" icon={<Zap size={18} />} />
        <StatCard index={2} label="Alerts Dispatched" value={stats.alertCount} delta="URGENT" icon={<Bell size={18} />} />
        <StatCard index={3} label="Nodes Protected" value={stats.sitesMonitored} delta="ACTIVE" icon={<ShieldCheck size={18} />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-12 items-start">
        
        {/* Agent Swarm Section */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#F0F6FF] flex items-center gap-3">
              <div className="p-1.5 bg-blue-500/10 rounded-md">
                <BrainCircuit size={18} className="text-blue-500" />
              </div>
              Agent Swarm
            </h3>
            <Link href="/dashboard/missions/new">
               <button className="px-5 py-2.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 hover:border-blue-500/60 text-blue-400 text-xs font-bold rounded-lg transition-all flex items-center gap-2 tracking-wide">
                 <Plus size={14} /> NEW MISSION
               </button>
            </Link>
          </div>

          {missions.length === 0 ? (
            <div className="bg-[#0D1117]/50 border border-dashed border-[#1C2A3A] rounded-2xl py-24 px-12 text-center group hover:bg-[#0D1117]/80 transition-all">
              <div className="w-20 h-20 bg-[#111927] border border-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-4xl group-hover:scale-110 transition-transform">🤖</div>
              <h4 className="text-2xl font-bold text-[#F0F6FF] mb-4">Initialize Intelligence</h4>
              <p className="text-[#6B8EAE] text-sm max-w-[340px] mx-auto mb-10 leading-relaxed">No active missions detected. Deploy your first agent swarm to start monitoring the web for critical signals.</p>
              
              <div className="flex flex-wrap gap-2.5 justify-center max-w-[600px] mx-auto">
                {EXAMPLES.map((ex) => (
                  <Link key={ex} href={`/dashboard/missions/new?goal=${encodeURIComponent(ex)}`} className="no-underline">
                    <span className="px-4 py-2 rounded-full bg-[#0D1117] border border-[#1C2A3A] text-[11px] font-bold text-[#6B8EAE] hover:text-blue-400 hover:border-blue-500/40 transition-all cursor-pointer inline-block">
                      {ex}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {missions.map(mission => (
                  <MissionCard key={mission.mission_id} mission={mission} />
                ))}
            </div>
          )}
        </div>

        {/* Signal Log Section - Cyber HUD Style */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#F0F6FF] flex items-center gap-3">
              <div className="p-1.5 bg-blue-500/10 rounded-md">
                <Activity size={18} className="text-blue-500" />
              </div>
              Intelligence Feed
            </h3>
            <span className="text-[10px] font-bold text-blue-500/60 tracking-widest uppercase">Live Sync</span>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { id: 1, p: 'CRITICAL', t: 'Nike price drop detected (−$32)', c: '#FF4444', time: '12m ago' },
              { id: 2, p: 'HIGH', t: 'Competitor A launched new pricing', c: '#FF6B35', time: '45m ago' },
              { id: 3, p: 'MEDIUM', t: '5 new job matches in Bangalore', c: '#F59E0B', time: '2h ago' },
              { id: 4, p: 'STABLE', t: 'Routine sync complete for Nodes 1-4', c: '#3B82F6', time: '5h ago' },
            ].map(log => (
              <div key={log.id} className="group cursor-pointer">
                <div className="bg-[#0D1117]/80 border border-blue-500/5 hover:border-blue-500/20 rounded-xl p-5 hover:bg-[#111927] transition-all relative overflow-hidden">
                   {/* HUD Accent */}
                   <div className="absolute top-0 left-0 w-[2px] h-full transition-all group-hover:w-1" style={{ backgroundColor: log.c }} />
                   
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] font-black tracking-widest px-2.5 py-1 rounded-md bg-opacity-10 border border-opacity-20" style={{ color: log.c, borderColor: log.c, backgroundColor: log.c + '10' }}>{log.p}</span>
                      <span className="text-[10px] font-bold text-[#6B8EAE]">{log.time}</span>
                   </div>
                   <h5 className="text-sm font-semibold text-[#F0F6FF] mb-2 group-hover:text-blue-400 transition-colors tracking-tight">{log.t}</h5>
                   <p className="text-xs text-[#6B8EAE] leading-relaxed line-clamp-2">Agent swarm confirmed critical intelligence match on target endpoint. Relay protocol verified.</p>
                </div>
              </div>
            ))}
            
            <button className="w-full mt-4 py-3 bg-transparent border border-[#1C2A3A] hover:border-blue-500/20 text-[#6B8EAE] hover:text-blue-400 text-xs font-bold rounded-xl transition-all uppercase tracking-widest">
              View All Signals
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

const StatCard = ({ label, value, delta, index, icon }: any) => (
  <div className={`cyber-card float-${index} p-7 group`} style={{ background: 'rgba(13, 17, 23, 0.7)', backdropFilter: 'blur(20px)' }}>
    <div className="flex justify-between items-start mb-6">
      <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-[10px] font-black tracking-widest text-[#6B8EAE] opacity-60 uppercase">{label}</div>
    </div>
    
    <div className="flex items-end gap-3 mb-6">
      <div className="text-4xl font-bold text-[#F0F6FF] tracking-tighter">{value}</div>
      <div className="text-[11px] font-black text-blue-500 mb-1.5 tracking-wider font-mono">↑ {delta}</div>
    </div>

    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
      <div 
        className="h-full bg-blue-500 group-hover:bg-blue-400 transition-all duration-1000 ease-out shadow-[0_0_12px_#3B82F6]" 
        style={{ width: `${40 + index * 15}%` }} 
      />
    </div>
  </div>
);

const MissionCard = ({ mission }: { mission: any }) => (
  <Link href={`/dashboard/missions/${mission.mission_id}`} className="no-underline">
    <div className="cyber-card p-6 h-full flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#111927] border border-blue-500/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            {mission.category === 'prices' ? '💰' : mission.category === 'news' ? '🗞️' : '🔍'}
          </div>
          <Badge className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/20 text-[9px] font-black tracking-widest uppercase py-1">
            {mission.status}
          </Badge>
        </div>
        <h4 className="text-base font-bold text-[#F0F6FF] mb-2 group-hover:text-blue-400 transition-colors">{mission.name || "Untitled Mission"}</h4>
        <p className="text-xs text-[#6B8EAE] line-clamp-1 mb-6 font-medium">{mission.goal_nl}</p>
      </div>
      
      <div className="flex items-center justify-between pt-6 border-t border-[#1C2A3A]">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-5 h-5 rounded-full border border-[#080C14] bg-blue-500/20 flex items-center justify-center text-[8px] font-bold text-blue-400">
                A
              </div>
            ))}
          </div>
          <span className="text-[10px] font-bold text-[#6B8EAE]">3 Active Agents</span>
        </div>
        <span className="text-[10px] font-bold text-emerald-500/80">Next: 12m</span>
      </div>
    </div>
  </Link>
);

const DashboardSkeleton = () => (
  <div className="p-8 animate-pulse">
     <div className="h-10 w-64 bg-white/5 rounded-lg mb-12" />
     <div className="grid grid-cols-4 gap-6 mb-16">
        {[1,2,3,4].map(i => <div key={i} className="h-40 bg-white/5 rounded-2xl" />)}
     </div>
     <div className="grid grid-cols-[1fr_400px] gap-12">
        <div className="h-[400px] bg-white/5 rounded-2xl" />
        <div className="h-[400px] bg-white/5 rounded-2xl" />
     </div>
  </div>
);
