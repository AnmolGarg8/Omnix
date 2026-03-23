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
import { Settings, ShieldCheck, Mail, Slack, Bell, Cpu, ArrowRight } from "lucide-react";

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

  if (loading) return <div className="flex h-screen items-center justify-center font-black animate-pulse uppercase tracking-[10px] text-[#00FF6A]">SYNCING PERMISSIONS...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-16 pb-20">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111A11] border border-[#00FF6A]/30 text-[10px] font-black tracking-[3px] text-[#00FF6A] uppercase mb-4 holographic">
           <ShieldCheck className="w-3 h-3" /> ROOT ACCESS
        </div>
        <h2 className="text-5xl font-black uppercase tracking-tighter flex items-center gap-4">
          <Settings className="w-12 h-12 text-[#6B9E6B]" /> 
          Neural Core Config
        </h2>
        <p className="text-[#6B9E6B] text-lg font-bold tracking-tight max-w-2xl opacity-80 uppercase leading-relaxed">Modify global surveillance parameters and signal routing endpoints.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Card className="cyber-card bg-[#0D130D] border-[#1A2E1A] shadow-2xl overflow-hidden">
            <CardHeader className="p-8 border-b border-[#1A2E1A] bg-[#111A11]">
              <CardTitle className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter">
                <Mail className="w-6 h-6 text-[#00FF6A]" />
                Signal Receiver
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-[3px] text-[#6B9E6B] ml-1">ADMIN EMAIL</label>
                 <Input 
                   type="email" 
                   className="bg-[#060A06] border-[#1A2E1A] h-14 rounded-xl text-xs font-black uppercase tracking-widest focus:border-[#00FF6A]"
                   value={settings?.email || ""}
                   onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                 />
                 <p className="text-[10px] text-[#6B9E6B] font-bold uppercase tracking-widest py-1 italic opacity-60">Used for High Severity SIGINT alerts.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card bg-[#0D130D] border-[#1A2E1A] shadow-2xl overflow-hidden">
            <CardHeader className="p-8 border-b border-[#1A2E1A] bg-[#111A11]">
              <CardTitle className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter">
                <Bell className="w-6 h-6 text-[#F59E0B]" />
                Threshold Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-[3px] text-[#6B9E6B] ml-1">MINIMUM SIGNAL PRIORITY</label>
                 <Select 
                   value={settings?.alert_min_priority || "MEDIUM"}
                   onValueChange={(val) => setSettings({ ...settings, alert_min_priority: val })}
                 >
                   <SelectTrigger className="bg-[#060A06] border-[#1A2E1A] h-14 rounded-xl text-xs font-black uppercase tracking-widest focus:border-[#00FF6A]">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent className="bg-[#0D130D] border-[#1A2E1A] text-[#E8FFE8] font-bold text-xs uppercase tracking-widest">
                     <SelectItem value="LOW">All Signals (Low+)</SelectItem>
                     <SelectItem value="MEDIUM">MEDIUM + CRITICAL</SelectItem>
                     <SelectItem value="HIGH">HIGH SEVERITY ONLY</SelectItem>
                     <SelectItem value="CRITICAL">ROOT CRITICAL ONLY</SelectItem>
                   </SelectContent>
                 </Select>
                 <p className="text-[10px] text-[#6B9E6B] font-bold uppercase tracking-widest py-1 italic opacity-60">Prevents notification noise from minor changes.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="cyber-card bg-[#0D130D] border-[#1A2E1A] shadow-2xl overflow-hidden">
          <CardHeader className="p-8 border-b border-[#1A2E1A] bg-[#111A11]">
            <CardTitle className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter">
              <Slack className="w-6 h-6 text-[#00FF6A]" />
              External Intelligence Hubs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-[3px] text-[#6B9E6B] ml-1">SLACK WEBHOOK</label>
               <Input 
                 placeholder="https://hooks.slack.com/..."
                 className="bg-[#060A06] border-[#1A2E1A] h-14 rounded-xl text-xs font-black uppercase tracking-widest focus:border-[#00FF6A]"
                 value={settings?.slack_webhook || ""}
                 onChange={(e) => setSettings({ ...settings, slack_webhook: e.target.value })}
               />
            </div>
            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-[3px] text-[#6B9E6B] ml-1">NTFY TOPIC</label>
               <Input 
                 placeholder="omnix_signals_group"
                 className="bg-[#060A06] border-[#1A2E1A] h-14 rounded-xl text-xs font-black uppercase tracking-widest focus:border-[#00FF6A]"
                 value={settings?.ntfy_topic || ""}
                 onChange={(e) => setSettings({ ...settings, ntfy_topic: e.target.value })}
               />
            </div>
          </CardContent>
          <CardFooter className="p-8 pt-0 bg-[#060A06]/20 flex justify-end gap-4 border-t border-[#1A2E1A]/30 h-24">
             <Button 
               type="submit" 
               className="bg-[#00FF6A] text-[#060A06] hover:bg-[#00D156] font-black uppercase tracking-tighter px-12 rounded-full h-12 text-lg shadow-[0_0_20px_#00FF6A33] hover:shadow-[0_0_30px_#00FF6A66] transition-all"
             >
                COMMIT ROOT CONFIG
             </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
