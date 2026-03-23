"use client";
import React, { useEffect, useState } from "react";
import { getAlerts, acknowledgeAlert, getSettings, updateSettings } from "@/lib/api";
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
import { Check, Trash2, Bell, ShieldAlert, Cpu, Filter, Search, ArrowRight, Activity, Terminal } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { AlertConfig } from "@/components/AlertConfig";
import { Skeleton } from "@/components/ui/skeleton";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSettings = async (newSettings: any) => {
    try {
      await updateSettings(newSettings);
      setSettings(newSettings);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAlerts = async () => {
    try {
      const data = await getAlerts();
      setAlerts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (id: string) => {
    try {
      await acknowledgeAlert(id);
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "CRITICAL": return "#FF4444";
      case "HIGH": return "#F59E0B";
      case "MEDIUM": return "#00FF6A";
      default: return "#6B9E6B";
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-8 space-y-12 pb-32">
      {/* Header */}
      <div className="flex items-end justify-between pb-6 border-b border-[#1A2E1A]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold text-[#00FF6A] uppercase tracking-[3px] mb-2 opacity-70">
            <Activity size={12} /> REAL-TIME_SIGINT_FEED
          </div>
          <h2 className="text-3xl font-bold uppercase tracking-tight flex items-center gap-3 text-[#E8FFE8]">
            <div className="p-2 bg-[#FF4444]/10 rounded-lg border border-[#FF4444]/20">
              <Bell size={28} className="text-[#FF4444]" />
            </div>
            Logistics Signals
          </h2>
          <p className="text-[#6B9E6B] text-xs font-medium uppercase tracking-[2px] ml-1">ASYNCHRONOUS MISSION ALERTS & ANOMALIES</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B9E6B]" />
            <input 
              type="text" 
              placeholder="SEARCH_LOGS..." 
              className="pl-10 h-10 w-48 bg-[#060A06] border border-[#1A2E1A] rounded-lg text-[10px] font-bold uppercase tracking-widest focus:border-[#00FF6A] transition-all outline-none"
            />
          </div>
          <Button variant="outline" className="h-10 border-[#1A2E1A] bg-[#0D130D] text-[#6B9E6B] font-bold uppercase tracking-widest text-[10px] px-6 hover:bg-[#111A11] hover:text-[#00FF6A]">
            <Filter className="w-3.5 h-3.5 mr-2" /> Filter Feed
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
        {/* Main Feed */}
        <div className="xl:col-span-3">
          <Card className="cyber-card bg-[#0D130D]/80 border-[#1A2E1A] overflow-hidden shadow-2xl">
            <div className="scan-top absolute top-0 left-0 right-0 h-1"></div>
            {loading ? (
              <div className="p-10 space-y-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full bg-[#111A11] rounded-lg outline-none" />)}
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-[#060A06]/50">
                  <TableRow className="border-[#1A2E1A] hover:bg-transparent">
                    <TableHead className="text-[#6B9E6B] font-bold uppercase tracking-widest text-[9px] h-12 px-6">Priority</TableHead>
                    <TableHead className="text-[#6B9E6B] font-bold uppercase tracking-widest text-[9px] h-12">Origin_Mission</TableHead>
                    <TableHead className="text-[#6B9E6B] font-bold uppercase tracking-widest text-[9px] h-12">Intelligence_Brief</TableHead>
                    <TableHead className="text-[#6B9E6B] font-bold uppercase tracking-widest text-[9px] h-12">Sync_Time</TableHead>
                    <TableHead className="text-[#6B9E6B] font-bold uppercase tracking-widest text-[9px] h-12 px-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.length === 0 ? (
                    <TableRow className="border-none">
                      <TableCell colSpan={5} className="h-[400px] text-center">
                         <div className="flex flex-col items-center justify-center space-y-4 opacity-30 grayscale">
                            <div className="w-16 h-16 rounded-full bg-[#111A11] border border-[#1A2E1A] flex items-center justify-center">
                               <ShieldAlert className="w-8 h-8 text-[#6B9E6B]" />
                            </div>
                            <p className="text-[#6B9E6B] font-black uppercase tracking-[4px] text-xs">NO_ANOMALIES_DETECTED</p>
                         </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    alerts.map((alert) => (
                      <TableRow key={alert.alert_id} className={`border-[#1A2E1A] transition-colors hover:bg-[#00FF6A]/5 group relative ${alert.acknowledged ? 'opacity-40 grayscale' : ''}`}>
                        {/* Status Strip */}
                        <td className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background: getPriorityColor(alert.priority) }}></td>
                        
                        <TableCell className="px-6 py-5">
                          <Badge variant="outline" className="uppercase text-[8px] font-black tracking-widest px-2 py-0.5" style={{ color: getPriorityColor(alert.priority), borderColor: `${getPriorityColor(alert.priority)}44`, background: `${getPriorityColor(alert.priority)}11` }}>
                            {alert.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-[#E8FFE8] uppercase tracking-wide text-xs">
                          <div className="flex flex-col">
                            <span>{alert.mission_name}</span>
                            <span className="text-[9px] text-[#6B9E6B] font-mono">NODE_HASH_{alert.alert_id.substring(0,8)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-xs font-medium text-[#E8FFE8] line-clamp-1 max-w-sm">{alert.brief}</p>
                        </TableCell>
                        <TableCell className="text-[10px] font-mono text-[#6B9E6B] uppercase font-bold tracking-tight">
                          {alert.sent_at}
                        </TableCell>
                        <TableCell className="px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                             {!alert.acknowledged && (
                               <Button 
                                 size="icon" 
                                 className="h-8 w-8 bg-[#111A11] border border-[#1A2E1A] hover:bg-[#00FF6A] text-[#00FF6A] hover:text-[#060A06] transition-all rounded-md group/btn"
                                 onClick={() => handleAcknowledge(alert.alert_id)}
                               >
                                 <Check className="w-3.5 h-3.5" />
                               </Button>
                             )}
                             <Button size="icon" variant="ghost" className="h-8 w-8 text-[#6B9E6B] hover:text-[#FF4444] hover:bg-[#FF4444]/10 rounded-md">
                               <Trash2 className="w-3.5 h-3.5" />
                             </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>

        {/* Sidebar Config */}
        <div className="space-y-8">
           <AlertConfig settings={settings} onUpdate={handleUpdateSettings} />
           
           <Card className="cyber-card bg-[#0D130D] border-[#1A2E1A] overflow-hidden grayscale opacity-40">
              <div className="p-6 space-y-4">
                 <div className="flex items-center gap-3 text-[#6B9E6B]">
                   <Terminal size={16} />
                   <span className="text-xs font-bold uppercase tracking-tight">System Registry</span>
                 </div>
                 <p className="text-[10px] text-[#6B9E6B] font-medium leading-relaxed uppercase tracking-wider">External Signal Routing is currently in MAINTENANCE_MODE.</p>
                 <div className="h-[1px] bg-[#1A2E1A]"></div>
                 <div className="flex items-center justify-between text-[9px] font-bold text-[#6B9E6B]/60 uppercase">
                    <span>Direct_Outposts</span>
                    <span className="text-[#FF4444]">Offline</span>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
