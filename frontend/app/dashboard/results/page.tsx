"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { getMissions, getLatestResult } from "@/lib/api";

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Database, FileText, CheckCircle2, Search, BrainCircuit, Globe, Cpu } from "lucide-react";

export default function ResultsPage() {
  const { getToken } = useAuth();
  const [missions, setMissions] = useState<any[]>([]);
  const [selectedMission, setSelectedMission] = useState<string>("");
  const [latestResult, setLatestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string>("");

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        setAuthToken(token);
        const data = await getMissions(token);
        setMissions(data);
        if (data && data.length > 0) {
          setSelectedMission(data[0].mission_id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMissions();
  }, [getToken]);

  useEffect(() => {
    const fetchResult = async () => {
      if (!selectedMission || !authToken) return;
      try {
        const result = await getLatestResult(selectedMission, authToken);
        setLatestResult(result);
      } catch (err) {
        console.error(err);
        setLatestResult(null);
      }
    };
    fetchResult();
  }, [selectedMission, authToken]);


  if (isLoading) return <div className="flex h-screen items-center justify-center font-black animate-pulse uppercase tracking-[10px] text-[#3B82F6]">SYNCING SIGNAL BANK...</div>;

  return (
    <div className="space-y-12 pb-20 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-3">
          <h2 className="text-5xl font-black uppercase tracking-tighter flex items-center gap-4">
             <Database className="w-12 h-12 text-[#3B82F6]" />
             Intelligence Bank
          </h2>
          <p className="text-[#6B8EAE] font-bold text-sm tracking-[4px] uppercase opacity-80">Access distilled cross-node structural data.</p>
        </div>
        <div className="w-full md:w-80">
          <label className="text-[10px] font-black uppercase tracking-[3px] text-[#6B8EAE] ml-1 mb-2 block">SELECT TARGET OBJECTIVE</label>
          <Select value={selectedMission} onValueChange={(val) => val && setSelectedMission(val)}>
            <SelectTrigger className="bg-[#0D1117] border-[#1C2A3A] h-14 rounded-xl text-xs font-black uppercase tracking-widest focus:border-[#3B82F6]">
              <SelectValue placeholder="Identification Required" />
            </SelectTrigger>
            <SelectContent className="bg-[#0D1117] border-[#1C2A3A] text-[#F0F6FF] font-bold text-xs uppercase tracking-widest">
              {missions.map(m => (
                <SelectItem key={m.mission_id} value={m.mission_id}>{m.name.toUpperCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!latestResult ? (
        <div className="cyber-card p-32 text-center bg-[#0D1117]/50 border-dashed space-y-8 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-[#111927] border border-[#1C2A3A] flex items-center justify-center text-5xl">
             📡
          </div>
          <div className="space-y-3">
            <h4 className="text-3xl font-black text-[#F0F6FF] uppercase tracking-tighter">Awaiting Initial Transmission</h4>
            <p className="text-[#6B8EAE] max-w-md mx-auto font-medium">AgentForIt is standby for signals. Run the mission to populate the intelligence bank.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start animate-in fade-in slide-in-from-bottom duration-700">
          {/* Analysis Card */}
          <Card className="cyber-card bg-[#0D1117] border-[#1C2A3A] h-full shadow-[0_0_50px_rgba(0,0,0,0.4)] overflow-hidden">
            <div className="scan-top absolute top-0 left-0 right-0 h-1"></div>
            <CardHeader className="p-10 border-b border-[#1C2A3A] bg-[#111927]">
              <div className="flex items-center justify-between mb-4">
                 <Badge className="bg-[#3B82F6] text-[#080C14] text-[9px] font-black px-4 py-1 tracking-widest holographic">SIGINT COMPLETE</Badge>
                 <span className="text-[11px] font-mono text-[#6B8EAE] uppercase font-black">{latestResult.timestamp}</span>
              </div>
              <CardTitle className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
                <BrainCircuit className="w-10 h-10 text-[#3B82F6]" />
                LLM Executive Brief
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-10">
              <div className="bg-[#080C14] border-l-4 border-[#3B82F6] p-8 rounded-r-2xl italic text-[#F0F6FF] text-xl leading-relaxed font-medium">
                "{latestResult.brief}"
              </div>
              
              <div className="space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-[4px] text-[#6B8EAE]">STRUCTURAL ANOMALIES</h4>
                 <div className="grid grid-cols-1 gap-4">
                    {latestResult.anomalies?.map((a: any, i: number) => (
                      <div key={i} className="flex flex-col gap-3 p-6 bg-[#111927] border border-[#1C2A3A] rounded-2xl group hover:border-[#3B82F6]/30 transition-all">
                        <div className="flex items-center justify-between">
                           <Badge variant="outline" className={`${a.severity === 'CRITICAL' ? 'bg-[#FF4444]/10 text-[#FF4444] border-[#FF4444]/30' : 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30'} font-black text-[9px] tracking-widest px-3 py-1`}>
                              {a.severity}
                           </Badge>
                           <span className="text-[10px] font-black text-[#6B8EAE] bg-[#080C14] px-3 py-1 rounded-lg border border-[#1C2A3A] uppercase tracking-widest">{a.type}</span>
                        </div>
                        <p className="text-sm font-bold text-[#F0F6FF] group-hover:text-[#3B82F6] transition-colors">{a.description}</p>
                        {a.old_value && (
                           <div className="flex items-center gap-4 text-[10px] font-mono uppercase font-black mt-2">
                              <span className="line-through text-[#6B8EAE] bg-[#080C14] px-3 py-1 rounded-lg mt-1">{a.old_value}</span>
                              <ChevronRight className="w-3 h-3 text-[#3B82F6]" />
                              <span className="text-[#3B82F6] bg-[#3B82F6]/10 px-3 py-1 rounded-lg mt-1">{a.new_value}</span>
                           </div>
                        )}
                      </div>
                    ))}
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Raw Data View */}
          <div className="space-y-10">
             <Card className="cyber-card bg-[#0D1117] border-[#1C2A3A] overflow-hidden">
                <CardHeader className="p-8 border-b border-[#1C2A3A] flex flex-row items-center justify-between bg-[#111927]">
                   <CardTitle className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter">
                      <FileText className="w-6 h-6 text-[#3B82F6]" />
                      Data Structure Explorer
                   </CardTitle>
                   <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-[#6B8EAE] hover:text-[#3B82F6]">Export CSV</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[800px] overflow-auto bg-[#080C14] p-8 font-mono text-xs text-[#6B8EAE] leading-relaxed custom-scrollbar">
                     <pre className="whitespace-pre-wrap">{JSON.stringify(latestResult.raw_json, null, 2)}</pre>
                  </div>
                </CardContent>
             </Card>
          </div>
        </div>
      )}
    </div>
  );
}

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
