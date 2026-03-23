"use client";
import React, { useEffect, useState } from "react";
import { getMissions } from "@/lib/api";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Settings, 
  ShieldCheck, 
  Globe, 
  Zap, 
  Plus, 
  Search, 
  Rocket, 
  Clock, 
  TrendingUp, 
  Bell, 
  History 
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
        setMissions(missionsData);
        // Simplified stat calculation for dev
        setStats({
          activeMissions: missionsData.filter((m:any) => m.status === 'active').length,
          totalRuns: missionsData.reduce((acc:any, m:any) => acc + (m.total_runs || 0), 0),
          alertsSent: missionsData.length * 2, // Mocking
          sitesMonitored: missionsData.reduce((acc:any, m:any) => acc + (m.agent_tasks?.length || 0), 0)
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
    <div className="space-y-10">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Missions" value={stats.activeMissions} icon={<Activity className="text-[#6366F1]" />} trend="+2 this week" />
        <StatCard title="Total Runs" value={stats.totalRuns} icon={<Zap className="text-[#F59E0B]" />} trend="Live execution" />
        <StatCard title="Alerts Dispatched" value={stats.alertsSent} icon={<Bell className="text-[#EF4444]" />} trend="Medium+ Only" />
        <StatCard title="Sites Scanned" value={stats.sitesMonitored} icon={<Globe className="text-[#22C55E]" />} trend="Worldwide" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Missions Grid */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-heading font-bold flex items-center gap-2">
              <Rocket className="w-5 h-5 text-[#6366F1]" />
              Deployed Missions
            </h3>
            <Link href="/dashboard/missions/new">
               <Button size="sm" className="bg-[#6366F1] hover:bg-[#5254E0] gap-1.5 h-8">
                 <Plus className="w-4 h-4" /> New Mission
               </Button>
            </Link>
          </div>

          {missions.length === 0 ? (
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-12 text-center space-y-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#0A0A0F] border border-[#1E1E2E] flex items-center justify-center text-4xl">
                 🤖
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-heading font-bold text-[#F1F5F9]">Ready to architect your agents?</h4>
                <p className="text-[#94A3B8] max-w-md mx-auto">Launch your first mission using one of these common goals or type your own.</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-2xl mt-4">
                {EXAMPLES.map((ex) => (
                  <Link key={ex} href={`/dashboard/missions/new?goal=${encodeURIComponent(ex)}`}>
                    <button className="text-xs px-4 py-2 rounded-full bg-[#1E1E2E] border border-[#1E1E2E] hover:border-[#6366F1] transition-all text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#6366F1]/10">
                      {ex}
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {missions.map(mission => (
                 <Link key={mission.mission_id} href={`/dashboard/missions/${mission.mission_id}`}>
                   <Card className="bg-[#111118] border-[#1E1E2E] hover:border-[#6366F1] transition-all group shadow-lg">
                      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-lg bg-[#0A0A0F] border border-[#1E1E2E] flex items-center justify-center group-hover:bg-[#6366F1]/10 group-hover:text-[#6366F1] transition-colors">
                              <Search className="w-5 h-5 opacity-60" />
                           </div>
                           <div>
                              <CardTitle className="text-sm font-bold truncate max-w-[150px]">{mission.name}</CardTitle>
                              <CardDescription className="text-[10px] uppercase tracking-tighter">{mission.category}</CardDescription>
                           </div>
                        </div>
                        <Badge className={`uppercase text-[9px] ${mission.status === 'active' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                           {mission.status}
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-3">
                         <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Next: {mission.next_run || "Daily 9 AM"}</span>
                            <span className="flex items-center gap-1.5"><History className="w-3.5 h-3.5" /> {mission.total_runs || 0} runs</span>
                         </div>
                         <Button variant="outline" className="w-full text-xs h-8 border-[#1E1E2E] hover:bg-[#6366F1] hover:text-white group-hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            View Dashboard
                         </Button>
                      </CardContent>
                   </Card>
                 </Link>
               ))}
            </div>
          )}
        </div>

        {/* Recent Alerts Feed */}
        <Card className="bg-[#111118] border-[#1E1E2E] h-fit shadow-xl">
          <CardHeader className="border-b border-[#1E1E2E] p-4">
             <CardTitle className="text-lg font-heading flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#EF4444]" />
                Recent Alerts
             </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-[#1E1E2E]">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-4 hover:bg-[#1E1E2E]/30 transition-colors cursor-pointer space-y-2">
                     <div className="flex items-center justify-between">
                        <Badge className="bg-[#EF4444]/10 text-[#EF4444] text-[9px]">HIGH</Badge>
                        <span className="text-[10px] text-[#94A3B8]">{i * 2}h ago</span>
                     </div>
                     <p className="text-xs font-semibold">Detected 15% price drop on Amazon...</p>
                     <p className="text-[10px] text-[#94A3B8] line-clamp-1">Flipkart Price Monitor mission detected a significant drop in...</p>
                  </div>
                ))}
             </div>
          </CardContent>
          <CardContent className="p-4 border-t border-[#1E1E2E]">
            <Link href="/dashboard/alerts">
              <Button variant="link" className="text-xs text-[#6366F1] w-full p-0">View All Notifications</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon, trend }: any) => (
  <Card className="bg-[#111118] border-[#1E1E2E] p-5 shadow-lg relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-24 h-24 bg-[#6366F1]/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-[#6366F1]/10 transition-all"></div>
    <div className="flex items-center justify-between mb-3 relative z-10">
      <div className="p-2.5 rounded-lg bg-[#0A0A0F] border border-[#1E1E2E] shadow-sm">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-[#94A3B8] uppercase">{title}</span>
    </div>
    <div className="space-y-1 relative z-10">
      <h3 className="text-3xl font-heading font-bold text-[#F1F5F9]">{value}</h3>
      <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#94A3B8]">
        <TrendingUp className="w-3 h-3 text-[#22C55E]" />
        {trend}
      </div>
    </div>
  </Card>
);

const DashboardSkeleton = () => (
  <div className="space-y-10">
     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 w-full bg-[#111118]" />)}
     </div>
     <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
           <Skeleton className="h-8 w-48 bg-[#111118]" />
           <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-44 w-full bg-[#111118]" />)}
           </div>
        </div>
        <Skeleton className="h-[600px] w-full bg-[#111118]" />
     </div>
  </div>
);
