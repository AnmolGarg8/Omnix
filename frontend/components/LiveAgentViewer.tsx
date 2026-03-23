"use client";
import React, { useEffect, useState, useRef } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Terminal, StopCircle, CheckCircle2, Globe, Clock, Monitor, Activity } from "lucide-react";

interface AgentEvent {
  type: string;
  message: string;
  timestamp: string;
  url?: string;
  streaming_url?: string;
}

export const LiveAgentViewer = ({ missionId, tasks }: { missionId: string; tasks: any[] }) => {
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [agentStatuses, setAgentStatuses] = useState<Record<string, string>>({});
  const [agentStreamingUrls, setAgentStreamingUrls] = useState<Record<string, string>>({});
  const [startTime] = useState<Date>(new Date());
  const [duration, setDuration] = useState("0s");
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
       const diff = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
       setDuration(`${diff}s`);
    }, 1000);

    // Initial statuses
    const initial: Record<string, string> = {};
    tasks.forEach(t => initial[t.url] = 'initializing');
    setAgentStatuses(initial);

    // Mock WebSocket for demo if no real one set up
    const mockEvents = [
      { type: 'STARTED', message: `Initializing node swarm for ${tasks.length} endpoints...`, timestamp: new Date().toLocaleTimeString() },
      { type: 'NAV', message: `Decrypting target: ${tasks[0].url}`, timestamp: new Date().toLocaleTimeString(), url: tasks[0].url },
      { type: 'EXTRACTING', message: `Parsing semantic structure on ${tasks[0].url}`, timestamp: new Date().toLocaleTimeString(), url: tasks[0].url },
      { type: 'DONE', message: `Intelligence extracted from ${tasks[0].url}`, timestamp: new Date().toLocaleTimeString(), url: tasks[0].url }
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < mockEvents.length) {
        setEvents(prev => [...prev, mockEvents[i]]);
        if (mockEvents[i].url) {
          setAgentStatuses(prev => ({ ...prev, [mockEvents[i].url as string]: mockEvents[i].type.toLowerCase() }));
        }
        i++;
      }
    }, 2000);

    return () => { clearInterval(timer); clearInterval(interval); };
  }, [tasks, startTime]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  const completedCount = Object.values(agentStatuses).filter(s => s === 'done').length;
  const progress = (completedCount / tasks.length) * 100;

  return (
    <div className="space-y-10 group">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tasks.map((task, idx) => (
          <Card key={idx} className={`cyber-card bg-[#0D130D] border-[#1A2E1A] overflow-hidden transition-all duration-500 shadow-2xl ${agentStatuses[task.url] === 'done' ? 'border-[#00FF6A]/30 bg-[#00FF6A]/5' : 'border-[#22C55E]/10'}`}>
            <CardHeader className="p-6 border-b border-[#1A2E1A] bg-[#111A11]">
              <div className="flex items-center justify-between mb-4">
                 <img src={`https://www.google.com/s2/favicons?domain=${task.url}`} className="w-6 h-6 rounded grayscale group-hover:grayscale-0 transition-all shadow-[0_0_8px_rgba(0,0,0,0.5)]" />
                 <Badge className={`uppercase text-[9px] font-black tracking-widest border-none px-3 py-1 ${agentStatuses[task.url] === 'done' ? 'bg-[#00FF6A] text-[#060A06]' : 'bg-[#111118] text-[#00FF6A] animate-pulse border border-[#00FF6A]/30'}`}>
                    {agentStatuses[task.url]}
                 </Badge>
              </div>
              <CardTitle className="text-sm font-black text-[#E8FFE8] uppercase tracking-tighter truncate max-w-[200px]">
                {new URL(task.url).hostname}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-64 bg-[#060A06] relative overflow-hidden group">
               {agentStreamingUrls[task.url] ? (
                 <iframe 
                   src={agentStreamingUrls[task.url]} 
                   className="w-full h-full border-none opacity-60 group-hover:opacity-100 transition-opacity grayscale-50 group-hover:grayscale-0"
                 />
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-[#111A11] border border-[#1A2E1A] flex items-center justify-center text-[#00FF6A] opacity-20 group-hover:opacity-40 transition-opacity">
                       <Monitor className="w-6 h-6 border-none" />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-[#6B9E6B] items-center gap-2 uppercase tracking-widest">Awaiting Datastream</p>
                       <p className="text-[9px] text-[#6B9E6B] uppercase font-bold tracking-tighter">Establishing node tunnel...</p>
                    </div>
                 </div>
               )}
               {/* 3D Scanning Line Overlay */}
               <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF6A] to-transparent shadow-[0_0_8px_#00FF6A] animate-[scanLine_4s_linear_infinite] opacity-30"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-6">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#00FF6A] shadow-[0_0_8px_#00FF6A]"></div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#E8FFE8] items-center gap-2">ORCHESTRATION DEPTH: {completedCount}/{tasks.length} NODES</span>
                 </div>
                 <div className="flex items-center gap-3 text-[#6B9E6B]">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">ELAPSED: {duration}</span>
                 </div>
              </div>
              <Button size="sm" variant="ghost" className="text-[10px] items-center text-[#FF4444] hover:bg-[#FF4444]/10 rounded-md font-black uppercase tracking-widest h-8 px-4 flex gap-2">
                 <StopCircle className="w-4 h-4" /> TERMINATE ALL NODES
              </Button>
           </div>
           
           <div className="h-[3px] w-full bg-[#111A11] rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-[#00C44F] to-[#00FF6A] shadow-[0_0_15px_#00FF6A] transition-all duration-1000 relative"
                style={{ width: `${progress}%` }}
              >
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[sweep_2s_infinite]"></div>
              </div>
           </div>

           {/* Event Log */}
           <div className="cyber-card bg-[#060A06] border-[#1A2E1A] rounded-xl overflow-hidden shadow-2xl relative">
              <div className="h-4 bg-[#111A11] border-b border-[#1A2E1A] flex items-center justify-between px-4">
                 <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#FF4444]/30"></div>
                    <div className="w-2 h-2 rounded-full bg-[#F59E0B]/30"></div>
                    <div className="w-2 h-2 rounded-full bg-[#00FF6A]/30"></div>
                 </div>
                 <span className="text-[9px] font-black text-[#6B9E6B] font-mono uppercase tracking-[3px]">NODE_SWARM://TELEMETRY_LOG</span>
              </div>
              <div className="h-80 overflow-y-auto p-6 font-mono text-[11px] leading-relaxed custom-scrollbar bg-black/40">
                {events.map((e, idx) => (
                  <div key={idx} className="flex gap-6 mb-2 animate-in fade-in slide-in-from-left duration-300">
                    <span className="text-[#6B9E6B] font-bold opacity-40 shrink-0">[{e.timestamp}]</span>
                    <span className={`font-black shrink-0 tracking-widest
                      ${e.type === 'NAV' ? 'text-blue-400' : 
                        e.type === 'EXTRACTING' ? 'text-amber-400' : 
                        e.type === 'DONE' ? 'text-[#00FF6A]' : 'text-purple-400'}`}>
                      {e.type}
                    </span>
                    <span className="text-[#E8FFE8] opacity-90">{e.message}</span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
           </div>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
           <div className="flex flex-col gap-2">
              <span className="text-[11px] font-black uppercase tracking-[4px] text-[#00FF6A]">NODE CLUSTERS</span>
              <div className="w-full h-px bg-gradient-to-r from-[#00FF6A] to-transparent opacity-20 mt-1"></div>
           </div>
           
           <div className="space-y-4">
              {tasks.map((task, idx) => (
                 <div key={idx} className="p-4 bg-[#111A11] border border-[#1A2E1A] rounded-xl flex items-center justify-between group hover:bg-[#1A2E1A] transition-colors">
                    <div className="flex items-center gap-3">
                       <CheckCircle2 className={`w-4 h-4 ${agentStatuses[task.url] === 'done' ? 'text-[#00FF6A]' : 'text-[#6B9E6B] opacity-30 shadow-[0_0_8px_#00FF6A]'}`} />
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-[#E8FFE8] uppercase tracking-tighter truncate max-w-[120px]">{new URL(task.url).hostname}</span>
                          <span className="text-[9px] text-[#6B9E6B] uppercase font-bold tracking-widest">{agentStatuses[task.url]}</span>
                       </div>
                    </div>
                    <Button variant="ghost" className="h-8 w-8 text-[#6B9E6B] hover:text-[#00FF6A] hover:bg-transparent">
                       <Activity className="w-4 h-4" />
                    </Button>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
