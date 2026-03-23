"use client";
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Bell, Mail, Slack, Send, Loader2, ShieldCheck } from "lucide-react";

export const AlertConfig = ({ settings, onUpdate }: { settings: any; onUpdate: (s: any) => void }) => {
  const [email, setEmail] = useState("");
  const [slack, setSlack] = useState("");
  const [ntfy, setNtfy] = useState("");
  const [minPriority, setMinPriority] = useState("LOW");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setEmail(settings.email || "");
      setSlack(settings.slack_webhook || "");
      setNtfy(settings.ntfy_topic || "");
      setMinPriority(settings.alert_min_priority || "LOW");
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    // Mimic API delay
    await new Promise(r => setTimeout(r, 1000));
    onUpdate({
      email,
      slack_webhook: slack,
      ntfy_topic: ntfy,
      alert_min_priority: minPriority
    });
    setIsSaving(false);
  };

  return (
    <Card className="cyber-card bg-[#0D130D] border-[#1A2E1A] shadow-2xl overflow-hidden relative">
      <div className="h-1 bg-[#00FF6A]/20 absolute top-0 left-0 right-0"></div>
      <CardHeader className="p-8">
        <CardTitle className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter">
          <Bell className="w-6 h-6 text-[#FF4444]" />
          Alert Orchestration
        </CardTitle>
        <CardDescription className="text-xs font-bold text-[#6B9E6B] uppercase tracking-widest mt-2">Configure signal routing for cross-node anomalies.</CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-0 space-y-8">
        {/* Email */}
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-[3px] text-[#6B9E6B] ml-1 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#00FF6A]" /> Email Outpost
          </Label>
          <Input 
            className="bg-[#060A06] border-[#1A2E1A] h-14 rounded-xl text-xs font-black uppercase tracking-widest focus:border-[#00FF6A]" 
            placeholder="alerts@yourdomain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Slack */}
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-[3px] text-[#6B9E6B] ml-1 flex items-center gap-2">
            <Slack className="w-4 h-4 text-[#00FF6A]" /> Slack Integration
          </Label>
          <div className="flex gap-3">
            <Input 
              className="bg-[#060A06] border-[#1A2E1A] h-14 rounded-xl text-xs font-black uppercase tracking-widest focus:border-[#00FF6A] flex-1" 
              placeholder="https://hooks.slack.com/services/..."
              value={slack}
              onChange={(e) => setSlack(e.target.value)}
            />
            <Button variant="outline" className="h-14 bg-transparent border-[#1A2E1A] text-[#6B9E6B] font-bold uppercase tracking-widest px-6 hover:bg-[#111A11]">TEST</Button>
          </div>
        </div>

        {/* Ntfy */}
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-[3px] text-[#6B9E6B] ml-1 flex items-center gap-2">
            <Send className="w-4 h-4 text-[#00FF6A]" /> Ntfy.sh Topic
          </Label>
           <div className="flex gap-3">
            <Input 
              className="bg-[#060A06] border-[#1A2E1A] h-14 rounded-xl text-xs font-black uppercase tracking-widest focus:border-[#00FF6A] flex-1" 
              placeholder="my-secret-omnix-topic"
              value={ntfy}
              onChange={(e) => setNtfy(e.target.value)}
            />
            <Button variant="outline" className="h-14 bg-transparent border-[#1A2E1A] text-[#6B9E6B] font-bold uppercase tracking-widest px-6 hover:bg-[#111A11]">TEST</Button>
          </div>
        </div>

        {/* Threshold */}
        <div className="space-y-3 pt-6 border-t border-[#1A2E1A]">
          <Label className="text-[10px] font-black uppercase tracking-[3px] text-[#6B9E6B] ml-1">Sensitivity Threshold</Label>
          <Select value={minPriority} onValueChange={(val) => val && setMinPriority(val)}>
             <SelectTrigger className="bg-[#060A06] border-[#1A2E1A] h-14 rounded-xl text-xs font-black uppercase tracking-widest focus:border-[#00FF6A]">
               <SelectValue placeholder="Select Threshold" />
             </SelectTrigger>
             <SelectContent className="bg-[#0D130D] border-[#1A2E1A] text-[#E8FFE8] font-bold uppercase tracking-widest text-xs">
               <SelectItem value="LOW">All Signals (Low+)</SelectItem>
               <SelectItem value="MEDIUM">MEDIUM + CRITICAL</SelectItem>
               <SelectItem value="HIGH">HIGH SEVERITY ONLY</SelectItem>
               <SelectItem value="CRITICAL">ROOT CRITICAL ONLY</SelectItem>
             </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="bg-[#111A11]/30 p-8 border-t border-[#1A2E1A] flex justify-end gap-4 h-24">
        <Button 
          className="bg-[#00FF6A] text-[#060A06] hover:bg-[#00D156] font-black uppercase tracking-tighter px-10 rounded-full h-12 shadow-[0_0_20px_#00FF6A33]"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          SAVE PERMISSIONS
        </Button>
      </CardFooter>
    </Card>
  );
};
