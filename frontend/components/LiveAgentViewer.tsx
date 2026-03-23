"use client";
import React, { useEffect, useState, useRef } from "react";
import { MissionWebSocket, AgentEvent } from "@/lib/websocket";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Globe, 
  Clock, 
  Terminal, 
  CheckCircle, 
  XCircle, 
  Play 
} from "lucide-react";

type AgentStatus = "queued" | "running" | "success" | "failed";

type AgentState = {
  url: string;
  status: AgentStatus;
  startTime: number;
  duration: number;
  streamingUrl?: string;
  logs: AgentEvent[];
};

export const LiveAgentViewer = ({ missionId, tasks }: { missionId: string; tasks: any[] }) => {
  const [agents, setAgents] = useState<Record<string, AgentState>>({});
  const [overallProgress, setOverallProgress] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    // Initialize agents
    const initialAgents: Record<string, AgentState> = {};
    tasks.forEach((task) => {
      initialAgents[task.url] = {
        url: task.url,
        status: "queued",
        startTime: Date.now(),
        duration: 0,
        logs: [],
      };
    });
    setAgents(initialAgents);

    // Setup WebSocket
    const ws = new MissionWebSocket(missionId, (event) => {
      if (event.type === "HEARTBEAT") return;

      setAgents((prev) => {
        const next = { ...prev };
        const agentUrl = event.site || tasks[0].url; // Simplified for dev
        if (next[agentUrl]) {
          // Update agent status/logs
          next[agentUrl].logs = [...next[agentUrl].logs, event];
          
          if (event.type === "NAVIGATING") next[agentUrl].status = "running";
          if (event.type === "COMPLETE") next[agentUrl].status = "success";
          if (event.type === "FAILED") next[agentUrl].status = "failed";
          if (event.type === "STREAMING_URL") next[agentUrl].streamingUrl = event.data;
        }
        return next;
      });
    });

    ws.connect();
    setIsConnected(true);

    return () => {
      ws.disconnect();
    };
  }, [missionId, tasks]);

  // Duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setAgents((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((url) => {
          if (next[url].status === "running") {
            next[url].duration = Date.now() - next[url].startTime;
          }
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusIcon = (status: AgentStatus) => {
    switch (status) {
      case "queued": return <Clock className="w-4 h-4 text-[#94A3B8]" />;
      case "running": return <Play className="w-4 h-4 text-[#6366F1] animate-pulse" />;
      case "success": return <CheckCircle className="w-4 h-4 text-[#22C55E]" />;
      case "failed": return <XCircle className="w-4 h-4 text-[#EF4444]" />;
    }
  };

  const getFavicon = (url: string) => `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`;

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-[#94A3B8]">Overall Progress</span>
          <span>{Object.values(agents).filter(a => a.status === 'success' || a.status === 'failed').length} / {tasks.length} agents complete</span>
        </div>
        <Progress value={(Object.values(agents).filter(a => a.status === 'success' || a.status === 'failed').length / tasks.length) * 100} className="h-2 bg-[#1E1E2E]" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {Object.values(agents).map((agent) => (
          <Card key={agent.url} className="bg-[#111118] border-[#1E1E2E] overflow-hidden flex flex-col h-[600px]">
            <CardHeader className="p-4 border-b border-[#1E1E2E] flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-3">
                <img src={getFavicon(agent.url)} alt="" className="w-8 h-8 rounded-sm bg-[#0A0A0F]" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium transition-colors group-hover:text-[#6366F1] truncate max-w-[150px]">
                    {new URL(agent.url).hostname}
                  </span>
                  <span className="text-xs text-[#94A3B8]">{(agent.duration / 1000).toFixed(1)}s elapsed</span>
                </div>
              </div>
              <Badge variant="outline" className={`gap-1.5 capitalize ${
                agent.status === 'success' ? 'text-[#22C55E] border-[#22C55E]/50' : 
                agent.status === 'failed' ? 'text-[#EF4444] border-[#EF4444]/50' : 
                agent.status === 'running' ? 'text-[#6366F1] border-[#6366F1]/50' : ''
              }`}>
                {getStatusIcon(agent.status)}
                {agent.status}
              </Badge>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              {/* TinyFish Iframe */}
              <div className="h-[300px] w-full bg-[#0A0A0F] relative overflow-hidden">
                {agent.streamingUrl ? (
                  <iframe 
                    src={agent.streamingUrl} 
                    className="w-full h-full border-0" 
                    title={agent.url}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#94A3B8] gap-3">
                    <Globe className="w-10 h-10 animate-pulse opacity-20" />
                    <span className="text-sm font-medium animate-pulse">Wait for agent deployment...</span>
                  </div>
                )}
              </div>

              {/* Event Log */}
              <div className="flex-1 bg-[#05050A] p-3 font-mono text-xs overflow-hidden flex flex-col">
                <div className="flex items-center gap-2 mb-2 text-[#6366F1] opacity-70">
                  <Terminal className="w-4 h-4" />
                  <span>Agent Stream Logs</span>
                </div>
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-1.5">
                    {agent.logs.map((log, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-[#3F3F46]">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
                        <span className={`font-bold ${
                          log.type === 'FAILED' ? 'text-[#EF4444]' : 
                          log.type === 'COMPLETE' ? 'text-[#22C55E]' : 
                          log.type === 'NAVIGATING' ? 'text-[#6366F1]' : 'text-zinc-500'
                        }`}>{log.type}</span>
                        <span className="text-zinc-400">— {log.message || JSON.stringify(log.data)}</span>
                      </div>
                    ))}
                    {agent.status === "running" && (
                      <div className="flex gap-2 animate-pulse">
                        <span className="text-[#3F3F46]">[{(Date.now())}]</span>
                        <span className="text-[#6366F1]">PROCESSING</span>
                        <span className="text-zinc-400">...</span>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
