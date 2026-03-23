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
import { Settings, ShieldCheck, Mail, Slack, Bell, Cpu, ArrowRight, Save, Globe, ShieldAlert } from "lucide-react";

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
    <div className="max-w-5xl mx-auto px-10 py-12 space-y-16 pb-40">
      {/* Header Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#00FF6A]/5 border border-[#00FF6A]/10 text-[9px] font-bold tracking-[2px] text-[#00FF6A] uppercase">
              <ShieldCheck size={10} strokeWidth={3} /> ROOT_ENCRYPTION_ACTIVE
            </div>
            <h2 className="text-4xl font-bold uppercase tracking-tight flex items-center gap-4 text-[#E8FFE8]">
              <Settings size={36} className="text-[#00FF6A] opacity-80" />
              Neural Core Config
            </h2>
            <p className="text-[#6B9E6B] text-[11px] font-bold uppercase tracking-[3px] opacity-60">SYSTEM PARAMETERS & ROUTING PROTOCOLS</p>
          </div>
          <Button 
            onClick={handleSave}
            className="bg-[#00FF6A] text-[#060A06] hover:bg-[#00D156] font-bold uppercase tracking-tighter px-10 rounded-lg h-12 text-xs shadow-[0_4px_20px_rgba(0,255,106,0.2)] transition-all gap-2"
          >
            <Save size={14} /> COMMIT ROOT CONFIG
          </Button>
        </div>
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#1A2E1A] to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-[#6B9E6B] uppercase tracking-[3px] px-2 mb-4 opacity-40">NAVIGATION</div>
            <div className="px-4 py-3 rounded-xl bg-[#00FF6A]/5 border border-[#00FF6A]/10 text-[#00FF6A] text-xs font-bold flex items-center gap-3">
              <Cpu size={14} /> CORE_PARAMS
            </div>
            <div className="px-4 py-3 rounded-xl hover:bg-[#111A11] text-[#6B9E6B] text-xs font-bold flex items-center gap-3 cursor-pointer transition-all border border-transparent hover:border-[#1A2E1A]">
              <Globe size={14} /> ENDPOINTS
            </div>
            <div className="px-4 py-3 rounded-xl hover:bg-[#111A11] text-[#6B9E6B] text-xs font-bold flex items-center gap-3 cursor-pointer transition-all border border-transparent hover:border-[#1A2E1A]">
              <ShieldCheck size={14} /> ACCESS_LOG
            </div>
          </div>
          
          <div className="p-6 rounded-2xl border border-[#FF4444]/10 bg-[#FF4444]/5 space-y-3">
             <div className="flex items-center gap-2 text-[#FF4444]">
               <ShieldAlert size={14} strokeWidth={3} />
               <span className="text-[10px] font-bold uppercase tracking-widest">SECURITY</span>
             </div>
             <p className="text-[10px] text-[#FF4444]/60 leading-relaxed font-bold uppercase">MISSION INSTABILITY RISKS DETECTED IN CORE BUFFER.</p>
          </div>
        </div>

        {/* Main Settings Form */}
        <div className="lg:col-span-3 space-y-16">
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-[#6B9E6B] uppercase tracking-[5px] whitespace-nowrap">SIGNAL RECEPTION</span>
              <div className="h-[1px] w-full bg-[#1A2E1A]/40"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="cyber-card bg-[#0D130D]/40 border-[#1A2E1A]/40 overflow-hidden shadow-none hover:border-[#00FF6A]/20 transition-all">
                <div className="p-8 space-y-6">
                  <div className="flex items-center gap-3 text-[#E8FFE8] mb-2 opacity-80">
                    <Mail size={16} className="text-[#00FF6A]" />
                    <span className="text-xs font-bold uppercase tracking-widest">ADMIN_OUTPOST</span>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold text-[#6B9E6B] uppercase tracking-[2px] opacity-50">NOTIFICATION EMAIL</label>
                    <Input 
                      type="email" 
                      className="bg-[#060A06] border-[#1A2E1A] h-11 rounded-lg text-xs font-medium text-[#E8FFE8] focus:border-[#00FF6A] transition-all"
                      value={settings?.email || ""}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    />
                  </div>
                  <p className="text-[10px] text-[#6B9E6B] font-bold uppercase opacity-30 leading-relaxed tracking-tighter">PRIMARY FEED FOR CRITICAL ANOMALIES.</p>
                </div>
              </Card>

              <Card className="cyber-card bg-[#0D130D]/40 border-[#1A2E1A]/40 overflow-hidden shadow-none hover:border-[#00FF6A]/20 transition-all">
                <div className="p-8 space-y-6">
                  <div className="flex items-center gap-3 text-[#E8FFE8] mb-2 opacity-80">
                    <Bell size={16} className="text-[#F59E0B]" />
                    <span className="text-xs font-bold uppercase tracking-widest">THRESHOLD_LOGIC</span>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold text-[#6B9E6B] uppercase tracking-[2px] opacity-50">MIN_SIGNAL_PRIORITY</label>
                    <Select 
                      value={settings?.alert_min_priority || "MEDIUM"}
                      onValueChange={(val) => setSettings({ ...settings, alert_min_priority: val })}
                    >
                      <SelectTrigger className="bg-[#060A06] border-[#1A2E1A] h-11 rounded-lg text-xs font-medium text-[#E8FFE8] focus:border-[#00FF6A] transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0D130D] border-[#1A2E1A] text-[#E8FFE8] font-bold text-xs uppercase tracking-widest">
                        <SelectItem value="LOW">LOW_VERBOSITY</SelectItem>
                        <SelectItem value="MEDIUM">MEDIUM_BALANCED</SelectItem>
                        <SelectItem value="HIGH">HIGH_SEVERITY</SelectItem>
                        <SelectItem value="CRITICAL">ROOT_CRITICAL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-[10px] text-[#6B9E6B] font-bold uppercase opacity-30 leading-relaxed tracking-tighter">BLOCKS BACKGROUND MISSION NOISE.</p>
                </div>
              </Card>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-[#6B9E6B] uppercase tracking-[5px] whitespace-nowrap">EXTERNAL_SIGNAL_HUBS</span>
              <div className="h-[1px] w-full bg-[#1A2E1A]/40"></div>
            </div>
            
            <Card className="cyber-card bg-[#0D130D]/40 border-[#1A2E1A]/40 overflow-hidden shadow-none">
              <div className="p-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-2 opacity-80">
                      <Slack size={16} className="text-[#00FF6A]" />
                      <span className="text-xs font-bold text-[#E8FFE8] uppercase tracking-widest">Slack Webhook</span>
                    </div>
                    <Input 
                      placeholder="https://hooks.slack.com/..."
                      className="bg-[#060A06] border-[#1A2E1A] h-11 rounded-lg text-xs font-medium text-[#E8FFE8] focus:border-[#00FF6A]"
                      value={settings?.slack_webhook || ""}
                      onChange={(e) => setSettings({ ...settings, slack_webhook: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-2 opacity-80">
                      <Cpu size={16} className="text-[#00FF6A]" />
                      <span className="text-xs font-bold text-[#E8FFE8] uppercase tracking-widest">Ntfy.sh Hash</span>
                    </div>
                    <Input 
                      placeholder="omnix_signals_group"
                      className="bg-[#060A06] border-[#1A2E1A] h-11 rounded-lg text-xs font-medium text-[#E8FFE8] focus:border-[#00FF6A]"
                      value={settings?.ntfy_topic || ""}
                      onChange={(e) => setSettings({ ...settings, ntfy_topic: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="p-5 rounded-xl bg-[#060A06] border border-[#1A2E1A] flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#00FF6A] shadow-[0_0_8px_#00FF6A]"></div>
                     <span className="text-[10px] font-bold text-[#6B9E6B] uppercase tracking-[2px] opacity-70">SIGNAL_HUB_STATUS: SECURE</span>
                   </div>
                   <button className="text-[9px] font-bold text-[#00FF6A] uppercase tracking-[2px] hover:text-[#E8FFE8] transition-colors">INITIATE_TEST_BURST</button>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
