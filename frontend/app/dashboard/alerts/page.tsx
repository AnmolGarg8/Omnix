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
    <div className="max-w-6xl mx-auto px-10 py-12 space-y-20 pb-40">
      {/* Header */}
      <div className="space-y-10">
        <div className="flex items-end justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-[9px] font-bold text-[#00FF6A] uppercase tracking-[3px] opacity-60">
              <Activity size={12} /> REAL-TIME_SIGINT_FEED
            </div>
            <h2 className="text-4xl font-bold uppercase tracking-tight flex items-center gap-4 text-[#E8FFE8]">
              <div className="p-2 bg-[#FF4444]/10 rounded-lg border border-[#FF4444]/20">
                <Bell size={32} className="text-[#FF4444]" />
              </div>
              Logistics Signals
            </h2>
            <p className="text-[#6B9E6B] text-[11px] font-bold uppercase tracking-[2px] opacity-50">ASYNCHRONOUS MISSION ALERTS & ANOMALIES</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B9E6B] opacity-50" />
              <input 
                type="text" 
                placeholder="SEARCH_LOGS..." 
                className="pl-10 h-10 w-40 bg-[#060A06] border border-[#1A2E1A]/40 rounded-lg text-[9px] font-bold uppercase tracking-widest focus:border-[#00FF6A] transition-all outline-none"
              />
            </div>
            <Button variant="outline" className="h-10 border-[#1A2E1A]/40 bg-[#0D130D]/40 text-[#6B9E6B] font-bold uppercase tracking-widest text-[9px] px-6 hover:bg-[#111A11] hover:text-[#00FF6A]">
              <Filter className="w-3.5 h-3.5 mr-2" /> Filter Feed
            </Button>
          </div>
        </div>
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#1A2E1A] to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-12">
          <Card className="cyber-card bg-[#0D130D]/30 border border-[#1A2E1A]/40 overflow-hidden shadow-none">
            {loading ? (
              <div className="p-10 space-y-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full bg-[#111A11] rounded-lg outline-none" />)}
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-[#060A06]/30">
                  <TableRow className="border-[#1A2E1A]/20 hover:bg-transparent">
                    <TableHead className="text-[#6B9E6B] font-bold uppercase tracking-widest text-[9px] h-14 px-8">Priority</TableHead>
                    <TableHead className="text-[#6B9E6B] font-bold uppercase tracking-widest text-[9px] h-14">Origin</TableHead>
                    <TableHead className="text-[#6B9E6B] font-bold uppercase tracking-widest text-[9px] h-14">Brief</TableHead>
                    <TableHead className="text-[#6B9E6B] font-bold uppercase tracking-widest text-[9px] h-14 px-8 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.length === 0 ? (
                    <TableRow className="border-none">
                      <TableCell colSpan={4} className="h-[400px] text-center">
                         <div className="flex flex-col items-center justify-center space-y-4 opacity-20 grayscale">
                            <ShieldAlert className="w-12 h-12 text-[#6B9E6B]" />
                            <p className="text-[#6B9E6B] font-black uppercase tracking-[4px] text-xs">NO_ANOMALIES_DETECTED</p>
                         </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    alerts.map((alert) => (
                      <TableRow key={alert.alert_id} className={`border-[#1A2E1A]/20 transition-colors hover:bg-[#00FF6A]/5 group relative ${alert.acknowledged ? 'opacity-30 grayscale' : ''}`}>
                        <TableCell className="px-8 py-6">
                          <Badge variant="outline" className="uppercase text-[8px] font-black tracking-widest px-2 py-0.5" style={{ color: getPriorityColor(alert.priority), borderColor: `${getPriorityColor(alert.priority)}44`, background: `${getPriorityColor(alert.priority)}11` }}>
                            {alert.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-[#E8FFE8] uppercase tracking-wide text-xs">
                          {alert.mission_name}
                        </TableCell>
                        <TableCell>
                          <p className="text-xs font-medium text-[#E8FFE8]/80 line-clamp-1 max-w-[200px]">{alert.brief}</p>
                        </TableCell>
                        <TableCell className="px-8 text-right">
                          <div className="flex items-center justify-end gap-2">
                             {!alert.acknowledged && (
                               <Button 
                                 size="icon" 
                                 className="h-8 w-8 bg-[#111A11] border border-[#1A2E1A] hover:bg-[#00FF6A] text-[#00FF6A] hover:text-[#060A06] transition-all rounded-md"
                                 onClick={() => handleAcknowledge(alert.alert_id)}
                               >
                                 <Check className="w-3.5 h-3.5" />
                               </Button>
                             )}
                             <Button size="icon" variant="ghost" className="h-8 w-8 text-[#6B9E6B] hover:text-[#FF4444] hover:bg-[#FF4444]/10">
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
        <div className="space-y-12">
           <AlertConfig settings={settings} onUpdate={handleUpdateSettings} />
           
           <Card className="cyber-card bg-[#0D130D]/20 border-[#1A2E1A]/40 overflow-hidden grayscale opacity-30">
              <div className="p-8 space-y-6">
                 <div className="flex items-center gap-3 text-[#6B9E6B]">
                   <Terminal size={14} />
                   <span className="text-[10px] font-bold uppercase tracking-widest">SYSTEM_REGISTRY</span>
                 </div>
                 <p className="text-[10px] text-[#6B9E6B] font-bold leading-relaxed uppercase tracking-wider">EXTERNAL ROUTING MAINTENANCE IN PROGRESS.</p>
                 <div className="h-[1px] bg-[#1A2E1A]/40"></div>
                 <div className="flex items-center justify-between text-[9px] font-bold text-[#6B9E6B]/60 uppercase">
                    <span>STATUS</span>
                    <span className="text-[#FF4444]">OFFLINE</span>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
