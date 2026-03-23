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
import { Check, Trash2, Bell, ShieldAlert, Cpu, Filter, Search, ArrowRight } from "lucide-react";
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
      case "CRITICAL": return "bg-[#FF4444] text-white animate-pulse shadow-[0_0_15px_#FF444466]";
      case "HIGH": return "bg-[#F59E0B] text-[#060A06]";
      case "MEDIUM": return "bg-[#00FF6A]/20 text-[#00FF6A] border border-[#00FF6A]/30";
      default: return "bg-[#0D130D] text-[#6B9E6B] border border-[#1A2E1A]";
    }
  };

  return (
    <div className="space-y-12 pb-20 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <h2 className="text-5xl font-black uppercase tracking-tighter flex items-center gap-4">
             <Bell className="w-12 h-12 text-[#FF4444]" />
             Logistics Signals
          </h2>
          <p className="text-[#6B9E6B] font-bold text-sm tracking-[4px] uppercase opacity-80">Asynchronous mission alerts and structural anomalies.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="h-12 border-[#1A2E1A] bg-transparent text-[#6B9E6B] font-black uppercase tracking-widest text-[10px] px-8 hover:bg-[#111A11]">
              <Filter className="w-4 h-4 mr-2" /> Filter Signals
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
        <div className="xl:col-span-2 space-y-10">
           <div className="cyber-card bg-[#0D130D]/80 border-[#1A2E1A] overflow-hidden shadow-2xl">
              <div className="scan-top absolute top-0 left-0 right-0 h-1"></div>
              {loading ? (
                <div className="p-10 space-y-4">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full bg-[#111A11] rounded-xl outline-none" />)}
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-[#060A06]">
                    <TableRow className="border-[#1A2E1A] hover:bg-transparent">
                      <TableHead className="text-[#6B9E6B] font-black uppercase tracking-widest text-[10px] h-14 px-8">Signal Priority</TableHead>
                      <TableHead className="text-[#6B9E6B] font-black uppercase tracking-widest text-[10px] h-14">Origin</TableHead>
                      <TableHead className="text-[#6B9E6B] font-black uppercase tracking-widest text-[10px] h-14">Brief</TableHead>
                      <TableHead className="text-[#6B9E6B] font-black uppercase tracking-widest text-[10px] h-14">Sync Time</TableHead>
                      <TableHead className="text-[#6B9E6B] font-black uppercase tracking-widest text-[10px] h-14 px-8 text-right">Auth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-60 text-center space-y-4">
                           <div className="w-16 h-16 rounded-full bg-[#111A11] border border-[#1A2E1A] flex items-center justify-center mx-auto mb-4 grayscale opacity-30">
                              <ShieldAlert className="w-8 h-8" />
                           </div>
                           <p className="text-[#6B9E6B] font-bold uppercase tracking-widest text-xs opacity-40">No signal anomalies detected.</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      alerts.map((alert) => (
                        <TableRow key={alert.alert_id} className={`border-[#1A2E1A] transition-colors hover:bg-[#00FF6A]/5 group ${alert.acknowledged ? 'opacity-40 grayscale' : ''}`}>
                          <TableCell className="px-8">
                            <Badge className={`uppercase text-[9px] font-black tracking-widest px-3 py-1 border-none ${getPriorityColor(alert.priority)}`}>
                              {alert.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-black text-[#E8FFE8] uppercase tracking-widest text-xs">{alert.mission_name}</TableCell>
                          <TableCell className="text-xs font-bold text-[#E8FFE8] line-clamp-1 max-w-xs">{alert.brief}</TableCell>
                          <TableCell className="text-[10px] font-mono text-[#6B9E6B] uppercase font-black">{alert.sent_at}</TableCell>
                          <TableCell className="px-8 text-right">
                            <div className="flex items-center justify-end gap-2">
                               {!alert.acknowledged && (
                                 <Button 
                                   size="icon" 
                                   className="h-9 w-9 bg-[#111A11] border border-[#1A2E1A] hover:bg-[#00FF6A] text-[#00FF6A] hover:text-[#060A06] transition-all rounded-lg"
                                   onClick={() => handleAcknowledge(alert.alert_id)}
                                 >
                                   <Check className="w-4 h-4" />
                                 </Button>
                               )}
                               <Button size="icon" variant="ghost" className="h-9 w-9 text-[#FF4444] hover:bg-[#FF4444]/10 rounded-lg">
                                 <Trash2 className="w-4 h-4" />
                               </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
           </div>
        </div>

        <div className="space-y-10">
           <AlertConfig settings={settings} onUpdate={handleUpdateSettings} />
           
           <Card className="cyber-card bg-[#0D130D] border-[#1A2E1A] overflow-hidden grayscale opacity-50 cursor-not-allowed">
              <CardHeader className="p-8 pb-4">
                 <CardTitle className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter">
                   <ArrowRight className="w-6 h-6 text-[#6B9E6B]" />
                   Webhook Registry
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                 <p className="text-xs text-[#6B9E6B] font-bold uppercase tracking-widest leading-relaxed">External Signal Routing is currently in maintenance. Only Email and internal signals are active.</p>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
