"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMission } from "@/lib/api";
import { LiveAgentViewer } from "@/components/LiveAgentViewer";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Trash, History, Activity, Database } from "lucide-react";

export default function MissionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [mission, setMission] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const data = await getMission(id as string);
        setMission(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMission();
  }, [id]);

  if (isLoading) return <div>Loading mission...</div>;
  if (!mission) return <div>Mission not found</div>;

  return (
    <div className="space-y-8">
      {/* Mission Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-[#111118] border border-[#1E1E2E] rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.05)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#0A0A0F] border border-[#1E1E2E] flex items-center justify-center text-2xl">
            {mission.category === 'prices' ? '💰' : 
             mission.category === 'news' ? '📰' : 
             mission.category === 'jobs' ? '💼' : 
             mission.category === 'stock' ? '📦' : '🔍'}
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-heading font-bold flex items-center gap-2">
              {mission.name}
              <Badge className="bg-[#6366F1] uppercase text-[10px] items-center h-5">
                {mission.status}
              </Badge>
            </h2>
            <div className="flex items-center gap-3 text-sm text-[#94A3B8]">
              <span className="flex items-center gap-1"><History className="w-4 h-4" /> Last run: {mission.last_run || 'Never'}</span>
              <span className="flex items-center gap-1"><Activity className="w-4 h-4" /> Goal: {mission.goal_nl.substring(0, 50)}...</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-[#1E1E2E] gap-2">
            <Pause className="w-4 h-4" /> Pause
          </Button>
          <Button className="bg-[#6366F1] hover:bg-[#5254E0] gap-2">
            <Play className="w-4 h-4" /> Run Now
          </Button>
          <Button variant="ghost" className="text-[#EF4444] hover:bg-[#EF4444]/10">
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="live" className="space-y-6">
        <TabsList className="bg-[#111118] border-[#1E1E2E]">
          <TabsTrigger value="live" className="gap-2 data-[state=active]:bg-[#6366F1]"><Activity className="w-4 h-4" /> Live View</TabsTrigger>
          <TabsTrigger value="results" className="gap-2 data-[state=active]:bg-[#6366F1]"><Database className="w-4 h-4" /> Latest Results</TabsTrigger>
          <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-[#6366F1]"><History className="w-4 h-4" /> Run History</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-6">
          <LiveAgentViewer missionId={mission.mission_id} tasks={mission.agent_tasks} />
        </TabsContent>

        <TabsContent value="results">
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-10 text-center text-[#94A3B8]">
            <Database className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Wait for agent run to complete</p>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-10 text-center text-[#94A3B8]">
            <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No runs registered yet</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
