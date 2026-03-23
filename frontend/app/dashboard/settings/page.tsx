"use client";
import React, { useEffect, useState } from "react";
import { getSettings, updateSettings } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Settings, ShieldCheck, Mail, Slack, Bell, Cpu, ArrowRight, Save, Globe } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(settings);
      alert("Settings updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-2 border-[#00FF6A] border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="font-black animate-pulse uppercase tracking-[4px] text-[#00FF6A] text-xs">SYNCHRONIZING CORE...</div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12 pb-32">
      {/* Header Section */}
      <div className="relative group">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#111A11]/60 border border-[#00FF6A]/20 text-[9px] font-bold tracking-[2px] text-[#00FF6A] uppercase mb-6">
          <ShieldCheck size={10} strokeWidth={3} /> ROOT_ENCRYPTION_ACTIVE
        </div>
        <div className="flex items-end justify-between gap-6 pb-6 border-b border-[#1A2E1A]">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold uppercase tracking-tight flex items-center gap-3 text-[#E8FFE8]">
              <div className="p-2 bg-[#00FF6A]/10 rounded-lg border border-[#00FF6A]/20">
                <Settings size={28} className="text-[#00FF6A]" />
              </div>
              Neural Core Config
            </h2>
            <p className="text-[#6B9E6B] text-xs font-medium uppercase tracking-[2px] ml-1">SYSTEM PARAMETERS & ROUTING PROTOCOLS</p>
          </div>
          <Button 
            onClick={handleSave}
            className="bg-[#00FF6A] text-[#060A06] hover:bg-[#00D156] font-bold uppercase tracking-tighter px-8 rounded-lg h-11 text-xs shadow-[0_0_20px_#00FF6A22] transition-all gap-2"
          >
            <Save size={14} /> COMMIT ROOT CONFIG
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Sidebar for Settings - Visual Only */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 rounded-xl border border-[#1A2E1A] bg-[#0D130D]/40 space-y-2">
            <div className="text-[10px] font-bold text-[#6B9E6B] uppercase tracking-[2px] px-2 mb-3">Sections</div>
            <div className="px-4 py-3 rounded-lg bg-[#00FF6A]/10 border border-[#00FF6A]/20 text-[#00FF6A] text-xs font-bold flex items-center gap-3">
              <Cpu size={14} /> Core Parameters
            </div>
            <div className="px-4 py-3 rounded-lg hover:bg-[#111A11] text-[#6B9E6B] text-xs font-bold flex items-center gap-3 cursor-pointer transition-colors">
              <Globe size={14} /> Global Endpoints
            </div>
            <div className="px-4 py-3 rounded-lg hover:bg-[#111A11] text-[#6B9E6B] text-xs font-bold flex items-center gap-3 cursor-pointer transition-colors">
              <ShieldCheck size={14} /> Access Control
            </div>
          </div>
          
          <div className="p-6 rounded-xl border border-[#FF4444]/20 bg-[#FF4444]/5 flex items-start gap-4">
             <div className="p-2 rounded-lg bg-[#FF4444]/10 border border-[#FF4444]/20 mt-1">
               <ShieldCheck size={16} className="text-[#FF4444]" />
             </div>
             <div className="space-y-1">
               <div className="text-xs font-bold text-[#FF4444] uppercase tracking-tight">Security Notice</div>
               <p className="text-[10px] text-[#FF4444]/80 leading-relaxed font-medium">Changes to core parameters may impact mission stability. Proceed with caution.</p>
             </div>
          </div>
        </div>

        {/* Main Settings Form */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-6">
            <h3 className="text-xs font-black text-[#6B9E6B] uppercase tracking-[4px] ml-1 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#1A2E1A]"></span> SIGNAL RECEPTION
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="cyber-card bg-[#0D130D] border-[#1A2E1A] overflow-hidden">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-[#E8FFE8] mb-2">
                    <Mail size={16} className="text-[#00FF6A]" />
                    <span className="text-sm font-bold uppercase tracking-tight">Admin Outpost</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-[#6B9E6B] uppercase tracking-[2px]">NOTIFICATION EMAIL</label>
                    <Input 
                      type="email" 
                      className="bg-[#060A06] border-[#1A2E1A] h-12 rounded-lg text-xs font-medium text-[#E8FFE8] focus:border-[#00FF6A] transition-all"
                      value={settings?.email || ""}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    />
                  </div>
                  <p className="text-[10px] text-[#6B9E6B] font-medium leading-relaxed opacity-60">Primary address for high-severity signal anomalies.</p>
                </div>
              </Card>

              <Card className="cyber-card bg-[#0D130D] border-[#1A2E1A] overflow-hidden">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-[#E8FFE8] mb-2">
                    <Bell size={16} className="text-[#F59E0B]" />
                    <span className="text-sm font-bold uppercase tracking-tight">Priority Filter</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-[#6B9E6B] uppercase tracking-[2px]">MINIMUM SIGNAL PRIORITY</label>
                    <Select 
                      value={settings?.alert_min_priority || "MEDIUM"}
                      onValueChange={(val) => setSettings({ ...settings, alert_min_priority: val })}
                    >
                      <SelectTrigger className="bg-[#060A06] border-[#1A2E1A] h-12 rounded-lg text-xs font-medium text-[#E8FFE8] focus:border-[#00FF6A] transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0D130D] border-[#1A2E1A] text-[#E8FFE8] font-bold text-xs uppercase tracking-widest">
                        <SelectItem value="LOW">Low (Verbose)</SelectItem>
                        <SelectItem value="MEDIUM">MEDIUM (Balanced)</SelectItem>
                        <SelectItem value="HIGH">High Severity</SelectItem>
                        <SelectItem value="CRITICAL">Critical Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-[10px] text-[#6B9E6B] font-medium leading-relaxed opacity-60">Filters out background noise from low-impact missions.</p>
                </div>
              </Card>
            </div>
          </section>

          <section className="space-y-6 pt-4">
            <h3 className="text-xs font-black text-[#6B9E6B] uppercase tracking-[4px] ml-1 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#1A2E1A]"></span> EXTERNAL HUBS
            </h3>
            
            <Card className="cyber-card bg-[#0D130D] border-[#1A2E1A] overflow-hidden">
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                      <Slack size={16} className="text-[#00FF6A]" />
                      <span className="text-sm font-bold text-[#E8FFE8] uppercase tracking-tight">Slack Webhook</span>
                    </div>
                    <Input 
                      placeholder="https://hooks.slack.com/..."
                      className="bg-[#060A06] border-[#1A2E1A] h-12 rounded-lg text-xs font-medium text-[#E8FFE8] focus:border-[#00FF6A]"
                      value={settings?.slack_webhook || ""}
                      onChange={(e) => setSettings({ ...settings, slack_webhook: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                      <Cpu size={16} className="text-[#00FF6A]" />
                      <span className="text-sm font-bold text-[#E8FFE8] uppercase tracking-tight">Ntfy Channel</span>
                    </div>
                    <Input 
                      placeholder="omnix_signals_group"
                      className="bg-[#060A06] border-[#1A2E1A] h-12 rounded-lg text-xs font-medium text-[#E8FFE8] focus:border-[#00FF6A]"
                      value={settings?.ntfy_topic || ""}
                      onChange={(e) => setSettings({ ...settings, ntfy_topic: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-[#111A11] border border-[#1A2E1A] flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-[#00FF6A] shadow-[0_0_8px_#00FF6A]"></div>
                     <span className="text-[10px] font-bold text-[#6B9E6B] uppercase tracking-[1px]">Hub Connectivity Status: SECURE</span>
                   </div>
                   <button className="text-[10px] font-bold text-[#00FF6A] uppercase tracking-[1px] hover:underline">Test Integration</button>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
